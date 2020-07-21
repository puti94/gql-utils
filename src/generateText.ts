import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import flattenDeep from 'lodash/flattenDeep'

export class GqlEnum {
    value: string

    constructor(value: string) {
        this.value = value;
    }

    toString() {
        return this.value
    }
}

export type ArgsValue = string | boolean | ArgsValue[] | number | GqlEnum | ArgsConfigMap;

export type ArgsConfigMap = {
    [key: string]: ArgsValue
}

export type FieldConfig = {
    /**
     * 别名
     */
    alias?: string;
    /**
     * 参数
     */
    args?: ArgsConfigMap;
    /**
     * 子字段
     */
    fields?: FieldsArgs
}

export type FieldConfigMap = {
    [key: string]: FieldConfig | true
}

type FieldConfigWithName = FieldConfig & { name: string }
type FieldConfigWithField = FieldConfig & { field: string }
export type FieldsListArgs = Array<string | FieldConfigWithName | FieldConfigWithField | FieldsListArgs>;
export type FieldsArgs =
    FieldConfigMap
    | FieldsListArgs

/**
 * 生成参数字符串
 * @param args
 * @returns {string}
 */
export function generateArgsText(args: ArgsConfigMap) {
    function generateValueText(value: ArgsValue): string {
        if (typeof value === 'string') {
            return `"${value.replace(/"/g, '\\"')}"`
        } else if (value instanceof GqlEnum || typeof value !== 'object') {
            return `${value}`
        } else if (Array.isArray(value)) {
            return `[${value.reduce((memo, v, i) => {
                memo += generateValueText(v)
                memo += i === value.length - 1 ? '' : ','
                return memo
            }, '')}]`
        } else if (typeof value === 'object') {
            return `{${generateArgsText(value)}}`
        }
    }

    const keys = Object.keys(args)
    return keys.reduce((memo, key, i) => {
        memo += `${key}:${generateValueText(args[key])}`
        memo += i === keys.length - 1 ? '' : ','
        return memo
    }, '')
}

/**
 * 生成字段字符串
 * @param name
 * @param fieldValue
 * @returns {string}
 */
export function generateFieldText(name: string, fieldValue: FieldConfig | true): string {
    if (fieldValue === true) return name
    const {args, fields, alias} = fieldValue;
    let argsText = null
    if (!isEmpty(args)) {
        argsText = generateArgsText(args)
    }
    const fieldsText = generateFieldsText(fields)
    return `${alias ? `${alias}:` : ''}${name}${argsText ? `(${argsText})` : ''}${fieldsText ? `{${fieldsText}}` : ''}`
}

/**
 *
 * @param fields
 * @returns {string}
 */
export function generateFieldsText(fields: FieldsArgs) {
    if (isEmpty(fields)) {
        return ''
    }
    const map = fields2Map(fields);
    const keys = Object.keys(map);
    return keys.reduce((memo, key, i) => {
        memo += generateFieldText(key, map[key])
        memo += i === keys.length - 1 ? '' : ','
        return memo
    }, '')
}


/**
 * 转化fields参数
 * @param fields
 * @returns {any}
 */
export function fields2Map(fields: FieldsArgs): FieldConfigMap {
    if (Array.isArray(fields)) {
        fields = flattenDeep(fields);
        return fields.reduce((memo, field: FieldConfigWithName | FieldConfigWithField) => {
            let fieldValue;
            if (typeof field === 'string') {
                fieldValue = {[field]: true}
            } else {
                const configValue: FieldConfig = {}
                if (field.alias) configValue.alias = field.alias;
                if (field.args) configValue.args = field.args;
                if (field.fields) configValue.fields = fields2Map(field.fields);
                // @ts-ignore
                fieldValue = {[field.name || field.field]: configValue}
            }
            return merge(memo, fieldValue);
        }, {})
    }
    return fields as FieldConfigMap
}



