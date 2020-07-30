import {DocumentNode} from "graphql";
import {ApolloClient, ApolloQueryResult, MutationOptions, QueryOptions} from "apollo-client/index.d.ts";
import {FetchResult} from "apollo-link/lib/types";
import {FieldsArgs, FieldsListArgs} from "./generateText";
import * as VueType from './type-vue'
import * as ReactType from './type-react'


export type MutateCreateParams = GqlBaseParams & { fields: FieldsArgs };
export type MutateRemoveParams<T extends FieldMetadataMap> = GqlBaseParams & { pkName: keyof T };

export type MutateUpdateParams<T extends FieldMetadataMap> = GqlBaseParams & { fields: FieldsArgs, pkName: keyof T };
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
    [name: string]: FieldMetadataMap
}

export type TableMetadataMap = {
    [tableName: string]: Omit<TableMetadata, "fields"> & {
        fields: FieldMetadataMap
    }
}

export type TableMetadata = {
    type: string,
    pkName?: string,
    createAble?: boolean;
    editable?: boolean;
    removeAble?: boolean;
    fields: FieldMetadata[],
    name: string
};

export type PickConfig<T extends TableFieldsMap> = {
    /**
     * 递归的深度，关联字段的层级
     */
    deep?: number;
    /**
     * 选取的字段，优先级高
     */
    only?: (keyof T | string)[],
    /**
     * 剔除的字段，优先级高
     */
    exclude?: (keyof T | string)[]
}


export type FlattenConfig<T extends TableFieldsMap> = PickConfig<T> & {
    /**
     * 类型名
     */
    name: keyof T;
    /**
     * 覆盖配置
     */
    mergeFields?: {
        [name in keyof T]: Partial<FieldMetadata>
    };
};


export type GqlBaseParams = {
    //表名
    name: string,
    //同级的其它查询字段
    otherFields?: string
}

export type AggregateFunctionMenu = 'SUM' | 'MAX' | 'MIN' | 'COUNT' | 'AVG'

export type QueryAggregateParams = GqlBaseParams & {
    fn: AggregateFunctionMenu,
    field: '_all' | string,
    alias?: string,
}

export type QueryTableParams = GqlBaseParams & {
    //查询字段
    fields: FieldsArgs,
    //是否查询列表
    isList?: boolean,
    //是否返回总量
    withCount?: boolean
};


export type GqlMethod<T extends FieldMetadataMap, TOptions, TReturn> = (config?: TOptions) => TReturn
export type QueryTableOptions<T extends FieldMetadataMap> = PickConfig<T>
export type QueryAggregateOptions<T extends FieldMetadataMap> = { field: '_all' | keyof T, fn: AggregateFunctionMenu }

export type GqlMethods<T extends FieldMetadataMap, TOptions> = {
    text: GqlMethod<T, TOptions, string>,
    gql: GqlMethod<T, TOptions, DocumentNode>
}


export type GqlQueryMethods<T extends FieldMetadataMap, TOptions, TVariables, TData> = GqlMethods<T, TOptions> & {
    query<T = TData>(options?: Omit<QueryOptions<TVariables>, "query"> & TOptions): Promise<ApolloQueryResult<T>>,
    readQuery<T = TData>(options?: { variables?: TVariables } & TOptions): T | null,
    writeQuery<T = TData>(options?: { variables?: TVariables, data: T } & TOptions): void;
    useQuery<T = TData, TBaseOptions extends (VueType.GqlQueryOptions<T, TVariables> | ReactType.GqlQueryOptions<T, TVariables>) =
        VueType.GqlQueryOptions<TData, TVariables>>(options?: TBaseOptions & TOptions):
        (TBaseOptions extends VueType.GqlQueryOptions<T, TVariables> ?
            VueType.QueryReturn<T, TVariables> :
            ReactType.QueryReturn<T, TVariables>) & { data: T | null };
}

export type ReturnOneType<T extends FieldMetadataMap> = {
    [key in keyof T]?: any;
} & {
    [key: string]:any
}

export type ReturnListType<T extends FieldMetadataMap> = ReturnOneType<T>[]


