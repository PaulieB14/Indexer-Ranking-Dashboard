import React, { useState, useEffect } from 'react'
import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'

// Define the GraphQL query for indexer data (Arbitrum subgraph)
const GET_INDEXERS = gql`
  {
    indexers(first: 100) {
      id
      account {
        defaultDisplayName
      }
      stakedTokens
      delegatedTokens
      queryFeesCollected
      allocatedTokens
    }
  }
`

// Define the ENS query (updated to search by resolvedAddress)
const ENS_QUERY = gql`
  query ENSQuery($address: String!) {
    domains(where: { resolvedAddress: $address }) {
      name
      resolvedAddress {
        id
      }
    }
  }
`

// Set up Apollo Client for ENS subgraph
const ensClient = new ApolloClient({
  link: new HttpLink({
    uri:
      'https://gateway.thegraph.com/api/b4fe37a0021860d90883a4b60ae90351/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH',
  }),
  cache: new InMemoryCache(),
})

const App = () => {
  const { loading, error, data } = useQuery(GET_INDEXERS)
  const [ensNames, setEnsNames] = useState({})

  useEffect(() => {
    // Function to fetch ENS names using The Graph's subgraph (by resolvedAddress)
    const fetchENSNames = async (indexers) => {
      const ensPromises = indexers.map(async (indexer) => {
        try {
          // Query ENS by address (resolvedAddress)
          const { data: ensData } = await ensClient.query({
            query: ENS_QUERY,
            variables: { address: indexer.id },
          })

          if (ensData.domains.length > 0) {
            return { id: indexer.id, name: ensData.domains[0].name }
          } else {
            return { id: indexer.id, name: null }
          }
        } catch (error) {
          console.error(`Failed to fetch ENS for ${indexer.id}:`, error)
          return { id: indexer.id, name: null }
        }
      })

      const ensResults = await Promise.all(ensPromises)
      const ensNameMap = ensResults.reduce((acc, { id, name }) => {
        acc[id] = name || id // Use ENS name if available, otherwise fall back to wallet address
        return acc
      }, {})

      setEnsNames(ensNameMap)
    }

    if (data && data.indexers) {
      fetchENSNames(data.indexers)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="dashboard">
      <h1>Graph Query Fee Power Ranking</h1>
      <h2 className="subtitle">💪 Pound-for-Pound Indexer Rankings 💪</h2>
      <p className="graphtronauts">Brought to you by Graphtronauts</p>

      <table className="fancy-table">
        <thead>
          <tr>
            <th>Indexer Name</th>
            <th>Total Stake (GRT)</th>
            <th>Query Fees Collected (GRT)</th>
            <th>Query Fee Power Ranking</th>
          </tr>
        </thead>
        <tbody>
          {data.indexers
            .filter((indexer) => {
              const totalStakeWei =
                parseInt(indexer.stakedTokens) +
                parseInt(indexer.delegatedTokens)
              const totalStakeGRT = totalStakeWei / 1e18

              // Exclude indexers with total stake < 100,000 GRT or 0 query fees
              return (
                totalStakeGRT >= 100000 &&
                parseInt(indexer.queryFeesCollected) > 0
              )
            })
            .map((indexer) => {
              // Calculate total stake (GRT)
              const totalStake =
                (parseInt(indexer.stakedTokens) +
                  parseInt(indexer.delegatedTokens)) /
                1e18
              const queryFeesCollected =
                parseInt(indexer.queryFeesCollected) / 1e18

              // Query Fee Power Ranking (Query Fees / Total Stake)
              const queryFeePowerRanking =
                totalStake > 0 ? queryFeesCollected / totalStake : 'N/A'

              return {
                id: indexer.id,
                totalStake,
                queryFeesCollected,
                queryFeePowerRanking,
                ensName: ensNames[indexer.id] || indexer.id, // Display ENS or fallback to address
              }
            })
            // Sort by Query Fee Power Ranking in descending order
            .sort((a, b) => b.queryFeePowerRanking - a.queryFeePowerRanking)
            .map((indexer) => (
              <tr key={indexer.id}>
                <td>{indexer.ensName}</td>
                <td>
                  {indexer.totalStake.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td>
                  {indexer.queryFeesCollected.toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })}
                </td>
                <td>{indexer.queryFeePowerRanking.toFixed(4)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Explanation of how rankings are calculated */}
      <p className="explanation">
        Query Fee Power Ranking is calculated as: <br />
        <strong>Query Fees Collected / Total Stake (GRT)</strong>
      </p>
    </div>
  )
}

export default App
