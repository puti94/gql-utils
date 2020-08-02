export function assertClient(client: any) {
    if (!client) throw new Error(`尚未配置apolloClient:
    const client = new ApolloClient(...);
    createApiClient(metadata,{
        client,
        ...other
    }
)`);
}

export function assertUseQuery(client: any) {
    if (!client) throw new Error(`尚未配置useQuery函数:
    import {useQuery} from 'xxx'
    createApiClient(metadata,{
        useQuery,
        ...other
    }
)`);
}

export function assertUseMutation(client: any) {
    if (!client) throw new Error(`尚未配置useMutation函数:
    import {useMutation} from 'xxx'
    createApiClient(metadata,{
        useMutation,
        ...other
    }
)`);
}
