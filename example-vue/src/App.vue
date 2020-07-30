<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p>{{JSON.stringify(data)}}</p>
  </div>
</template>

<script>
import {api} from "@/main";

export default {
  name: 'App',
  setup() {
    const {data} = api.User.listPage.useQuery()
    return {
      data
    }
  },
  mounted() {
    this.$api.User.listPage.query().then(res => console.log('数据', res))
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
