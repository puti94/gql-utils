const Utils = require("../dist/generateText");
const assert = require("assert");


describe("generateText", () => {
  it("generateFieldText with alias", function () {
    assert.strictEqual(Utils.generateFieldText('query', {alias: 'alias'}), "alias:query");
  });
  it("generateFieldText with args", function () {
    assert.strictEqual(Utils.generateFieldText('query', {args: {a: '11'}}), 'query(a:"11")');
  });
  it("generateFieldText with args and menu", function () {
    assert.strictEqual(Utils.generateFieldText('query', {args: {a: new Utils.GqlEnum('menu')}}), 'query(a:menu)');
  });
  it("generateFieldText with complex args", function () {
    assert.strictEqual(Utils.generateFieldText('query', {
      args: {
        a: new Utils.GqlEnum('menu'),
        b: ["name", 12, true, new Utils.GqlEnum('menu')],
        c: {a: "name", b: 12, c: false, d: 1.22, f: new Utils.GqlEnum('menu')}
      }
    }), 'query(a:menu,b:["name",12,true,menu],c:{a:"name",b:12,c:false,d:1.22,f:menu})');
  });
  it("generateFieldText with string array fields", function () {
    assert.strictEqual(Utils.generateFieldText('query', {fields: ['a', 'b']}), "query{a,b}");
  });
  it("generateFieldText with object array fields", function () {
    assert.strictEqual(Utils.generateFieldText('query', {fields: [{name: 'a'}, {name: 'b'}]}), "query{a,b}");
  });
  it("generateFieldText with map  fields", function () {
    assert.strictEqual(Utils.generateFieldText('query', {fields: {a: true, b: true}}), "query{a,b}");
  });
  it("generateFieldText with complex fields", function () {
    assert.strictEqual(Utils.generateFieldText('query', {
      fields: {
        a: {
          fields: ['a', 'b', {name: 'c'}, {
            name: 'b',
            fields: ['a', 'b']
          }]
        }
      }
    }), "query{a{a,b{a,b},c}}");
  });
  it("generateFieldsText with string array ", function () {
    assert.strictEqual(Utils.generateFieldsText(['a', 'b']), "a,b");
  });
  it("generateFieldText with complex ", function () {
    assert.strictEqual(Utils.generateFieldText('query', {
      fields: {
        a: {
          alias: 'alias',
          args: {a: 'a', b: 1, c: false, d: ['a', 1, true, new Utils.GqlEnum('menu')]},
          fields: ["a"]
        }
      }
    }), 'query{alias:a(a:"a",b:1,c:false,d:["a",1,true,menu]){a}}');
  });
});
