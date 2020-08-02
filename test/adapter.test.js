const Utils = require("../dist/adapterUtils");
const gql = require("graphql-tag");
const assert = require("assert");
const _ = require("lodash");

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

