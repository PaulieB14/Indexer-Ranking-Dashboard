import React from 'react'
import { ApolloProvider } from '@apollo/client' // Import Apollo Provider
import getClient from './GraphQLClient' // Import your Apollo Client setup
import Dashboard from './Dashboard' // Import the Dashboard component

// Initialize Apollo Client with Bancor as the default subgraph
const client = getClient('4Q4eEMDBjYM8JGsvnWCafFB5wCu6XntmsgxsxwYSnMib')

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Messari DEX Info Dashboard</h1>
        <Dashboard /> {/* Render the Dashboard component */}
      </div>
    </ApolloProvider>
  )
}

export default App
