import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
    fetchOptions: {
        mode: 'cors',
    },
});

const authLink = new ApolloLink((operation, forward) => {
    const token = Cookies.get('accessToken');
    if (token) {
        operation.setContext({
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
    return forward(operation);
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client;
