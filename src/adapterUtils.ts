/**
 * graphql-adapter库的工具类
 * 地址 https://github.com/puti94/graphql-adapter
 */
import {FieldsArgs, generateFieldsText, generateFieldText, FieldsListArgs, FieldConfig} from './generateText'
import upperFirst from 'lodash/upperFirst'

import pick from 'lodash/pick'
import set from 'lodash/set'
import merge from 'lodash/merge'

export type QueryTableParams = {
    //表名
    name: string,
    //查询字段
    fields: FieldsArgs,
    //是否查询列表
    isList?: boolean,
    //是否返回总量
    withCount?: boolean,
    //同级的其它查询字段
    otherFields?: string
};

/**
 * 查询单个表
 * @param config
 * @returns {string}
 */
export function queryTable(config: QueryTableParams) {
    const {name, fields, isList, withCount, otherFields} = config;
    return `query ${name}${isList ? 'List' : 'FindOne'}(${isList ? `$limit: Int $offset: Int $order: [${upperFirst(name)}OrderType] $subQuery:Boolean` : ''} $where: JSONType $scope: [String]){
    ${name} {${withCount ? `
      total:aggregation(aggregateFunction:count,field: _all,where: $where)` : ''}
      ${isList ? 'list' : 'one'}(${isList ? 'limit: $limit, offset: $offset,order: $order,subQuery: $subQuery,scope: $scope, ' : ''}where: $where) {
       ${generateFieldsText(fields)}
    }
  }${otherFields || ''}
}`
}


export type FieldMetadata = {
    type: string;
    title?: string;
    prop?: string;
    field?: string | FieldsListArgs;
    isList?: boolean;
    [props: string]: any;
}

export type FieldMetadataMap = {
    [name: string]: FieldMetadata
}

export type TableFieldsMap = {
    [table: string]: FieldMetadataMap
}

export type FlattenConfig<T extends TableFieldsMap> = {
    /**
     * 类型名
     */
    name: keyof T;
    /**
     * 递归的深度,默认3
     */
    deep?: string;
    /**
     * 抽离的参数
     */
    pickFields: string[];
    /**
     * 覆盖配置
     */
    mergeFields?: {
        [name: string]: Partial<FieldMetadata>
    };
};

type TableMetadata = {
    type: string,
    fields: {
        type: string;
        title: string;
        prop?: string;
        field?: string;
        isList?: boolean;
    }[],
    name: string
};

export function tableList2Map(list: TableMetadata[]): TableFieldsMap {
    return list.reduce<TableFieldsMap>((memo, item) => {
        memo[item.type] = item.fields.reduce<FieldMetadataMap>((fields, item) => {
            const {field, ...other} = item;
            fields[field] = other;
            return fields;
        }, {})
        return memo
    }, {})
}

function getField(field: FieldMetadata, key: string, parentName?: string) {
    const fieldData = field.field || key;
    if (!parentName) return fieldData
    let [first, ...other] = parentName.split('.');
    if (other.length === 0) {
        return {
            name: first,
            fields: typeof fieldData === "string" ? [fieldData] : fieldData
        }
    }
    return set({name: first}, `fields.${other.join('.fields.')}.fields`, typeof fieldData === "string" ? [fieldData] : fieldData)
}


/**
 * 扁平化参数
 * @param metadata
 * @param config
 * @returns {any}
 */
export function flattenFields<T extends TableFieldsMap>(metadata: T, config: FlattenConfig<T>): FieldMetadata[] {
    const {name, deep = 3, pickFields, mergeFields = {}} = config;
    const fieldsMap = metadata[name];
    if (!fieldsMap) return []

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
                }
                // @ts-ignore
                memo[prop].field = getField(field, key, parentName)
            } else if (!field.isList) {
                memo = merge(memo, flattenObj(field.type, prop))
            }
            return memo
        }, {})
    }

    const obj = flattenObj(name);
    const pickObj = pick(obj, pickFields);
    const mergeObj = merge(pickObj, mergeFields);
    return Object.values(mergeObj);
}

