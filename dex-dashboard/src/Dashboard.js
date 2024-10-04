import React, { useState, useEffect, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import getClient from './GraphQLClient'

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
      dailyUsageMetrics(first: 1) {
        dailySwapCount
      }
      financialMetrics(first: 1) {
        dailyTotalRevenueUSD
      }
      cumulativeUniqueUsers
    }
  }
`

// Helper function to format numbers with commas and two decimal places
const formatNumber = (value) => {
  if (!value) return 'N/A' // Handle empty or undefined values
  const number = parseFloat(value) // Ensure value is a number
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

// Metric Card Component
const MetricCard = ({ title, value }) => {
  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        flex: '1 1 calc(25% - 20px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
      <p style={{ fontSize: '24px', margin: '10px 0', color: '#333' }}>
        {formatNumber(value)}
      </p>
    </div>
  )
}

const Dashboard = () => {
  const [dex, setDex] = useState('Bancor') // Default DEX selection
  const client = useMemo(() => getClient(SUBGRAPH_IDS[dex]), [dex])

  const { loading, error, data } = useQuery(DEX_DATA_QUERY, { client })
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    if (data) {
      const dexMetrics = data.dexAmmProtocols[0]
      setMetrics({
        tvl: dexMetrics.totalValueLockedUSD,
        volume: dexMetrics.cumulativeVolumeUSD,
        dailySwapCount: dexMetrics.dailyUsageMetrics[0].dailySwapCount,
        revenue: dexMetrics.financialMetrics[0].dailyTotalRevenueUSD,
        users: dexMetrics.cumulativeUniqueUsers,
      })
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching data</p>

  return (
    <div style={{ padding: '20px' }}>
      <h2>{dex} DEX Dashboard</h2>

      {/* Dropdown to select DEX */}
      <select
        onChange={(e) => setDex(e.target.value)}
        value={dex}
        style={{ marginBottom: '20px', padding: '10px', fontSize: '16px' }}
      >
        {Object.keys(SUBGRAPH_IDS).map((dexName) => (
          <option key={dexName} value={dexName}>
            {dexName}
          </option>
        ))}
      </select>

      {/* Metrics Display */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <MetricCard title="Total Value Locked (TVL)" value={metrics.tvl} />
        <MetricCard title="24-Hour Trading Volume" value={metrics.volume} />
        <MetricCard title="Number of Trades" value={metrics.dailySwapCount} />
        <MetricCard title="Number of Users" value={metrics.users} />
        <MetricCard title="Fees Generated" value={metrics.revenue} />
      </div>
    </div>
  )
}

export default Dashboard
