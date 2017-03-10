<template>
  <div id="app">
    <h1>Hello: I'm offline</h1>

    <el-input placeholder="Write your commit" v-model="comment" type="textarea"
    :rows="2"></el-input>

    <el-input placeholder="lat" v-model="latitude" type="number"
    ></el-input>
    <el-input placeholder="long" v-model="longitude" type="number"
    ></el-input>

    <el-button type="primary" size="large" style="margin: auto;" @click="createMoment()" :disabled="!momentValidation">Submit</el-button>

  </div>
</template>

<script>
  import EmojiPanel from './EmojiPanel.vue'
  import Loading from './Loading.vue'

  import {Input, Button} from 'element-ui'

  var PouchDB = require('pouchdb');
  var localDB;
  let databaseName;

  export default {
    name: 'app',
    data() {
      return {
        comment: null,
        latitude: null,
        longitude: null
      }
    },
    computed: {

      momentValidation: function () {

        if(this.comment == null && this.latitude == null && this.latitude == null){
          return false
        }else{
          return true
        }

      }

    },
    mounted() {
        // create local PouchDB
        localDB = new PouchDB('localDB');

        databaseName = 'moments';

        window.PouchDB = PouchDB;

    },
    methods: {
      createMoment: function () {

        var vm = this

        // create a document
        let doc = {
            "_id": this.guid(),
            "comment": this.comment,
            "lat": parseFloat(this.latitude),
            "lng": parseFloat(this.longitude),
            "timestamp": new Date()
        };

        // add it to db
        localDB.put(doc)
        .then(function (response) {

          console.log("success: ", response);

          vm.comment = null;
          vm.latitude = null;
          vm.longitude = null;
          // handle response
        }).catch(function (err) {
          console.log(err);
        });

      },
      guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    },
    components: {
      "el-input": Input,
      "el-button": Button
    }
  }
</script>

<style>
  body {
    background-color: #f9f9f9;
    margin: 0;
    font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  }

  * {
    box-sizing: border-box;
  }
</style>

<style scoped>
  #app {
    max-width: 700px;
    margin: 0 auto;
  }
</style>

