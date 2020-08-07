import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'

// styles
import './index.css'

// components
import App from './App'

const uploadLink = createUploadLink({
  uri: 'http://localhost:5000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

// configuring apollo client
const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
