import React from 'react'
import { ApolloProvider } from '@apollo/client'
import Dashboard from './Dashboard'
import getClient from './GraphQLClient' // Import dynamic client function

// Initially, use the Bancor client (you can switch dynamically in the dashboard)
const client = getClient('4Q4eEMDBjYM8JGsvnWCafFB5wCu6XntmsgxsxwYSnMib')

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Messari DEX Info Dashboard</h1>
        <Dashboard />
      </div>
    </ApolloProvider>
  )
}

export default App
