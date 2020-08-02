# graphql 工具，包括生成graphql请求文本，生成graphql-adapter的客户端

## 安装
```bash
$ yarn add @puti94/gql-utils // or npm i @puti94/gql-utils --save
```

## 生成字符串示例
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
## 创建apiClient示例
```js
  import {createApiClient} from '@puti94/gql-utils'
  import {ApolloClient} from "@apollo/client";
  //元数据可由graphql-adapter 的 _metadataMap 字段获取
  const metadata = {
    user:{
      type:'User',
      name:'User',
      createAble:true,
      pkName:"uid",
      editable:true,
      removeAble:true,
      fields:{
        uid:{
          type:"ID",
          primaryKey:true
        },
        name:{
          type:"String"
        },
      }
    }
  }
  const api = createApiClient(metadata, {
       client: new ApolloClient({...}),
       useQuery,
       useMutation
     });
   //简单使用
   api.user.one.query().then(res=>console.log(res.data.uid))
   const {data} = api.user.one.useQuery()

   const {mutate} = api.user.create.useMutation()

   mutate({data:{name:"张三"}})
```
