/**
 * User: puti.
 * Time: 2020/7/29 9:51 下午.
 */
export default {
  "Account": {
    type: "Account",
    createAble: true,
    editable: true,
    removeAble: true,
    pkName: 'uuid',
    fields: {
      "uuid": {
        "type": "ID",
        "dataType": "UUID",
        "isPk": true,
        "isList": false,
        "allowNull": false,
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
        "title": "updatedAt",
        "sortable": true,
        "editable": false,
        "createAble": false
      }
    }
  },
  "Project": {
    type: "Project",
    createAble: true,
    editable: true,
    removeAble: true,
    fields: {
      "id": {
        "type": "Int",
        "dataType": "INTEGER",
        "isPk": true,
        "isList": false,
        "allowNull": false,
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
        "title": "ownerId",
        "sortable": true,
        "editable": true,
        "createAble": true
      },
      "user": {
        "type": "User",
        "isList": false,
        "allowNull": true,
        "title": "user",
        "sortable": false,
        "editable": false,
        "createAble": true
      }
    }
  },
  "Task": {
    type: "Task",
    createAble: true,
    editable: true,
    removeAble: true,
    fields: {
      "id": {
        "type": "Int",
        "dataType": "INTEGER",
        "isPk": true,
        "isList": false,
        "allowNull": false,
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
        "title": "updatedAt",
        "sortable": true,
        "editable": false,
        "createAble": false
      },
      "users": {
        "type": "User",
        "isList": true,
        "allowNull": true,
        "title": "users",
        "sortable": false,
        "editable": false,
        "createAble": true
      }
    }
  },
  "User": {
    type: "User",
    createAble: true,
    editable: true,
    removeAble: true,
    fields: {
      "name": {
        "type": "String",
        "dataType": "STRING",
        "isPk": false,
        "isList": false,
        "allowNull": false,
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
        "title": "updatedAt",
        "sortable": true,
        "editable": false,
        "createAble": false
      },
      "projects": {
        "type": "Project",
        "isList": true,
        "allowNull": true,
        "title": "projects",
        "sortable": false,
        "editable": false,
        "createAble": true
      },
      "tasks": {
        "type": "Task",
        "isList": true,
        "allowNull": true,
        "title": "tasks",
        "sortable": false,
        "editable": false,
        "createAble": true
      }
    }
  }
}

