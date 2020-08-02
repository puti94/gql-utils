import Vue from 'vue'
import App from './App.vue'
import ApolloClient from 'apollo-boost'
import VueCompositionAPI, {provide} from '@vue/composition-api'
import {DefaultApolloClient, useQuery, useResult, useMutation} from '@vue/apollo-composable'
import {createApiClient} from '../../dist'
import metadata from "../metadata";

Vue.config.productionTip = false

const apolloClient = new ApolloClient({
  uri: 'http://localhost:8081/graphql'
})

Vue.use(VueCompositionAPI)
export const api = createApiClient(
    metadata, {
      client: apolloClient,
      useQuery: useQuery,
      useMutation: useMutation,
      useResult,
      metadataMap: {
        Account: {
          type: 'Account',
          pkName: 'uuid',
          createAble: true,
          editable: true,
          removeAble: true,
        }
      }
    }
)
Vue.prototype.$api = api;
new Vue({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: h => h(App),
}).$mount('#app')
