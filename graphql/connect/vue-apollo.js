import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

// Install the vue plugin
Vue.use(VueApollo)

// Call this in the Vue app file
export function createProvider () {
  // Create apollo client
  const apolloClient = new ApolloClient({
    // You should use an absolute URL here
    uri: 'https://zhuu7gxle5.execute-api.us-east-1.amazonaws.com/dev/graphql'
  })

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
  })

  return apolloProvider
}
