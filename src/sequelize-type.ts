
export interface AnyOperator {
    _any: (string | number)[];
}

export interface AllOperator {
    _all: (string | number | Date)[];
}

export interface WhereOperators {
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
