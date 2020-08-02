import {
    QueryHookOptions,
    QueryResult,
    useQuery,
    useMutation,
    MutationHookOptions,
    MutationTuple
} from "@apollo/client/index.d.ts";

export type TypeName = "react"
export type FuncUseResult = (data: any, defaultData: any, pick: (data: any) => any) => any
export type FuncUseQuery = typeof useQuery
export type FuncUseMutation = typeof useMutation
export type QueryReturn<TResult, TVariables> = QueryResult<TResult, TVariables>
export type MutationReturn<TData, TVariables> = MutationTuple<TData, TVariables>
export type QueryOptions<TData, TVariables> =
    QueryHookOptions<TData, TVariables>
export type MutationOptions<TData, TVariables> = MutationHookOptions<TData, TVariables>
