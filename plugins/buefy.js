import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
if (process.BROWSER_BUILD) Vue.use(Buefy)
