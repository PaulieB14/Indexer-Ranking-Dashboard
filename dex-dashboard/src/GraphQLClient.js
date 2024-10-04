import { ApolloClient, InMemoryCache } from '@apollo/client' // Import Apollo Client and cache

// Function to return a new Apollo Client for a specific subgraph
const getClient = (subgraphId) => {
  return new ApolloClient({
    uri: `https://gateway.thegraph.com/api/b4fe37a0021860d90883a4b60ae90351/subgraphs/id/${subgraphId}`, // Replace with your API key and subgraph ID
    cache: new InMemoryCache(),
  })
}

export default getClient
