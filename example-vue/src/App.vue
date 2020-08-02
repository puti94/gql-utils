<template>
  <div id="app" v-if="data">
    <h1>用户列表</h1>
    <p>总共{{data.total}}</p>
    <button @click="createAccount">添加</button>
    <p v-for="(item) in data.list" :key="item.uuid">
      <span>用户名{{item.name}}</span>
      <span>-----创建时间{{item.createdAt}}</span>
      <span>-----更新时间{{item.updatedAt}}</span>
      <button @click="updateAccount({data:{name:item.name += '%'},id:item.uuid})">更新</button>
      <button @click="removeAccount(item.uuid)">删除</button>
    </p>
  </div>
</template>

<script>
import {api} from "./main";

export default {
  name: 'App',
  setup() {
    const {data, refetch} = api.Account.listPage.useQuery({variables: {order: [{name: 'updatedAt', sort: 'desc'}]}})
    const {mutate: create, onDone: createDone} = api.Account.create.useMutation()
    const {mutate: remove, onDone: removeDone} = api.Account.remove.useMutation()
    const {mutate: update, onDone: updateDone} = api.Account.update.useMutation()
    createDone((res) => {
      console.log('createDone', res)
      refetch()
    })
    removeDone((res) => {
      console.log('removeDone', res)
      refetch()
    })
    updateDone((res) => {
      console.log('updateDone', res)
      refetch()
    })
    return {
      data,
      refetch,
      create,
      remove,
      update
    }
  },
  methods: {
    createAccount() {
      this.create({
        data: {
          name: "哈哈"
        }
      }).then(res => console.log('createAccount', res))
    },
    removeAccount(id) {
      this.remove({id}).then(res => console.log('removeAccount', res))
    },
    updateAccount(data) {
      this.update(data).then(res => console.log('updateAccount', res))
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
