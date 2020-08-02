import React from 'react';
import './App.css';
import {ApolloProvider, InMemoryCache, useQuery, useMutation, ApolloClient} from '@apollo/client';
import {createApiClient} from "../../dist";
import metadata from "./metadata";
import {Account} from '../types'

const client = new ApolloClient({
    uri: 'http://localhost:8081/graphql',
    cache: new InMemoryCache()
});

export const api = createApiClient(metadata,
    {
        client: client,
        type: 'react',
        useQuery: useQuery,
        useMutation: useMutation
    }
)


function Example() {
    const {data, refetch} = api.Account.listPage.useQuery<{ total: number, list: Account[] }>({
        variables: {
            order: [{
                name: 'updatedAt',
                sort: 'desc'
            }]
        }
    });
    const [create] = api.Account.create!.useMutation<Account>({
        onCompleted: (res: any) => {
            console.log('onCreateCompleted', res)
            refetch()
        }
    })
    const [update] = api.Account.update!.useMutation<Account>({onCompleted: () => refetch()})
    // @ts-ignore
    const [remove] = api.Account.remove!.useMutation<boolean>({onCompleted: () => refetch()})
    return <div>
        <h1>用户列表</h1>
        <p>总共{data?.total}</p>
        <button onClick={() => {
            create({variables: {data: {name: 'react添加'}}}).then((res: any) => console.log('create', res))
        }}>
            添加
        </button>
        {data?.list.map((item: Account) => <p key={item.uuid}>
            <span>用户名{item.name}</span>
            <span>-----创建时间{item.createdAt}</span>
            <span>-----更新时间{item.updatedAt}</span>
            <button onClick={() => update({
                variables: {
                    data: {name: item.name + '%'},
                    id: item.uuid
                }
            }).then((res: any) => console.log('update', res))}>更新
            </button>
            <button
                onClick={() => remove({variables: {id: item.uuid}}).then((res: any) => console.log('remove', res))}>删除
            </button>
        </p>)}
    </div>
}

function App() {
    return (
        <ApolloProvider client={client}>
            <Example/>
        </ApolloProvider>
    );
}

export default App;
