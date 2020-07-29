/**
 * graphql-adapter库的工具类
 * 地址 https://github.com/puti94/graphql-adapter
 */
import {ApolloClient, QueryOptions, ApolloQueryResult, OperationVariables} from 'apollo-client/index.d.ts'
import gql from 'graphql-tag'
import {DocumentNode} from 'graphql'
import get from 'lodash/get'
import {
    FieldMetadataMap,
    PickConfig,
    AggregateFunctionMenu,
    TableFieldsMap,
    TableMetadata,
    flattenFields,
    getPickFields,
    QueryTableParams,
    QueryAggregateParams,
    queryTable,
    queryAggregate,
    mutateCreate,
    mutateUpdate,
    mutateRemove
} from "./adapterUtils";
import {MutationOptions} from "apollo-client/core/watchQueryOptions";
import {FetchResult} from "apollo-link";
import {WhereOptions} from "./type";


export type GqlMethod<T extends FieldMetadataMap, TOptions, TReturn> = (config?: TOptions) => TReturn
export type QueryTableOptions<T extends FieldMetadataMap> = PickConfig<T>
export type QueryAggregateOptions<T extends FieldMetadataMap> = { field: '_all' | keyof T, fn: AggregateFunctionMenu }

export type GqlMethods<T extends FieldMetadataMap, TOptions> = {
    text: GqlMethod<T, TOptions, string>,
    gql: GqlMethod<T, TOptions, DocumentNode>
}

export type GqlQueryMethods<T extends FieldMetadataMap, TOptions, TVariables> = GqlMethods<T, TOptions> & {
    query<T = any>(options?: Omit<QueryOptions<TVariables>, "query"> & TOptions): Promise<ApolloQueryResult<T>>
}

export type GqlMutationMethods<T extends FieldMetadataMap, TOptions, TVariables> = GqlMethods<T, TOptions> & {
    mutate<T = any>(options?: Omit<MutationOptions<TVariables>, "mutation"> & TOptions & { variables: TVariables }): Promise<FetchResult<T>>
}

export type QueryOneVariables<T extends FieldMetadataMap> = {
    where?: WhereOptions<T>,
    scope?: string[]
}

export type QueryListVariables<T extends FieldMetadataMap> = QueryOneVariables<T> &
    {
        limit?: number,
        offset?: number,
        subQuery?: boolean,
        order?: { name: keyof T, sort?: 'asc' | 'desc' }[]
    }

export type MutationInputVariables<T extends FieldMetadataMap> = {
    data: {
        [name in keyof T]?: any
    }
}

export type MutationUpdateVariables<T extends FieldMetadataMap> = MutationInputVariables<T> & {
    id: string | number
}

export type TableGqlFields<T extends TableFieldsMap> = {
    [key in keyof T]: {
        readonly one: GqlQueryMethods<T[key], QueryTableOptions<T[key]>, QueryOneVariables<T[key]>>,
        readonly list: GqlQueryMethods<T[key], QueryTableOptions<T[key]>, QueryListVariables<T[key]>>,
        readonly listPage: GqlQueryMethods<T[key], QueryTableOptions<T[key]>, QueryListVariables<T[key]>>,
        readonly aggregate: GqlQueryMethods<T[key], QueryAggregateOptions<T[key]>, { where?: WhereOptions<T[key]> }>,
        readonly create?: GqlMutationMethods<T[key], Omit<PickConfig<T[key]>, 'deep'>, MutationInputVariables<T[key]>>,
        readonly update?: GqlMutationMethods<T[key], Omit<PickConfig<T[key]>, 'deep'>, MutationUpdateVariables<T[key]>>,
        readonly remove?: GqlMutationMethods<T[key], undefined, {
            id: string | number
        }>,
    }
}

type GqlApiConfig<T extends TableFieldsMap> =
    {
        deep?: number,
        client?: ApolloClient<any>,
        metadataMap: { [type in keyof T]?: Partial<TableMetadata> }
    };

/**
 * 自动生成查询方法
 * @param metadata
 * @returns {TableGqlFields<T>}
 * @param apiConfig
 */
