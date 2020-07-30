const Utils = require("../dist/adapterUtils");
const gql = require("graphql-tag");
const assert = require("assert");
const _ = require("lodash");
const {tableList, tableMap} = require('../example-vue/metadata')

describe("queryTable", () => {
  it("queryTable with one and obj fields", function () {
    assert.strictEqual((gql`${Utils.queryTable({
      name: 'test', fields: {
        a: true
      }
    })}`), (gql`query testFindOne($where:JSONType,$scope:[String]){
    test {
      one(where:$where,scope:$scope) {
       a
    }
  }
}`));
  });
  it("queryTable with one and array fields", function () {
    assert.strictEqual((gql`${Utils.queryTable({
      name: 'test', fields: ['a']
    })}`), (gql`query testFindOne($where:JSONType,$scope:[String]){
    test {
      one(where:$where,scope:$scope) {
       a
    }
  }
}`));
  });
  it("queryTable with list and obj fields", function () {
    assert.strictEqual((gql`${Utils.queryTable({
      name: 'test',
      isList: true,
      fields: {
        a: true
      }
    })}`), (gql`query testList($limit:Int,$offset:Int,$order:[TestOrderType],$subQuery:Boolean,$where:JSONType,$scope:[String]){
    test {
      list(limit:$limit,offset:$offset,order:$order,subQuery:$subQuery,where:$where,scope:$scope) {
       a
    }
  }
}`));
  });
  it("queryTable with list and count and obj fields", function () {
    assert.strictEqual((gql`${Utils.queryTable({
      name: 'test',
      isList: true,
      withCount: true,
      fields: {
        a: true
      }
    })}`), (gql`query testList($limit:Int,$offset:Int,$order:[TestOrderType],$subQuery:Boolean,$where:JSONType,$scope:[String]){
    test {
      total:aggregate(fn:COUNT,field: _all,where: $where)
      list(limit:$limit,offset:$offset,order:$order,subQuery:$subQuery,where:$where,scope:$scope) {
       a
    }
  }
}`));
  });
  it("queryTable with list and count and complex fields", function () {
    assert.strictEqual((gql`${Utils.queryTable({
      name: 'test',
      isList: true,
      withCount: true,
      fields: {
        a: true,
        b: {
          alias: 'name'
        },
        c: {
          fields: ['d', 'e']
        }
      }
    })}`), (gql`query testList($limit:Int,$offset:Int,$order:[TestOrderType],$subQuery:Boolean,$where:JSONType,$scope:[String]){
    test {
      total:aggregate(fn:COUNT,field: _all,where: $where)
      list(limit:$limit,offset:$offset,order:$order,subQuery:$subQuery,where:$where,scope:$scope) {
       a,name:b,c{d,e}
    }
  }
}`));
  });
});
describe("tableList2Map", () => {
  it("tableList2Map", function () {
    assert.deepStrictEqual(Utils.tableList2Map(tableList), {
      Project: {
        id: {
          dataType: "INTEGER",
          isList: false,
          title: "id",
          type: "Int"
        },
        ownerId: {
          dataType: "INTEGER",
          isList: false,
          title: "ownerId",
          type: "Int"
        },
        title: {
          dataType: "STRING",
          isList: false,
          title: "title",
          type: "String"
        },
        user: {
          dataType: null,
          isList: false,
          title: "user",
          type: "User"
        }
      },
      User: {
        id: {
          dataType: "INTEGER",
          isList: false,
          title: "id",
          type: "Int"
        },
        name: {
          dataType: "STRING",
          isList: false,
          title: "name",
          type: "String"
        },
        projects: {
          dataType: null,
          isList: true,
          title: "projects",
          type: "Project"
        },
      }
    })
  });
});
describe("flattenFields", () => {
  it("flattenFields with normal params", function () {
    assert.deepStrictEqual(Object.keys(Utils.flattenFields(tableMap, {name: 'Project'})), [
      "id",
      "title",
      "ownerId",
      "user.id",
      "user.name",
      "user.projects.id",
      "user.projects.title",
      "user.projects.ownerId"
    ])
  });
  it("flattenFields with normal user", function () {
    assert.deepStrictEqual(Object.keys(Utils.flattenFields(tableMap, {name: 'User'})), [
      "id",
      "name",
      "projects.id",
      "projects.title",
      "projects.ownerId",
      "projects.user.id",
      "projects.user.name"
    ])
  });
  it("flattenFields with pickFields", function () {
    assert.deepStrictEqual(Object.keys(Utils.flattenFields(tableMap, {
      name: 'User',
      pickFields: ['id', 'name']
    })), [
      "id",
      "name"
    ])
  });
  it("flattenFields with mergeFields", function () {
    assert.deepStrictEqual(Utils.flattenFields(tableMap, {
      name: 'User',
      deep: 5,
      pickFields: ['projects.user.projects.id'],
      mergeFields: {
        "projects.user.projects.id": {
          isList: true
        }
      }
    }), {
      "projects.user.projects.id": {
        "dataType": "INTEGER",
        "field": {
          "fields": {
            "user": {
              "fields": {
                "projects": {
                  "fields": [
                    "id"
                  ]
                }
              }
            }
          },
          "name": "projects"
        },
        "isList": true,
        "prop": "projects.user.projects.id",
        "title": "id",
        "type": "Int",
        "typeName": "Project"
      }
    })
  });
});
describe("generateGqlFields", () => {
  const {Project, User} = Utils.generateGqlFields(Utils.tableList2Map(tableList), {typeNameMap: Utils.tableList2TypeNameMap(tableList)});
  it("one", function () {
    assert.strictEqual(User.one({pickFields: ["projects.id", "id", "name"]}), `query userFindOne($where:JSONType,$scope:[String]){
    user {
      one(where:$where,scope:$scope) {
       projects{id},id,name
    }
  }
}`)
  });
  it("aggregate", function () {
    assert.strictEqual(User.aggregate({field: "id", fn: "sum"}), `query userAggregate($where:JSONType){
    user {
      aggregate(fn:sum,field: id,where: $where)
    }
  }
}`)
  });
});
