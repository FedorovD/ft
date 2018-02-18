<template>
  <section class="container">
    <button class="button is-primary" @click="onClick">123321</button>
  </section>
</template>

<script>
// import axios from '~/plugins/axios'

export default {
  async asyncData () {
    // let { data } = await axios.get('/api/users')
    // return { users: data }
  },
  head () {
    return {
      title: 'Fitness'
    }
  },
  methods: {
    onClick () {
      console.log(this)
      this.$toast.success('click', {theme: 'bubble', position: 'top-center'})
    }
  }
}
</script>

<style scoped>
</style>