export function createGqlApi<T extends TableFieldsMap>(
    metadata: T,
    apiConfig: GqlApiConfig<T>
        = {deep: 3, metadataMap: {}}): TableGqlFields<T> {
    const _cacheMap = new Map<keyof T, FieldMetadataMap>();

    function getTableTypeName(name: keyof T): string {
        return (apiConfig.metadataMap[name]?.type || name) as string
    }

    function getFields<N extends keyof T>(name: N, {deep = apiConfig.deep, exclude, only}: PickConfig<T[N]> = {}) {
        const key = `${name}|${deep}`
        if (!_cacheMap.has(key)) {
            const typeKeyMetadata = Object.keys(metadata).reduce<TableFieldsMap>((memo, key: keyof T) => {
                memo[getTableTypeName(key)] = metadata[key];
                return memo
            }, {})
            _cacheMap.set(key, flattenFields(typeKeyMetadata, {name: getTableTypeName(name), deep}))
        }
        return Object.values(getPickFields(_cacheMap.get(key), {only, exclude})).map(t => t.field)
    }

    function getQueryFunc<F extends FieldMetadataMap>(params: Omit<QueryTableParams, 'fields'> | QueryAggregateParams):
        GqlMethod<F, QueryTableOptions<F>, string> {
        return ({only, deep = 1, exclude} = {}) => {
            // @ts-ignore
            const fields = getFields(params.name as keyof T, {deep, only, exclude});
            return queryTable({
                ...params,
                fields
            })
        }
    }


    function getGqlMethods<TOptions>(getText: GqlMethod<FieldMetadataMap, TOptions, string>) {
        return {
            text: getText,
            gql: (options: TOptions) => gql(`${getText(options)}`)
        }
    }

    function getGqlQueryMethods<TOptions, TVariables>(getText: GqlMethod<FieldMetadataMap, TOptions, string>) {
        return {
            ...getGqlMethods(getText),
            query<T>(options = {}) {
                return apiConfig.client.query({query: gql(`${getText(options as TOptions)}`), ...options})
            }
        }
    }

    function getGqlMutationMethods<TOptions, TVariables>(getText: GqlMethod<FieldMetadataMap, TOptions, string>) {
        return {
            ...getGqlMethods(getText),
            mutate<T>(options = {}) {
                if (!apiConfig.client) throw new Error('尚未配置client');
                return apiConfig.client.mutate<T, TVariables>({mutation: gql(`${getText(options as TOptions)}`), ...options})
            }
        }
    }

    return Object.keys(metadata).reduce<TableGqlFields<T>>((memo, key: keyof T) => {
        memo[key] = {
            one: getGqlQueryMethods(getQueryFunc({name: key as string, isList: false, withCount: false})),
            list: getGqlQueryMethods(getQueryFunc({name: key as string, isList: true, withCount: false})),
            listPage: getGqlQueryMethods(getQueryFunc({
                name: key as string,
                isList: true,
                withCount: true
            })),
            aggregate: getGqlQueryMethods(({fn, field}) => {
                return queryAggregate({
                    fn,
                    name,
                    field: field as string
                })
            }),
            create: get(apiConfig.metadataMap, `${key}.createAble`) ? getGqlMutationMethods((options = {}) => mutateCreate({
                name: key as string,
                fields: getFields(key, {deep: 1, ...options})
            })) : undefined,
            update: get(apiConfig.metadataMap, `${key}.editable`) ? getGqlMutationMethods((options = {}) => mutateUpdate({
                name: key as string,
                pkName: get(apiConfig.metadataMap, `${key}.pkName`) as string,
                fields: getFields(key, {deep: 1, ...options})
            })) : undefined,
            remove: get(apiConfig.metadataMap, `${key}.removeAble`) ? getGqlMutationMethods(() => mutateRemove({
                name: key as string,
                pkName: get(apiConfig.metadataMap, `${key}.pkName`) as string,
            })) : undefined,
        }
        return memo;
    }, {} as TableGqlFields<T>)
}

// const api = createGqlApi({
//     user: {name: {type: "id"}, tasks: {type: 'Task'}},
//     task: {title: {type: "id"}}
// }, {
//     metadataMap: {
//         user: {removeAble: true, createAble: true, editable: true, pkName: 'name'},
//         task: {type: 'Task', removeAble: true, createAble: true, editable: true, pkName: 'name'}
//     }
// })

