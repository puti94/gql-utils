import {
    UseQueryOptions,
    UseQueryReturn,
    useQuery,
    useResult,
    useMutation,
    UseMutationOptionsWithVariables,
    UseMutationReturn
} from "@vue/apollo-composable/dist/index.d.ts";
import {MutateWithRequiredVariables} from "@vue/apollo-composable/dist/useMutation.d.ts";

export type TypeName = "vue"
export type FuncUseQuery = typeof useQuery
export type FuncUseMutation = typeof useMutation
export type FuncUseResult = typeof useResult

export type QueryReturn<TResult, TVariables> = Omit<UseQueryReturn<TResult, TVariables>, "data">
export type MutateReturn<TResult, TVariables> = UseMutationReturn<TResult, TVariables, MutateWithRequiredVariables<TResult, TVariables>>;
export type QueryOptions<TData, TVariables> =
    (UseQueryOptions<TData, TVariables> & { variables?: TVariables })

export type MutationOptions<TData, TVariables> =
    UseMutationOptionsWithVariables<TData, TVariables>
