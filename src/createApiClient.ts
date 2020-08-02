/**
 * graphql-adapter库的工具类
 * 地址 https://github.com/puti94/graphql-adapter
 */

import gql from 'graphql-tag'
import {
    flattenFields,
    getPickFields,
    queryTable,
    queryAggregate,
    mutateCreate,
    mutateUpdate,
    mutateRemove
} from "./adapterUtils";

import get from 'lodash/get'

import {
    TableMetadataMap,
    FieldMetadataMap,
    PickConfig,
    QueryTableParams,
    QueryAggregateParams,
    TableFieldsMap,
    AggregateFunctionMenu
} from "./type";
import * as VueType from './type-vue'
import * as ReactType from './type-react'
import {FetchResult} from "apollo-link";
import {MutationFunctionOptions} from "@apollo/client/react/types/types.d.ts";
import {ApolloClient} from "@apollo/client/index.d.ts";
import {assertClient, assertUseMutation, assertUseQuery} from "./error";
import {ApolloClient as BaseApolloClient, ApolloQueryResult, MutationOptions, QueryOptions} from "apollo-client";
import {DocumentNode} from "graphql";
import {WhereOptions} from "./sequelize-type";

export type TypeOptions = VueType.TypeName | ReactType.TypeName

/**
 * 创建apiClient配置
 */
export type ApiConfig<T extends TableMetadataMap, Type extends TypeOptions = 'vue'> =
    (Type extends 'vue' ?
        {
            /**
             * 传入`@vue/apollo-composable`的useQuery方法
             */
            useQuery?: VueType.FuncUseQuery,
            /**
             * 传入`@vue/apollo-composable`的useMutation方法
             */
            useMutation?: VueType.FuncUseMutation,
            /**
             * 传入`@vue/apollo-composable`的useResult方法
             */
            useResult?: VueType.FuncUseResult,
        } :
        {
            /**
             * 传入`@apollo/client`的useQuery方法
             */
            useQuery?: ReactType.FuncUseQuery,
            /**
             * 传入`@apollo/client`的useMutation方法
             */
            useMutation?: ReactType.FuncUseMutation,
            useResult?: ReactType.FuncUseResult,
        }) &
    {
        /**
         * 递归生成关联字段的深度,默认3
         */
        deep?: number,
        /**
         * 架构类型 vue | react 默认vue
         */
        type?: Type,
        /**
         * 客户端
         */
        client?: BaseApolloClient<any> | ApolloClient<any>
    };

export type TableMethod<T extends FieldMetadataMap, TOptions, TReturn> = (config?: TOptions) => TReturn
export type QueryTableOptions<T extends FieldMetadataMap> = PickConfig<T>
export type QueryAggregateOptions<T extends FieldMetadataMap> = { field: '_all' | keyof T, fn: AggregateFunctionMenu }

export type TableBaseMethods<T extends FieldMetadataMap, TOptions> = {
    /**
     * 返回graphql的字符串文本
     */
    text: TableMethod<T, TOptions, string>,
    /**
     * 返回gql``包装后的对象
     */
    gql: TableMethod<T, TOptions, DocumentNode>
}


export type TableQueryMethods<T extends FieldMetadataMap, TOptions, TVariables, TData, Type extends TypeOptions> =
    TableBaseMethods<T, TOptions>
    & {
    /**
     * 执行query方法
     * @param options
     */
    query<T = TData>(options?: Omit<QueryOptions<TVariables>, "query"> & TOptions): Promise<ApolloQueryResult<T>>,
    /**
     * 从缓存中读取数据
     * @param options
     */
    readQuery<T = TData>(options?: { variables?: TVariables } & TOptions): T | null,
    /**
     * 写入缓存
     * @param options
     */
    writeQuery<T = TData>(options?: { variables?: TVariables, data: T } & TOptions): void;
    /**
     * 执行查询的hook方法
     * @param options
     */
    useQuery<T = TData>
    (options?: (Type extends VueType.TypeName ? VueType.QueryOptions<T, TVariables> : ReactType.QueryOptions<T, TVariables>) & TOptions): (Type extends VueType.TypeName ?
        VueType.QueryReturn<T, TVariables> :
        ReactType.QueryReturn<T, TVariables>) & { data: T | null };
}

