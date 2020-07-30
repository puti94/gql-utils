import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ApolloClient} from '@apollo/client';
import {ApolloProvider, InMemoryCache, useQuery} from '@apollo/client';
import {createGqlApi} from "../../dist";
import metadata from "../metadata";


const client = new ApolloClient({
  uri: 'http://localhost:8081/graphql',
  cache: new InMemoryCache()
});
export const api = createGqlApi(
    metadata, {
      client: client,
      useReactQuery: useQuery
    }
)

function Test() {
  const {data} = api.User.one.useQuery({})
  console.log('数据', data)
  return <div>
    {JSON.stringify(data)}
  </div>
}

function App() {
  return (
      <ApolloProvider client={client}>
        
        <Test/>
        <Test/>
        <Test/>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ApolloProvider>
  );
}

export default App;
