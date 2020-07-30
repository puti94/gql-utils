import {QueryHookOptions, QueryResult, useQuery} from "@apollo/client/index";

export type FuncUseResult = (data: any, defaultData: any, pick: (data: any) => any) => any
export type FuncUseQuery = typeof useQuery
export type QueryReturn<TResult, TVariables> = QueryResult<TResult, TVariables>
export type GqlQueryOptions<TData, TVariables> =
    QueryHookOptions<TData, TVariables>
