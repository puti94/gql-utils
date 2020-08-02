/**
 * User: puti.
 * Time: 2020/7/29 9:51 下午.
 */
import {TableMetadataMap} from '../../dist/type'

const metadata = {
    "Account": {
        "name": "Account",
        "pkName": "uuid",
        "type": "Account",
        "description": "Account",
        "createAble": true,
        "editable": true,
        "removeAble": true,
        "fields": {
            "uuid": {
                "type": "ID",
                "dataType": "UUID",
                "isPk": true,
                "isList": false,
                "allowNull": false,
                "name": "uuid",
                "description": "账户id",
                "title": "账户id",
                "sortable": false,
                "editable": false,
                "createAble": true
            },
            "name": {
                "type": "String",
                "dataType": "STRING",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "name",
                "title": "name",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "age": {
                "type": "Int",
                "dataType": "INTEGER",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "age",
                "title": "age",
                "sortable": true,
                "editable": true,
                "createAble": true
            },
            "describe": {
                "type": "JSONType",
                "dataType": "JSON",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "describe",
                "title": "describe",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "active": {
                "type": "Boolean",
                "dataType": "BOOLEAN",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "active",
                "title": "active",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "balance": {
                "type": "String",
                "dataType": "DECIMAL",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "balance",
                "title": "balance",
                "sortable": true,
                "editable": true,
                "createAble": true
            },
            "createdAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "createdAt",
                "title": "createdAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "updatedAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "updatedAt",
                "title": "updatedAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            }
        }
    },
    "Project": {
        "name": "Project",
        "pkName": "id",
        "type": "Project",
        "description": "项目",
        "createAble": true,
        "editable": true,
        "removeAble": true,
        "fields": {
            "id": {
                "type": "ID",
                "dataType": "INTEGER",
                "isPk": true,
                "isList": false,
                "allowNull": false,
                "name": "id",
                "title": "id",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "title": {
                "type": "String",
                "dataType": "STRING",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "title",
                "title": "title",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "over": {
                "type": "Boolean",
                "dataType": "BOOLEAN",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "over",
                "title": "over",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "createdAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "createdAt",
                "title": "createdAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "updatedAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "updatedAt",
                "title": "updatedAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "ownerId": {
                "type": "Int",
                "dataType": "INTEGER",
                "isPk": false,
                "isList": false,
                "allowNull": true,
                "name": "ownerId",
                "title": "ownerId",
                "sortable": true,
                "editable": true,
                "createAble": true
            },
            "user": {
                "type": "User",
                "isList": false,
                "allowNull": true,
                "name": "user",
                "title": "user",
                "sortable": false,
                "editable": false,
                "createAble": true
            }
        }
    },
    "Task": {
        "name": "Task",
        "pkName": "id",
        "type": "Task",
        "description": "Task",
        "createAble": true,
        "editable": true,
        "removeAble": true,
        "fields": {
            "id": {
                "type": "ID",
                "dataType": "INTEGER",
                "isPk": true,
                "isList": false,
                "allowNull": false,
                "name": "id",
                "title": "id",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "name": {
                "type": "String",
                "dataType": "STRING",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "name",
                "title": "name",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "createdAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "createdAt",
                "title": "createdAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "updatedAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "updatedAt",
                "title": "updatedAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "users": {
                "type": "User",
                "isList": true,
                "allowNull": true,
                "name": "users",
                "title": "users",
                "sortable": false,
                "editable": false,
                "createAble": true
            }
        }
    },
    "User": {
        "name": "User",
        "pkName": "id",
        "type": "User",
        "description": "User",
        "createAble": true,
        "editable": true,
        "removeAble": true,
        "fields": {
            "name": {
                "type": "String",
                "dataType": "STRING",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "name",
                "title": "name",
                "sortable": false,
                "editable": true,
                "createAble": true
            },
            "createdAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "createdAt",
                "title": "createdAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "updatedAt": {
                "type": "Date",
                "dataType": "DATE",
                "isPk": false,
                "isList": false,
                "allowNull": false,
                "name": "updatedAt",
                "title": "updatedAt",
                "sortable": true,
                "editable": false,
                "createAble": false
            },
            "projects": {
                "type": "Project",
                "isList": true,
                "allowNull": true,
                "name": "projects",
                "title": "projects",
                "sortable": false,
                "editable": false,
                "createAble": true
            },
            "tasks": {
                "type": "Task",
                "isList": true,
                "allowNull": true,
                "name": "tasks",
                "title": "tasks",
                "sortable": false,
                "editable": false,
                "createAble": true
            }
        }
    }
}


export default metadata

