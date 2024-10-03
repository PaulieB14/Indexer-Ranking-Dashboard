// src/App.js
import React from 'react'
import { useQuery, gql } from '@apollo/client'

// Define the GraphQL query
const GET_INDEXERS = gql`
  {
    indexers(first: 100) {
      id
      stakedTokens
      delegatedTokens
      queryFeesCollected
    }
  }
`

const App = () => {
  const { loading, error, data } = useQuery(GET_INDEXERS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h1>Indexer Query Fee Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Indexer ID</th>
            <th>Total Stake</th>
            <th>Query Fees Collected</th>
          </tr>
        </thead>
        <tbody>
          {data.indexers.map((indexer) => (
            <tr key={indexer.id}>
              <td>{indexer.id}</td>
              <td>
                {parseInt(indexer.stakedTokens) +
                  parseInt(indexer.delegatedTokens)}
              </td>
              <td>{indexer.queryFeesCollected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
