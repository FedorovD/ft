<template>
  <div class="register-wrapper" @keyup.enter="onRegister">
    <div class="columns is-centered">
		  <div class="column is-4">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" type="text" v-model="registerData.username" name="username" placeholder="Pick a username" v-validate="{required: true}" :class="errors.has('username') && 'is-danger' || '' " autofocus>
          </div>
          <p class="help is-danger" v-show="errors.has('username')">{{errors.first('username')}}</p>          
        </div>
         <!-- <b-field label="Username" :type="errors.has('username') && 'is-danger' || '' " :message="errors.has('username') && errors.first('username') || ''">
          <b-input type="text" name="username" v-model="registerData.username" placeholder="Pick a username" v-validate="{required: true}" autofocus></b-input>
        </b-field> -->
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" name="email"  v-model="registerData.email" placeholder="you@example.com" v-validate="'required|email'" :class="errors.has('email') && 'is-danger' || '' ">
          </div>
          <p class="help is-danger" v-show="errors.has('email')">{{errors.first('email')}}</p>
        </div>
        <!-- <b-field label="Email" :type="errors.has('email') && 'is-danger' || '' " :message="errors.has('email') && errors.first('email') || ''">
          <b-input type="email" name="email" v-model="registerData.email" placeholder="you@example.com" v-validate="'required|email'"></b-input>
        </b-field> -->
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" name="password"  v-model="registerData.password" placeholder="Create a password" v-validate="{required: true, regex: /([0-9a-z]).{5,20}/i}" :class="errors.has('password') && 'is-danger' || '' ">
          </div>
          <p class="help is-danger" v-show="errors.has('password')">{{errors.first('password')}}</p>          
        </div>
        <!-- <b-field label="Password" :type="errors.has('password') && 'is-danger' || '' " :message="errors.has('email') && errors.first('password') || ''">
          <b-input type="password" name="password" v-model="registerData.password" placeholder="Create a password" v-validate="{required: true}" password-reveal></b-input>
        </b-field> -->
        <div class="control">
          <button class="button is-link is-rounded is-fullwidth" @click="onRegister" type="submit">Submit</button>
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
      title: 'Fitness - sign up'
    }
  },
  data () {
    return {
      registerData: {
        email: '',
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onRegister: function () {
      this.$validator.validateAll().then(v => {
        if (v) {
          //  validate: true
          axios.post('/api/register', this.registerData).then(res => res.data).then(res => {
            if (res.success) {
              for (let data in this.registerData) this.registerData[data] = ''
              this.$validator.reset()
              this.$toast.success(res.message, {theme: 'bubble', position: 'top-right'})
              this.$router.push('/login')
            } else {
              this.$toast.show(res.message, {theme: 'bubble', position: 'top-right'})
            }
            // this.$router.push('/')
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
.register-wrapper {
  padding: 80px 20px;
}
</style>