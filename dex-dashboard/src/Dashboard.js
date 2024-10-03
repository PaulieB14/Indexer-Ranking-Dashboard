import React, { useState, useEffect, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import getClient from './GraphQLClient'
import { Line } from 'react-chartjs-2'

const SUBGRAPH_IDS = {
  Bancor: '4Q4eEMDBjYM8JGsvnWCafFB5wCu6XntmsgxsxwYSnMib',
  Curve: '3fy93eAT56UJsRCEht8iFhfi6wjHWXtZ9dnnbQmvFopF',
  Sushiswap: '77jZ9KWeyi3CJ96zkkj5s1CojKPHt6XJKjLFzsDCd8Fd',
  Balancer: 'QmVBhgtdcaM25eVPLzL8Ra6oriy71yeS5otXMFdKshwxDx',
  UniswapV2: '3onEbd9MLfXTTWAfP91yqsKr7C68VCT2ZiF7EoQiQAFj',
}

// GraphQL Query for DEX data
const DEX_DATA_QUERY = gql`
  {
    dexAmmProtocols {
      name
      network
      totalValueLockedUSD
      cumulativeVolumeUSD
      dailyUsageMetrics(first: 30) {
        dailySwapCount
        timestamp
      }
      financialMetrics(first: 30) {
        dailyTotalRevenueUSD
        timestamp
      }
      cumulativeUniqueUsers
    }
  }
`

const Dashboard = () => {
  const [dex, setDex] = useState('Bancor') // Default DEX selection

  // Use useMemo to memoize the Apollo Client based on the selected dex
  const client = useMemo(() => getClient(SUBGRAPH_IDS[dex]), [dex])

  const { loading, error, data } = useQuery(DEX_DATA_QUERY, { client })
  const [chartData, setChartData] = useState(null)

  // Only runs when 'data' changes, preventing re-renders
  useEffect(() => {
    if (data) {
      const swapCounts = data.dexAmmProtocols[0].dailyUsageMetrics.map(
        (item) => item.dailySwapCount,
      )
      const timestamps = data.dexAmmProtocols[0].dailyUsageMetrics.map((item) =>
        new Date(item.timestamp * 1000).toLocaleDateString(),
      )

      setChartData({
        labels: timestamps,
        datasets: [
          {
            label: 'Daily Swap Count',
            data: swapCounts,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      })
    }
  }, [data]) // Effect runs only when 'data' changes

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching data</p>

  return (
    <div>
      <h2>{dex} DEX Dashboard</h2>

      {/* Dropdown to select DEX */}
      <select
        onChange={(e) => setDex(e.target.value)} // Set DEX when the user changes dropdown
        value={dex}
      >
        {Object.keys(SUBGRAPH_IDS).map((dexName) => (
          <option key={dexName} value={dexName}>
            {dexName}
          </option>
        ))}
      </select>

      {/* Display chart */}
      {chartData && <Line data={chartData} />}
    </div>
  )
}

export default Dashboard
