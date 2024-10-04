// src/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri:
    'https://gateway.thegraph.com/api/b4fe37a0021860d90883a4b60ae90351/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp', // Replace with your subgraph GraphQL endpoint
  cache: new InMemoryCache(),
})

export default client
