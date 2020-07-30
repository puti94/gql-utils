import {UseQueryOptions, UseQueryReturn, useQuery,useResult} from "@vue/apollo-composable/dist/index";

export type FuncUseQuery = typeof useQuery
export type FuncUseResult = typeof useResult
export type QueryReturn<TResult, TVariables> = Omit<UseQueryReturn<TResult, TVariables>, "data">
export type GqlQueryOptions<TData, TVariables> =
    (UseQueryOptions<TData, TVariables> & { variables?: TVariables })
