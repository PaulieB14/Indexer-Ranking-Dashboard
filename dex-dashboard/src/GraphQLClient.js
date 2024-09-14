import { ApolloClient, InMemoryCache } from '@apollo/client'

const getClient = (subgraphId) => {
  return new ApolloClient({
    uri: `https://gateway.thegraph.com/api/b4fe37a0021860d90883a4b60ae90351/subgraphs/id/${subgraphId}`, // Dynamic URL with your API key
    cache: new InMemoryCache(),
  })
}

export default getClient
