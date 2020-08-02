import {FieldsArgs, FieldsListArgs} from "./generateText";

/**
 * 生成apiClient的类型，支持vue和react
 */

export type BaseParams = {
    //表名
    name: string,
    //同级的其它查询字段
    otherFields?: string
}
export type MutateCreateParams = BaseParams & { fields: FieldsArgs };
export type MutateRemoveParams<T extends FieldMetadataMap> = BaseParams & { pkName: keyof T };

export type MutateUpdateParams<T extends FieldMetadataMap> = BaseParams & { fields: FieldsArgs, pkName: keyof T };
/**
 * 字段信息
 */
export type FieldMetadata = {
    /**
     * 类型
     */
    type: string;
    /**
     * 字段描述
     */
    title?: string;
    /**
     * sequelize类型
     */
    dataType?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 字段名
     */
    prop?: string;
    name?: string;
    /**
     * 对应graphql的字段
     */
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

export type TableMetadataWithMapFields = Omit<TableMetadata, "fields"> & {
    fields: FieldMetadataMap
};
export type TableMetadataMap = {
    [tableName: string]: TableMetadataWithMapFields
}

/**
 * 表信息
 */
export type TableMetadata = {
    /**
     * 类型名
     */
    type: string,
    /**
     * 主键名
     */
    pkName?: string,
    /**
     * 描述
     */
    description?: string;
    /**
     * 是否可新建
     */
    createAble?: boolean;
    /**
     * 是否可编辑
     */
    editable?: boolean;
    /**
     * 是否可删除
     */
    removeAble?: boolean;
    /**
     * 表字段信息
     */
    fields: FieldMetadata[],
    /**
     * 表名
     */
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

/**
 * 聚合方法
 */
export type AggregateFunctionMenu = 'SUM' | 'MAX' | 'MIN' | 'COUNT' | 'AVG'

export type QueryAggregateParams = BaseParams & {
    fn: AggregateFunctionMenu,
    field: '_all' | string,
    alias?: string,
}

export type QueryTableParams = BaseParams & {
    //查询字段
    fields: FieldsArgs,
    //是否查询列表
    isList?: boolean,
    //是否返回总量
    withCount?: boolean
};


