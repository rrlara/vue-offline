import Vue from 'vue'
import App from 'src/components/App'

var PouchDB = require('pouchdb');
var localDB;
let databaseName;

if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}

new Vue({
  el: '#app',
  render: h => h(App)
})
