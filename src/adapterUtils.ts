/**
 * graphql-adapter库的工具类
 * 地址 https://github.com/puti94/graphql-adapter
 */
import {FieldsArgs, FieldsListArgs, generateFieldsText} from './generateText'
import upperFirst from 'lodash/upperFirst'

import pick from 'lodash/pick'
import set from 'lodash/set'
import merge from 'lodash/merge'

export type QueryTableBaseParams = {
    //表名
    name: string,
    //同级的其它查询字段
    otherFields?: string
}

export type AggregateFunctionMenu = 'sum' | 'max' | 'min' | 'count' | 'avg'

export type QueryAggregationParams = QueryTableBaseParams & {
    fn: AggregateFunctionMenu,
    field: '_all' | string
}

export type QueryTableParams = QueryTableBaseParams & {
    //查询字段
    fields: FieldsArgs,
    //是否查询列表
    isList?: boolean,
    //是否返回总量
    withCount?: boolean
};

/**
 * 生成查询单个表的语句
 * @param config
 * @returns {string}
 */
export function queryTable(config: QueryTableParams) {
    const {name, fields, isList, withCount, otherFields} = config;
    return `query ${name}${isList ? 'List' : 'FindOne'}(${isList ? `$limit:Int,$offset:Int,$order:[${upperFirst(name)}OrderType],$subQuery:Boolean,$groupBy:String,` : ''}$where:JSONType,$scope:[String]){
    ${name} {${withCount ? `
      total:aggregate(fn:count,field: _all,where: $where)` : ''}
      ${isList ? 'list' : 'one'}(${isList ? 'limit:$limit,offset:$offset,order:$order,subQuery:$subQuery,groupBy:$groupBy,' : ''}where:$where,scope:$scope) {
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
export function queryAggregate(config: QueryAggregationParams) {
    const {name, otherFields, field, fn} = config;
    return `query ${name}Aggregate($where:JSONType){
    ${name} {
      aggregate(fn:${fn},field: ${field},where: $where)
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
    [name: string]: FieldMetadata,
}

export type TableFieldsMap = {
    [tableType: string]: FieldMetadataMap
}

export type FlattenConfig<T extends TableFieldsMap> = {
    /**
     * 类型名
     */
    name: keyof T;
    /**
     * 递归的深度,默认3
     */
    deep?: number;
    /**
     * 抽离的参数
     */
    pickFields?: string[];
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
        name: string;
        isList?: boolean;
    }[],
    name: string
};

/**
 * 生成type和字段的映射关系
 * @param list
 * @returns {TableFieldsMap}
 */
export function tableList2Map(list: TableMetadata[]): TableFieldsMap {
    return list.reduce<TableFieldsMap>((memo, tableItem) => {
        memo[tableItem.type] = tableItem.fields.reduce<FieldMetadataMap>((fields, fieldItem) => {
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
 * 扁平化选项
 * @param metadata
 * @param config
 * @returns {any}
 */
export function flattenFields<T extends TableFieldsMap>(metadata: T, config: FlattenConfig<T>): FieldMetadataMap {
    const {name, deep = 3, pickFields, mergeFields = {}} = config;
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

    let obj = flattenObj(name);
    if (pickFields) {
        obj = pick(obj, pickFields);
    }
    return merge(obj, mergeFields);
}


type QueryTableFunc<T extends FieldMetadataMap> = (config?: { pickFields?: [keyof T] }) => string
type QueryAggregationFunc<T extends FieldMetadataMap> = (config: { field: '_all' | keyof T, fn: AggregateFunctionMenu }) => string


type TableGqlFields<T extends TableFieldsMap> = {
    [key in keyof T]: {
        one: QueryTableFunc<T[key]>,
        list: QueryTableFunc<T[key]>,
        listPage: QueryTableFunc<T[key]>,
        aggregate: QueryAggregationFunc<T[key]>,
    }
}


/**
 * 自动生成查询方法
 * @param metadata
 * @returns {TableGqlFields<T>}
 * @param config
 */
export function generateGqlFields<T extends TableFieldsMap>(metadata: T,
                                                            config: { deep?: number, typeNameMap?: { [type: string]: string } } =
                                                                {
                                                                    deep: 3,
                                                                    typeNameMap: {}
                                                                }): TableGqlFields<T> {
    const _cacheMap = new Map<keyof T, FieldMetadataMap>();

    function getFields(name: keyof T) {
        if (!_cacheMap.has(name)) {
            _cacheMap.set(name, flattenFields(metadata, {name, deep: config.deep}))
        }
        return _cacheMap.get(name)
    }

    function getQueryFunc<F extends FieldMetadataMap>(params: Omit<QueryTableParams, 'fields'> | QueryAggregationParams):
        QueryTableFunc<F> {
        return ({pickFields} = {}) => {
            let fields = getFields(params.name as keyof T);
            if (pickFields) {
                fields = pick(fields, pickFields);
            }
            const pickFieldList = Object.values(fields).map(t => t.field);
            return queryTable({...params, name: getTableName(params.name), fields: pickFieldList})
        }
    }

    function getQueryAggregationFunc<F extends FieldMetadataMap>(name: string):
        QueryAggregationFunc<F> {
        return ({fn, field}) => {
            return queryAggregate({
                fn,
                name: getTableName(name),
                field: field as string
            })
        }
    }

    function getTableName(type: string): string {
        return config.typeNameMap[type] || type
    }

    return Object.keys(metadata).reduce<TableGqlFields<T>>((memo, key: keyof T) => {
        memo[key] = {
            one: getQueryFunc({name: key as string, isList: false, withCount: false}),
            list: getQueryFunc({name: key as string, isList: true, withCount: false}),
            listPage: getQueryFunc({name: key as string, isList: true, withCount: true}),
            aggregate: getQueryAggregationFunc(key as string),
        }
        return memo;
    }, {} as TableGqlFields<T>)
}
