<template>
  <div class="login-wrapper"  @keyup.enter="onLogin">
    <div class="columns is-centered">
		<div class="column is-4">
            <div class="field">
              <label class="label">Username or email address</label>
              <div class="control">
                <input class="input" type="text" name="username"  v-model="loginData.login" v-validate="{required: true}" :class="errors.has('username') && 'is-danger' || '' " autofocus>
              </div>
              <p class="help is-danger" v-show="errors.has('password')">{{errors.first('password')}}</p>  
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input class="input" type="password" name="password"  v-model="loginData.password" v-validate="{required: true}" :class="errors.has('password') && 'is-danger' || '' ">
              </div>
              <p class="help is-danger" v-show="errors.has('password')">{{errors.first('password')}}</p>     
            </div>
            <div class="control">
            <button class="button is-link is-rounded is-fullwidth" @click="onLogin">Sign in</button>
            </div>
            <div class="field is-grouped is-grouped-right to-join">
              <nuxt-link to="/join">Create an account</nuxt-link>
            </div>
		</div>
	</div>
  </div>
</template>
<script>
import axios from '~/plugins/axios'

export default {
  name: 'join',
  head () {
    return {
      title: 'Fitness - sign in'
    }
  },
  data () {
    return {
      loginData: {
        login: '',
        password: ''
      }
    }
  },
  methods: {
    onLogin: function () {
      this.$validator.validateAll().then(v => {
        console.log(v, this.errors)
        if (v) {
          axios.post('/api/login', this.loginData).then(res => res.data).then(res => {
            if (!res.success) this.$toast.show(res.message || res.message.message, {theme: 'bubble', position: 'top-right'})
            else this.$router.push('/')
          })
        } else {
          for (let error of this.errors.items) {
            this.$toast.error(error.msg, {theme: 'bubble', position: 'top-right'})
          }
        }
      }).catch(e => console.log(e))
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  padding: 80px 20px;
}
.to-join {
  padding: 10px 0;
} 
</style>