<template>
  <div>
    <ApolloMutation
      :mutation="require('../gqls/DeletePost.gql')"
      :variables="{
        
      }"
    >
      <template slot-scope="{ mutate }">
        <button v-on:click="mutate()">
          Click Me
        </button>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>
