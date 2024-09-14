const Dashboard = () => {
  const [dex, setDex] = useState('Bancor') // Default DEX is Bancor
  const client = getClient(SUBGRAPH_IDS[dex]) // Get Apollo Client for the selected DEX

  const { loading, error, data } = useQuery(DEX_DATA_QUERY, { client })
  const [chartData, setChartData] = useState(null)

  // Log loading, error, and data states for debugging
  console.log('Loading:', loading)
  console.log('Error:', error)
  console.log('Data:', data)

  useEffect(() => {
    if (data) {
      console.log('Fetched Data:', data) // Check the structure of data being fetched
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
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching data</p>

  return (
    <div>
      <h2>{dex} DEX Dashboard</h2>

      {/* Dropdown to select DEX */}
      <select onChange={(e) => setDex(e.target.value)} value={dex}>
        {Object.keys(SUBGRAPH_IDS).map((dexName) => (
          <option key={dexName} value={dexName}>
            {dexName}
          </option>
        ))}
      </select>

      {/* Chart to display data */}
      {chartData && <Line data={chartData} />}
    </div>
  )
}