export type OneType<T> = {
    [key in keyof T]?: any;
} & {
    [key: string]: any
}

export type PageType<T> = {
    /**
     * 总量
     */
    total: number,
    /**
     * 列表数据
     */
    list: T[]
}


export type TableMutationMethods<T extends FieldMetadataMap, TOptions, TVariables, TData, Type extends TypeOptions> =
    TableBaseMethods<T, TOptions>
    & {
    /**
     * 执行副作用的方法
     * @param options
     */
    mutate<T = any>(options?: Omit<MutationOptions<TVariables>, "mutation"> & TOptions & { variables: TVariables }): Promise<FetchResult<T>>,
    /**
     * 执行副作用的hook方法
     * @param options
     */
    useMutation<T = TData>
    (options?: (
        Type extends VueType.TypeName ?
            VueType.MutationOptions<T, TVariables> :
            ReactType.MutationOptions<T, TVariables>
        ) & TOptions):
        Type extends VueType.TypeName ?
            VueType.MutateReturn<T, TVariables> :
            ReactType.MutationReturn<T, TVariables>
}

export type QueryOneVariables<T extends FieldMetadataMap> = {
    /**
     *  where查询参数 具体看sequelize 文档 所有Op值都用_替代,如[Op.or]->_or
     */
    where?: WhereOptions<T>,
    /**
     * 范围/作用域
     */
    scope?: string[]
}
/**
 * 单表查询列表参数
 */
export type QueryListVariables<T extends FieldMetadataMap> = QueryOneVariables<T> &
    {
        /**
         * 限制数量
         */
        limit?: number,
        /**
         * 偏移量
         */
        offset?: number,
        /**
         * 使用子查询
         */
        subQuery?: boolean,
        /**
         * 排序参数
         */
        order?: { name: keyof T, sort?: 'asc' | 'desc' }[]
    }
/**
 * 单表输入参数
 */
export type MutationInputVariables<T extends FieldMetadataMap> = {
    data: {
        [name in keyof T]?: any
    }
}

/**
 * 单表更新参数
 */
export type MutationUpdateVariables<T extends FieldMetadataMap> = MutationInputVariables<T> & {
    /**
     * 主键值
     */
    id: string | number
}
/**
 * 所有访问单表数据的方法
 */
type TableMethods<T extends TableMetadataMap, key extends keyof T, Type extends TypeOptions = 'vue'> = {
    /**
     * 获取单条数据
     */
    readonly one: TableQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryOneVariables<T[key]['fields']>, OneType<T[key]['fields']>, Type>,
    /**
     * 获取列表数据
     */
    readonly list: TableQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryListVariables<T[key]['fields']>, OneType<T[key]['fields']>[], Type>,
    /**
     * 获取分页数据
     */
    readonly listPage: TableQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryListVariables<T[key]['fields']>, PageType<OneType<T[key]['fields']>>, Type>,
    /**
     * 获取聚合数据
     */
    readonly aggregate: TableQueryMethods<T[key]['fields'], QueryAggregateOptions<T[key]['fields']>, { where?: WhereOptions<T[key]['fields']> }, number, Type>,
    /**
     * 新建方法
     */
    readonly create?: TableMutationMethods<T[key]['fields'], Omit<PickConfig<T[key]['fields']>, 'deep'>, MutationInputVariables<T[key]['fields']>, OneType<T[key]['fields']>, Type>,
    /**
     * 更新方法
     */
    readonly update?: TableMutationMethods<T[key]['fields'], Omit<PickConfig<T[key]['fields']>, 'deep'>, MutationUpdateVariables<T[key]['fields']>, OneType<T[key]['fields']>, Type>,
    /**
     * 删除方法
     */
    readonly remove?: TableMutationMethods<T[key]['fields'], {}, { id: string | number }, boolean, Type>,
};
/**
 * 所有访问单表数据的方法
 */
export type TableMethodsMap<T extends TableMetadataMap, Type extends TypeOptions = 'vue'> = {
    [key in keyof T]: TableMethods<T, key, Type>
}

