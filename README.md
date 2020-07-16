# graphql 请求文本生成工具

## 安装
```bash
$ yarn add @puti94/gql-utils // or npm i @puti94/gql-utils --save
```

## 示例
```js
  import {generateFieldText} from '@puti94/gql-utils'
  generateFieldText('query', {
       fields: {
         a: {
           alias: 'alias',
           args: {a: 'a', b: 1, c: false, d: ['a', 1, true, new Utils.GqlEnum('menu')]},
           fields: ["a"]
         }
       }
     });
  // 'query{alias:a(a:"a",b:1,c:false,d:["a",1,true,menu]){a}}'
```
