<template>
  <div id="app">
    <h1>Hello: I'm offline</h1>

    <el-input placeholder="Write your commit" v-model="comment" type="textarea"
    :rows="2"></el-input>

    <el-input placeholder="lat" v-model="latitude" type="number"
    ></el-input>
    <el-input placeholder="long" v-model="longitude" type="number"
    ></el-input>

    <el-button type="primary" size="large" style="margin: auto; margin-top:10px;" @click="createMoment()" :disabled="!momentValidation">Submit</el-button>

     <!-- <div class="Image-input__input-wrapper">
        Choose
        <input @change="previewThumbnail" class="Image-input__input"
        name="thumbnail" type="file"
        accept="image/*" capture="camera">
      </div> -->

    <p>
      <el-row v-if="posts">
      <el-col :span="12" v-for="(post, index) in posts" :key="index" style="padding: 5px;">
        <el-card :body-style="{ padding: '0px' }">
          <!-- <img :src="turnBlobToImage(post._attachments.image.digest)" class="image"> -->
          <!-- <img :src="post._attachments.image.digest" class="image"> -->
          <div style="padding: 14px;">
            <span>{{ post.comment }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ formatDate(post.timestamp) }}</time>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </p>

  </div>
</template>

<script>
  import EmojiPanel from './EmojiPanel.vue'
  import Loading from './Loading.vue'

  import {Input, Button, Card, Row, Col} from 'element-ui'

  import store from '../store'

  import moment from 'moment'

  var reader = new FileReader()

  // window.URL = window.URL || window.webkitURL;

  export default {
    name: 'app',
    data() {
      return {
        comment: null,
        latitude: null,
        longitude: null,
        imageSrc: null,
        posts: null
      }
    },
    computed: {

      momentValidation: function () {

        if(this.comment == null || this.latitude == null || this.latitude == null){
          return false
        }else{
          return true
        }

      }

    },
    mounted() {

    },
    created () {
      store.reloadPosts(this, 'posts')
    },
    methods: {
      formatDate: function (date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');
      },
      createMoment: function () {

        var vm = this

        // create a document
        let doc = {
            "_id": this.guid(),
            'type': 'post',
            "comment": this.comment,
            "lat": parseFloat(this.latitude),
            "lng": parseFloat(this.longitude),
            "timestamp": new Date().toJSON(),
            // "_attachments": {
            //   'image': {
            //     "content_type": 'image/jpg',
            //     "data": this.imageSrc
            //   }
            // }

        };


        store.create(doc).then(results => {
          store.reloadPosts(this, 'posts')
        })

        this.comment = null;
        this.latitude = null;
        this.longitude = null;
        this.imageSrc = null;

      },
      guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },
        turnBlobToImage: function (blob) {

          // window.URL = window.URL || window.webkitURL

          var b = blob

              console.log(window);

              var url = window.URL.createObjectURL(b)
              console.log(url);
              // return url;


        },
        previewThumbnail: function (event) {
        var self = this;

        this.imageSrc = null

        var input = event.target

        // var reader = new FileReader;

        if (input.files && input.files[0]) {

          // console.log("input.files[0]: ", input.files[0]);

          // var url = URL.createObjectURL(input.files[0])
          //     console.log("createObjectURL: ", url);

          self.imageSrc = input.files[0]

          // reader.onload = function (e) {
            // self.imageSrc = e.target.result
            // imgComp.downscaleImage(e.target.result, 600, 'image/jpeg', 0.5)
            // this.resizeImage(e.target.result, 600, 'image/jpeg', 0.2)
          // }
          // reader.onloadend = function () {
          //   setTimeout(function(){
          //     self.resizeImage(640, 'image/jpeg', 0.7)

          //     var element = document.getElementById("msgContainer");
          //     element.scrollTop = 0;
          //   }, 500);

          // };
          reader.readAsDataURL(input.files[0])
        }
      },
    },
    components: {
      "el-input": Input,
      "el-button": Button,
      "el-card": Card,
      "el-row": Row,
      "el-col": Col
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
  input {
  font-size: 16px;
}
</style>

