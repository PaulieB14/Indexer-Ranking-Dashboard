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

// Set up Apollo Client for ENS subgraph using environment variable for the API key
const ensClient = new ApolloClient({
  link: new HttpLink({
    uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`,
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
        acc[id] = name || id // Use ENS name if available, otherwise fallback to wallet address
        return acc
      }, {})

      setEnsNames(ensNameMap)
    }

    if (data && data.indexers) {
      fetchENSNames(data.indexers)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) {
    console.error('GraphQL Query Error:', error)
    return <p>Error: {error.message}</p>
  }

  return (
    <div className="dashboard">
      <h1>Graph Query Fee Power Ranking</h1>
      <h2 className="subtitle">💪 Pound-for-Pound Indexer Rankings 💪</h2>
      <p className="graphtronauts">Brought to you by Graphtronauts</p>

      <table className="fancy-table">
        <thead>
          <tr>
            <th>Rank</th> {/* New Rank Column */}
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
            .sort((a, b) => {
              const aTotalStake = (parseInt(a.stakedTokens) + parseInt(a.delegatedTokens)) / 1e18
              const bTotalStake = (parseInt(b.stakedTokens) + parseInt(b.delegatedTokens)) / 1e18
              const aQueryFeePowerRanking = parseInt(a.queryFeesCollected) / aTotalStake
              const bQueryFeePowerRanking = parseInt(b.queryFeesCollected) / bTotalStake
              return bQueryFeePowerRanking - aQueryFeePowerRanking
            })
            .map((indexer, rank) => {
              const totalStake =
                (parseInt(indexer.stakedTokens) +
                  parseInt(indexer.delegatedTokens)) /
                1e18
              const queryFeesCollected =
                parseInt(indexer.queryFeesCollected) / 1e18

              // Query Fee Power Ranking (Query Fees / Total Stake)
              const queryFeePowerRanking =
                totalStake > 0 ? queryFeesCollected / totalStake : 'N/A'
              const ensName = ensNames[indexer.id] || indexer.id

              return (
                <tr key={indexer.id}>
                  <td>{rank + 1}</td> {/* Display Rank Number */}
                  <td>{ensName}</td>
                  <td>
                    {totalStake.toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </td>
                  <td>
                    {queryFeesCollected.toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })}
                  </td>
                  <td>{typeof queryFeePowerRanking === 'number' ? queryFeePowerRanking.toFixed(4) : 'N/A'}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default App
