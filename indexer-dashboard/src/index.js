// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import './index.css'
import App from './App'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient' // Import the Apollo Client

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
