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
    GqlApiConfig,
    TableGqlFields,
    GqlMethod,
    QueryTableOptions,
    TableMetadataMap,
    FieldMetadataMap,
    PickConfig,
    QueryTableParams,
    QueryAggregateParams,
    TableFieldsMap,
    TypeOptions
} from "./type";

function defaultUseResult(data: any, defaultValue: any, pick: (data: any) => any): any {
    return data === null || data === undefined ? data : pick(data)
}

function getResult(key: string, type: string) {
    return (data: any) => {
        if (type === 'listPage') {
            return get(data, key)
        }
        return get(data, `${key}.${type}`)
    }
}

/**
 * 自动生成查询方法
 * @param metadata
 * @returns {TableGqlFields<T>}
 * @param apiConfig
 */
export function createGqlApi<T extends TableMetadataMap, Type extends TypeOptions = 'vue'>(
    metadata: T, apiConfig: GqlApiConfig<T, Type> = {} as GqlApiConfig<T, Type>): TableGqlFields<T, Type> {

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

    function getGqlQueryMethods<TOptions, TVariables>(getText: GqlMethod<FieldMetadataMap, TOptions, string>, key: keyof T, type: string) {

        return {
            ...getGqlMethods(getText),
            query(options = {}) {
                if (!apiConfig.client) throw new Error('尚未配置client');
                return apiConfig.client.query({query: gql`${getText(options as TOptions)}`, ...options})
                    .then(res => ({...res, data: getResult(key as string, type)(res.data)}))
            },
            readQuery(options = {}) {
                if (!apiConfig.client) throw new Error('尚未配置client');
                return apiConfig.client.readQuery({query: gql`${getText(options as TOptions)}`, ...options})
                    .then((res: any) => getResult(key as string, type)(res))
            },
            writeQuery<TData>(options: { variables?: TVariables, data: TData } & TOptions) {
                if (!apiConfig.client) throw new Error('尚未配置client');
                apiConfig.client.writeQuery({query: gql`${getText(options as TOptions)}`, ...options})
            },
            useQuery(options = {}) {
                if (!apiConfig.useVueQuery && !apiConfig.useReactQuery) throw new Error('尚未传入useQuery方法')
                if (apiConfig.useVueQuery) {
                    // @ts-ignore
                    const {result, ...other} = apiConfig.useVueQuery(gql`${getText(options as TOptions)}`, options.variables, options);
                    const data = apiConfig.useResult(result, null, getResult(key as string, type))
                    return {
                        result,
                        ...other,
                        data
                    }
                } else if (apiConfig.useReactQuery) {
                    const {data, ...other} = apiConfig.useReactQuery(gql`${getText(options as TOptions)}`, options);
                    const handleData = apiConfig.useResult(data, null, getResult(key as string, type))
                    return {
                        ...other,
                        data: handleData
                    }
                }
            },

        }
    }

    function getGqlMutationMethods<TOptions, TVariables>(getText: GqlMethod<FieldMetadataMap, TOptions, string>, key: keyof T, type: string) {
        const {} = apiConfig
        return {
            ...getGqlMethods(getText),
            mutate<T>(options = {}) {
                if (!apiConfig.client) throw new Error('尚未配置client');
                return apiConfig.client.mutate<T, TVariables>({mutation: gql(`${getText(options as TOptions)}`), ...options})
            },
            useMutation(options = {}) {
                if (!apiConfig.useVueMutation && !apiConfig.useReactMutation) throw new Error('尚未传入useMutation方法')
                if (apiConfig.useVueMutation) {
                    return apiConfig.useVueMutation(gql`${getText(options as TOptions)}`, options)
                } else if (apiConfig.useReactMutation) {
                    return apiConfig.useReactMutation(gql`${getText(options as TOptions)}`, options)
                }

            }
        }
    }

    return Object.keys(metadata).reduce<TableGqlFields<T>>((memo, key: keyof T) => {
        const {createAble, editable, pkName, removeAble} = metadata[key]
        // @ts-ignore
        memo[key] = {
            one: getGqlQueryMethods(getQueryFunc({name: key as string, isList: false, withCount: false}), key, 'one'),
            list: getGqlQueryMethods(getQueryFunc({name: key as string, isList: true, withCount: false}), key, 'list'),
            listPage: getGqlQueryMethods(getQueryFunc({
                name: key as string,
                isList: true,
                withCount: true
            }), key, 'listPage'),
            aggregate: getGqlQueryMethods(({fn, field}) => {
                return queryAggregate({
                    fn,
                    name,
                    field: field as string
                })
            }, key, 'aggregate'),
            create: createAble ? getGqlMutationMethods((options = {}) => mutateCreate({
                name: key as string,
                fields: getFields(key, {deep: 1, ...options})
            }), key, 'create') : undefined,
            update: editable ? getGqlMutationMethods((options = {}) => mutateUpdate({
                name: key as string,
                pkName,
                fields: getFields(key, {deep: 1, ...options})
            }), key, 'update') : undefined,
            remove: removeAble ? getGqlMutationMethods(() => mutateRemove({
                name: key as string,
                pkName,
            }), key, 'remove') : undefined,
        }
        return memo;
    }, {} as TableGqlFields<T, Type>)
}


// const api = createGqlApi({
//     user: {
//         type: 'User',
//         name: 'user',
//         fields: {name1111: {type: "id"}, tasks: {type: 'Task'}, id: {type: 'obj'}}
//     },
//     task: {
//         type: 'Task',
//         name: 'task',
//         fields: {title: {type: "id"}}
//     }
// }, {})
// api.user.create.useMutation({variables: {data: {name1111: "sas"}}}).mutate()
