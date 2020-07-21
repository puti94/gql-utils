/**
 * User: puti.
 * Time: 2020/7/21 11:51 上午.
 */
module.exports.tableList = [
  {
    "type": "Project",
    "name": "project",
    "pkName": "id",
    "fields": [
      {
        "type": "Int",
        "name": "id",
        "title": "id",
        "isList": false,
        "dataType": "INTEGER"
      },
      {
        "type": "String",
        "name": "title",
        "title": "title",
        "isList": false,
        "dataType": "STRING"
      },
      {
        "type": "Int",
        "name": "ownerId",
        "title": "ownerId",
        "isList": false,
        "dataType": "INTEGER"
      },
      {
        "type": "User",
        "name": "user",
        "title": "user",
        "isList": false,
        "dataType": null
      }
    ]
  },
  {
    "type": "User",
    "name": "user",
    "pkName": "id",
    "fields": [
      {
        "type": "Int",
        "name": "id",
        "title": "id",
        "isList": false,
        "dataType": "INTEGER"
      },
      {
        "type": "String",
        "name": "name",
        "title": "name",
        "isList": false,
        "dataType": "STRING"
      },
      {
        "type": "Project",
        "name": "projects",
        "title": "projects",
        "isList": true,
        "dataType": null
      }
    ]
  }
]

module.exports.tableMap = {
  "Project": {
    "id": {"type": "Int", "title": "id", "isList": false, "dataType": "INTEGER"},
    "title": {"type": "String", "title": "title", "isList": false, "dataType": "STRING"},
    "ownerId": {"type": "Int", "title": "ownerId", "isList": false, "dataType": "INTEGER"},
    "user": {"type": "User", "title": "user", "isList": false, "dataType": null}
  },
  "User": {
    "id": {"type": "Int", "title": "id", "isList": false, "dataType": "INTEGER"},
    "name": {"type": "String", "title": "name", "isList": false, "dataType": "STRING"},
    "projects": {"type": "Project", "title": "projects", "isList": true, "dataType": null}
  }
}

