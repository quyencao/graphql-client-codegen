<template>
  <div class="apollo-example">

    <!-- Apollo watched Graphql query -->
    <ApolloQuery
      :query="require('../gqls/GetPost.gql')"
      :variables="{
      
      }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
            <pre>Data</pre>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.apollo,
.message {
  padding: 12px;
}

.error {
  color: red;
}
</style>