export type ReturnListPageType<T extends FieldMetadataMap> = {
    total: number,
    list: ReturnOneType<T>[]
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


export type TableGqlFields<T extends TableMetadataMap> = {
    [key in keyof T]: {
        readonly one: GqlQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryOneVariables<T[key]['fields']>, ReturnOneType<T[key]['fields']>>,
        readonly list: GqlQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryListVariables<T[key]['fields']>, ReturnListType<T[key]['fields']>>,
        readonly listPage: GqlQueryMethods<T[key]['fields'], QueryTableOptions<T[key]['fields']>, QueryListVariables<T[key]['fields']>, ReturnListPageType<T[key]['fields']>>,
        readonly aggregate: GqlQueryMethods<T[key]['fields'], QueryAggregateOptions<T[key]['fields']>, { where?: WhereOptions<T[key]['fields']> }, number>,
        readonly create?: GqlMutationMethods<T[key]['fields'], Omit<PickConfig<T[key]['fields']>, 'deep'>, MutationInputVariables<T[key]['fields']>>,
        readonly update?: GqlMutationMethods<T[key]['fields'], Omit<PickConfig<T[key]['fields']>, 'deep'>, MutationUpdateVariables<T[key]['fields']>>,
        readonly remove?: GqlMutationMethods<T[key]['fields'], undefined, {
            id: string | number
        }>,
    }
}

type HookOptions = {
    useVueQuery?: VueType.FuncUseQuery,
    useReactQuery?: ReactType.FuncUseQuery,
    useResult?: VueType.FuncUseResult | ReactType.FuncUseResult,
}

export type GqlApiConfig<T extends TableMetadataMap> =
    HookOptions &
    {
        deep?: number,
        client?: ApolloClient<any>
    };


export interface AnyOperator {
    _any: (string | number)[];
}

export interface AllOperator {
    _all: (string | number | Date)[];
}

interface WhereOperators {
    /**
     * Example: `_any: [2,3]` becomes `ANY ARRAY[2, 3]::INTEGER`
     *
     * _PG only_
     */
    _any?: (string | number)[];

    /** Example: `_gte: 6,` becomes `>= 6` */
    _gte?: number | string | Date;

    /** Example: `_lt: 10,` becomes `< 10` */
    _lt?: number | string | Date;

    /** Example: `_lte: 10,` becomes `<= 10` */
    _lte?: number | string | Date;

    /** Example: `_ne: 20,` becomes `!= 20` */
    _ne?: null | string | number | WhereOperators;

    /** Example: `_not: true,` becomes `IS NOT TRUE` */
    _not?: null | boolean | string | number | WhereOperators;

    /** Example: `_between: [6, 10],` becomes `BETWEEN 6 AND 10` */
    _between?: Rangable;

    /** Example: `_in: [1, 2],` becomes `IN [1, 2]` */
    _in?: (string | number)[];

    /** Example: `_notIn: [1, 2],` becomes `NOT IN [1, 2]` */
    _notIn?: (string | number)[];

    /**
     * Examples:
     *  - `_like: '%hat',` becomes `LIKE '%hat'`
     *  - `_like: { _any: ['cat', 'hat']}` becomes `LIKE ANY ARRAY['cat', 'hat']`
     */
    _like?: string | AnyOperator | AllOperator;

    /**
     * Examples:
     *  - `_notLike: '%hat'` becomes `NOT LIKE '%hat'`
     *  - `_notLike: { _any: ['cat', 'hat']}` becomes `NOT LIKE ANY ARRAY['cat', 'hat']`
     */
    _notLike?: string | AnyOperator | AllOperator;

    /**
     * case insensitive PG only
     *
     * Examples:
     *  - `[Op.iLike]: '%hat'` becomes `ILIKE '%hat'`
     *  - `[Op.iLike]: { _any: ['cat', 'hat']}` becomes `ILIKE ANY ARRAY['cat', 'hat']`
     */
    _iLike?: string | AnyOperator | AllOperator;

    /**
     * PG array overlap operator
     *
     * Example: `_overlap: [1, 2]` becomes `&& [1, 2]`
     */
    _overlap?: Rangable;

    /**
     * PG array contains operator
     *
     * Example: `_contains: [1, 2]` becomes `@> [1, 2]`
     */
    _contains?: (string | number)[] | Rangable;

    /**
     * PG array contained by operator
     *
     * Example: `_contained: [1, 2]` becomes `<@ [1, 2]`
     */
    _contained?: (string | number)[] | Rangable;

    /** Example: `_gt: 6,` becomes `> 6` */
    _gt?: number | string | Date;

    /**
     * PG only
     *
     * Examples:
     *  - `_notILike: '%hat'` becomes `NOT ILIKE '%hat'`
     *  - `_notLike: ['cat', 'hat']` becomes `LIKE ANY ARRAY['cat', 'hat']`
     */
    _notILike?: string | AnyOperator | AllOperator;

    /** Example: `_notBetween: [11, 15],` becomes `NOT BETWEEN 11 AND 15` */
    _notBetween?: Rangable;

    /**
     * Strings starts with value.
     */
    _startsWith?: string;

    /**
     * String ends with value.
     */
    _endsWith?: string;
    /**
     * String contains value.
     */
    _substring?: string;

    /**
     * MySQL/PG only
     *
     * Matches regular expression, case sensitive
     *
     * Example: `__regexp: '^[h|a|t]'` becomes `REGEXP/~ '^[h|a|t]'`
     */
    _regexp?: string;

    /**
     * MySQL/PG only
     *
     * Does not match regular expression, case sensitive
     *
     * Example: `_notRegexp: '^[h|a|t]'` becomes `NOT REGEXP/!~ '^[h|a|t]'`
     */
    _notRegexp?: string;

    /**
     * PG only
     *
     * Matches regular expression, case insensitive
     *
     * Example: `_iRegexp: '^[h|a|t]'` becomes `~* '^[h|a|t]'`
     */
    _iRegexp?: string;

    /**
     * PG only
     *
     * Does not match regular expression, case insensitive
     *
     * Example: `_notIRegexp: '^[h|a|t]'` becomes `!~* '^[h|a|t]'`
     */
    _notIRegexp?: string;

    /**
     * PG only
     *
     * Forces the operator to be strictly left eg. `<< [a, b)`
     */
    _strictLeft?: Rangable;

    /**
     * PG only
     *
     * Forces the operator to be strictly right eg. `>> [a, b)`
     */
    _strictRight?: Rangable;

    /**
     * PG only
     *
     * Forces the operator to not extend the left eg. `&> [1, 2)`
     */
    _noExtendLeft?: Rangable;

    /**
     * PG only
     *
     * Forces the operator to not extend the left eg. `&< [1, 2)`
     */
    _noExtendRight?: Rangable;

}

export type Rangable = [number, number] | [Date, Date];

export interface WhereGeometryOptions {
    type: string;
    coordinates: (number[] | number)[];
}

export type WhereValue<TAttributes = any> =
    | string // literal value
    | number // literal value
    | boolean // literal value
    | Date // literal value
    | Buffer // literal value
    | null
    | WhereOperators
    | WhereAttributeHash<any> // for JSON columns
    | OrOperator<TAttributes>
    | AndOperator<TAttributes>
    | WhereGeometryOptions
    | (string | number | Buffer | WhereAttributeHash<TAttributes>)[];
export type WhereAttributeHash<TAttributes = any> = {
    [field in keyof TAttributes]?: WhereValue<TAttributes> | WhereOptions<TAttributes>;
}
export type WhereOptions<TAttributes = any> =
    | WhereAttributeHash<TAttributes>
    | AndOperator<TAttributes>
    | OrOperator<TAttributes>;

export interface OrOperator<TAttributes = any> {
    _or: WhereOptions<TAttributes> | WhereOptions<TAttributes>[] | WhereValue<TAttributes> | WhereValue<TAttributes>[];
}

/** Example: `_and: {a: 5}` becomes `AND (a = 5)` */
export interface AndOperator<TAttributes = any> {
    _and: WhereOptions<TAttributes> | WhereOptions<TAttributes>[] | WhereValue<TAttributes> | WhereValue<TAttributes>[];
}
