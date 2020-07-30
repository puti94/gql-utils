/**
 * graphql-adapter库的工具类
 * 地址 https://github.com/puti94/graphql-adapter
 */
import {generateFieldsText} from './generateText'
import upperFirst from 'lodash/upperFirst'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import set from 'lodash/set'
import merge from 'lodash/merge'
import {
    MutateCreateParams,
    QueryAggregateParams,
    QueryTableParams,
    FieldMetadataMap,
    MutateUpdateParams,
    MutateRemoveParams,
    TableMetadata,
    TableFieldsMap,
    FieldMetadata, PickConfig, FlattenConfig
} from './type'


/**
 * 生成查询单个表的语句
 * @param config
 * @returns {string}
 */
export function queryTable(config: QueryTableParams) {
    const {name, fields, isList, withCount, otherFields} = config;
    return `query ${name}${isList ? 'List' : 'FindOne'}(${isList ? `$limit:Int,$offset:Int,$order:[${upperFirst(name)}OrderType],$subQuery:Boolean,` : ''}$where:JSONType,$scope:[String]){
    ${name} {${withCount ? `
      total:aggregate(fn:COUNT,field: _all,where: $where)` : ''}
      ${isList ? 'list' : 'one'}(${isList ? 'limit:$limit,offset:$offset,order:$order,subQuery:$subQuery,' : ''}where:$where,scope:$scope) {
       ${generateFieldsText(fields)}
    }
  }${otherFields || ''}
}`
}

/**
 * 生成聚合查询的语句
 * @param config
 * @returns {string}
 */
export function queryAggregate(config: QueryAggregateParams) {
    const {name, otherFields, field, fn, alias} = config;
    return `query ${name}Aggregate($where:JSONType){
    ${name} {
      ${alias ? `${alias}:` : ''}aggregate(fn:${fn},field: ${field},where: $where)
    }${otherFields || ''}
}`
}


/**
 * 生成创建语句
 * @param config
 * @returns {string}
 */
export function mutateCreate(config: MutateCreateParams) {
    const {name, fields} = config;
    return `mutation ${name}Create($data:${upperFirst(name)}CreateInput!){
    ${name} {
      create(data: $data){
        ${generateFieldsText(fields)}
      }
    }
}`
}

/**
 * 生成更新语句
 * @param config
 * @returns {string}
 */
export function mutateUpdate<T extends FieldMetadataMap>(config: MutateUpdateParams<T>) {
    const {name, fields, pkName} = config;
    return `mutation ${name}Update($data:${upperFirst(name)}UpdateInput!,$id:ID!){
    ${name} {
      update(data: $data,${pkName}: $id){
        ${generateFieldsText(fields)}
      }
    }
}`
}


/**
 * 生成删除语句
 * @param config
 * @returns {string}
 */
export function mutateRemove<T extends FieldMetadataMap>(config: MutateRemoveParams<T>) {
    const {name, pkName} = config;
    return `mutation ${name}Remove($id:ID!){
    ${name} {
      remove(${pkName}: $id)
    }
}`
}


/**
 * 生成type和字段的映射关系
 * @param list
 * @returns {TableFieldsMap}
 * @param key
 */
export function tableList2Map(list: TableMetadata[], key: 'type' | 'name' = 'type'): TableFieldsMap {
    return list.reduce<TableFieldsMap>((memo, tableItem) => {
        memo[tableItem[key]] = tableItem.fields.reduce<FieldMetadataMap>((fields, fieldItem) => {
            const {name, ...other} = fieldItem;
            fields[name] = {
                ...other
            };
            return fields;
        }, {})
        return memo
    }, {})
}

/**
 * 生成type和name的映射关系
 * @param list
 * @returns {{[p: string]: string}}
 */
export function tableList2TypeNameMap(list: TableMetadata[]): { [type: string]: string } {
    return list.reduce<{ [type: string]: string }>((memo, item) => {
        memo[item.type] = item.name;
        return memo
    }, {})
}

/**
 * 生成name和type的映射关系
 * @param list
 * @returns {{[p: string]: string}}
 */
export function tableList2NameTypeMap(list: TableMetadata[]): { [type: string]: string } {
    return list.reduce<{ [type: string]: string }>((memo, item) => {
        memo[item.name] = item.type;
        return memo
    }, {})
}

function getField(field: FieldMetadata, key: string, parentName?: string) {
    const fieldData = field.field || key;
    if (!parentName) return fieldData
    let [first, ...other] = parentName.split('.');
    const fields = typeof fieldData === "string" ? [fieldData] : fieldData;
    if (other.length === 0) {
        return {
            name: first,
            fields
        }
    }
    return set({name: first}, `fields.${other.join('.fields.')}.fields`, fields)
}

/**
 * 获取选取的字段
 * @param fields
 * @param only
 * @param exclude
 * @returns {FieldMetadataMap}
 */
export function getPickFields<T extends TableFieldsMap>(fields: FieldMetadataMap, {only, exclude}: Omit<PickConfig<T>, 'deep'>): FieldMetadataMap {
    if (only) {
        fields = pick(fields, only);
    } else if (exclude) {
        fields = omit(fields, exclude)
    }
    return fields
}

/**
 * 扁平化选项
 * @param metadata
 * @param config
 * @returns {any}
 */
export function flattenFields<T extends TableFieldsMap>(metadata: T, config: FlattenConfig<T>): FieldMetadataMap {
    const {name, deep = 3, only, exclude, mergeFields = {}} = config;
    const fieldsMap = metadata[name];
    if (!fieldsMap) return {}

    function flattenObj(name: keyof T, parentName?: string) {
        if (parentName && parentName.split('.').length >= deep) return;
        const fieldsMap = metadata[name];
        if (!fieldsMap) return {}
        return Object.keys(fieldsMap).reduce<FieldMetadataMap>((memo, key) => {
            const field = fieldsMap[key];
            const subFields = metadata[field.type];
            const prop = `${parentName ? `${parentName}.${key}` : key}`;
            if (!subFields) {
                memo[prop] = {
                    ...field,
                    prop,
                    type: field.type,
                    typeName: name
                }
                // @ts-ignore
                memo[prop].field = getField(field, key, parentName)
            } else {
                memo = merge(memo, flattenObj(field.type, prop))
            }
            return memo
        }, {})
    }

    const fields = flattenObj(name);
    const pickFields = getPickFields(fields, {only, exclude});
    return merge(pickFields, mergeFields);
}