/**
 * 默认useResult方法
 * @param data
 * @param defaultValue
 * @param pick
 * @returns {any}
 */
function defaultUseResult(data: any, defaultValue: any, pick: (data: any) => any): any {
    return data === null || data === undefined ? data : pick(data)
}

/**
 * 获取有效的结果
 * @param tableName
 * @param action
 * @returns {(data: any) => (any)}
 */
function getResult(tableName: string, action: string) {
    return (data: any) => {
        if (action === 'listPage') {
            return get(data, tableName)
        }
        return get(data, `${tableName}.${action}`)
    }
}

/**
 * 获取处理结果的方法
 * @param tableName
 * @param action
 * @returns {(res: FetchResult) => {extensions?: Record<string, any>; data: any; context?: Record<string, any>; errors?: ReadonlyArray<GraphQLError>}}
 */
function getHandleFetchResult(tableName: string, action: string) {
    return (res: FetchResult) => ({
        ...res,
        data: getResult(tableName as string, action)(res.data)
    })
}

/**
 * 自动生成查询方法
 * @param metadata
 * @returns {TableMethodsMap<T>}
 * @param apiConfig
 */
export function createApiClient<T extends TableMetadataMap, Type extends TypeOptions = 'vue'>(
    metadata: T, apiConfig: ApiConfig<T, Type> = {} as ApiConfig<T, Type>): TableMethodsMap<T, Type> {

    apiConfig = {
        deep: 3,
        useResult: defaultUseResult,
        type: 'vue',
        ...apiConfig,
    }

    const _cacheMap = new Map<keyof T, FieldMetadataMap>();

    function getTableTypeName(name: keyof T): string {
        return (metadata[name]?.type || name) as string
    }

    function getFields<N extends keyof T>(name: N, {deep = apiConfig.deep, exclude, only}: PickConfig<T[N]['fields']> = {}) {
        const key = `${name}|${deep}`
        if (!_cacheMap.has(key)) {
            const typeKeyMetadata = Object.keys(metadata).reduce<TableFieldsMap>((memo, key: keyof T) => {
                memo[getTableTypeName(key)] = metadata[key].fields;
                return memo
            }, {})
            _cacheMap.set(key, flattenFields(typeKeyMetadata, {name: getTableTypeName(name), deep}))
        }
        return Object.values(getPickFields(_cacheMap.get(key), {only, exclude})).map(t => t.field)
    }

    function getQueryFunc<F extends FieldMetadataMap>(params: Omit<QueryTableParams, 'fields'> | QueryAggregateParams):
        TableMethod<F, QueryTableOptions<F>, string> {
        return ({only, deep = 1, exclude} = {}) => {
            // @ts-ignore
            const fields = getFields(params.name as keyof T, {deep, only, exclude});
            return queryTable({
                ...params,
                fields
            })
        }
    }


    function getGqlMethods<TOptions>(getText: TableMethod<FieldMetadataMap, TOptions, string>) {
        return {
            text: getText,
            gql: (options: TOptions) => gql(`${getText(options)}`)
        }
    }

    function getGqlQueryMethods<TOptions, TVariables>(getText: TableMethod<FieldMetadataMap, TOptions, string>, tableName: keyof T, action: string) {

        return {
            ...getGqlMethods(getText),
            query(options = {}) {
                assertClient(apiConfig.client);
                return (apiConfig.client as BaseApolloClient<any>).query({query: gql`${getText(options as TOptions)}`, ...options})
                    .then(getHandleFetchResult(tableName as string, action))
            },
            readQuery(options = {}) {
                assertClient(apiConfig.client);
                return (apiConfig.client as BaseApolloClient<any>).readQuery({query: gql`${getText(options as TOptions)}`, ...options})
                    .then(getHandleFetchResult(tableName as string, action))
            },
            writeQuery<TData>(options: { variables?: TVariables, data: TData } & TOptions) {
                assertClient(apiConfig.client);
                (apiConfig.client as BaseApolloClient<any>).writeQuery({query: gql`${getText(options as TOptions)}`, ...options})
            },
            useQuery(options = {}) {
                const {useQuery, useResult, type} = apiConfig;
                assertUseQuery(useQuery)
                if (type === 'vue') {
                    // @ts-ignore
                    const {result, ...other} = (useQuery as VueType.FuncUseQuery)(gql`${getText(options as TOptions)}`, options.variables, options);
                    const data = useResult(result, null, getResult(tableName as string, action))
                    return {
                        result,
                        ...other,
                        data
                    }
                } else {
                    const {data, ...other} = (useQuery as ReactType.FuncUseQuery)(gql`${getText(options as TOptions)}`, options);
                    const handleData = useResult(data, null, getResult(tableName as string, action))
                    return {
                        ...other,
                        data: handleData
                    }
                }
            },

        }
    }

    function getGqlMutationMethods<TOptions, TVariables, TData>(getText: TableMethod<FieldMetadataMap, TOptions, any>, tableName: keyof T, action: string) {
        return {
            ...getGqlMethods(getText),
            mutate<T>(options = {}) {
                assertClient(apiConfig.client);
                return (apiConfig.client as BaseApolloClient<any>).mutate<T, TVariables>({mutation: gql(`${getText(options as TOptions)}`), ...options})
            },
            useMutation<T>(options = {}) {
                const {useMutation, type} = apiConfig
                assertUseMutation(useMutation)
                if (type === 'vue') {
                    const {mutate, onDone, ...other} = (useMutation as VueType.FuncUseMutation)(gql`${getText(options as TOptions)}`, options);
                    return {
                        ...other,
                        mutate: (variables: TVariables, overrideOptions?: any) => mutate(variables, overrideOptions).then(getHandleFetchResult(tableName as string, action)),
                        onDone: (fn: (param?: FetchResult<any>) => void) => onDone((params) => {
                            fn(getHandleFetchResult(tableName as string, action)(params))
                        })
                    }
                } else {
                    if ((options as ReactType.MutationOptions<TData, TVariables>).onCompleted) {
                        const _onCompleted = (options as ReactType.MutationOptions<TData, TVariables>).onCompleted;
                        (options as ReactType.MutationOptions<TData, TVariables>).onCompleted = (res) => {
                            _onCompleted(getResult(tableName as string, action)(res))
                        }
                    }
                    const [mutate, result] = (useMutation as ReactType.FuncUseMutation)(gql`${getText(options as TOptions)}`, options);
                    return [(options: MutationFunctionOptions<TData, TVariables>) => mutate(options).then(getHandleFetchResult(tableName as string, action)), getHandleFetchResult(tableName as string, action)(result)]
                }
            }
        }
    }

    return Object.keys(metadata).reduce<TableMethodsMap<T, Type>>((memo, tableName: keyof T) => {
        const {createAble, editable, pkName, removeAble} = metadata[tableName]
        // @ts-ignore
        memo[tableName] = {
            one: getGqlQueryMethods(getQueryFunc({
                name: tableName as string,
                isList: false,
                withCount: false
            }), tableName, 'one'),
            list: getGqlQueryMethods(getQueryFunc({
                name: tableName as string,
                isList: true,
                withCount: false
            }), tableName, 'list'),
            listPage: getGqlQueryMethods(getQueryFunc({
                name: tableName as string,
                isList: true,
                withCount: true
            }), tableName, 'listPage'),
            aggregate: getGqlQueryMethods(({fn, field}) => {
                return queryAggregate({
                    fn,
                    name,
                    field: field as string
                })
            }, tableName, 'aggregate'),
            create: createAble ? getGqlMutationMethods((options = {}) => mutateCreate({
                name: tableName as string,
                fields: getFields(tableName, {deep: 1, ...options})
            }), tableName, 'create') : undefined,
            update: editable ? getGqlMutationMethods((options = {}) => mutateUpdate({
                name: tableName as string,
                pkName,
                fields: getFields(tableName, {deep: 1, ...options})
            }), tableName, 'update') : undefined,
            remove: removeAble ? getGqlMutationMethods(() => mutateRemove({
                name: tableName as string,
                pkName,
            }), tableName, 'remove') : undefined,
        }
        return memo;
    }, {} as TableMethodsMap<T, Type>)
}


