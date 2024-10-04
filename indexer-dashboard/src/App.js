import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { JsonRpcProvider } from 'ethers' // Correct way to import in ethers v6+

// Define the GraphQL query
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

const App = () => {
  const { loading, error, data } = useQuery(GET_INDEXERS)
  const [ensNames, setEnsNames] = useState({})

  useEffect(() => {
    // Fetch ENS names using ethers.js
    const fetchENSNames = async (indexers) => {
      const provider = new JsonRpcProvider(process.env.REACT_APP_INFURA_URL)

      const ensPromises = indexers.map(async (indexer) => {
        const ensName = await provider.lookupAddress(indexer.id)
        return { id: indexer.id, name: ensName }
      })

      const ensResults = await Promise.all(ensPromises)
      const ensNameMap = ensResults.reduce((acc, { id, name }) => {
        acc[id] = name || id // Default to ID if no ENS name found
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
      <h1>Indexer Query Fee Dashboard</h1>
      <table className="fancy-table">
        <thead>
          <tr>
            <th>Indexer Name</th>
            <th>Total Stake (ETH)</th>
            <th>Query Fees Collected (ETH)</th>
            <th>Query Fee Power Ranking</th>
          </tr>
        </thead>
        <tbody>
          {data.indexers
            .filter(
              (indexer) =>
                parseInt(indexer.stakedTokens) +
                  parseInt(indexer.delegatedTokens) >
                0,
            ) // Filter out indexers with 0 stake
            .map((indexer) => {
              const totalStake =
                (parseInt(indexer.stakedTokens) +
                  parseInt(indexer.delegatedTokens)) /
                1e18 // Convert to ETH
              const queryFeesCollected =
                parseInt(indexer.queryFeesCollected) / 1e18 // Convert to ETH
              const queryFeePowerRanking =
                indexer.allocatedTokens !== '0' &&
                indexer.allocatedTokens !== null
                  ? queryFeesCollected /
                    (parseInt(indexer.allocatedTokens) / 1e18)
                  : 'N/A'

              return (
                <tr key={indexer.id}>
                  <td>{ensNames[indexer.id] || indexer.id}</td>
                  <td>{totalStake.toFixed(4)}</td>
                  <td>{queryFeesCollected.toFixed(4)}</td>
                  <td>
                    {queryFeePowerRanking !== 'N/A'
                      ? queryFeePowerRanking.toFixed(4)
                      : 'N/A'}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default App
