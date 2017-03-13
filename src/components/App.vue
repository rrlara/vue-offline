<template>
  <div id="app">
    <h1>Hello: I'm offline</h1>

    <el-button type="primary" size="large" style="margin: auto; margin-top:10px;" @click="getLocation()">Get my location</el-button>

    <el-input placeholder="Write your commit" v-model="comment" type="textarea"
    :rows="2" class="comment"></el-input>

    <!-- <el-input placeholder="lat" v-model="latitude" type="number"
    ></el-input>
    <el-input placeholder="long" v-model="longitude" type="number"
    ></el-input> -->

    <div v-if="imageSrc == null">
      <el-button>
        <i class="el-icon-upload"></i>
        <input @change="previewThumbnail" class="Image-input__input"
        name="thumbnail" type="file"
        accept="image/*" capture="camera">
      </el-button>
    </div>
    <div v-else style="padding-top: 10px;">
      <img :src="imageSrc" width="100%"/>
    </div>

    <el-button type="primary" size="large" style="margin: auto; margin-top:10px;" @click="createMoment()"
    :disabled="!momentValidation">Submit</el-button>

    <p>
      <el-row v-if="posts">
      <el-col :span="12" v-for="(post, index) in posts" :key="index" style="padding: 5px;">
        <el-card :body-style="{ padding: '0px' }">
          <img v-if="post._attachments" :src="turnBlobToImage(post._attachments.image)" class="image" width="100%">
          <div style="padding: 14px;">
            <span>{{ post.comment }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ formatDate(post.timestamp) }}</time>
            </div>
            <span @click="deletePost(post._id)">DELETE</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </p>

  </div>
</template>

<script>

  import {Input, Button, Card, Row, Col} from 'element-ui'

  import store from '../store'

  import moment from 'moment'

  var reader = new FileReader()

  import toast from 'native-toast'

  // window.URL = window.URL || window.webkitURL;

  export default {
    name: 'app',
    data() {
      return {
        comment: null,
        latitude: null,
        longitude: null,
        imageSrc: null,
        resImage: null,
        posts: null,
        previewImage: null
      }
    },
    computed: {

      momentValidation: function () {

        if(this.latitude == null || this.latitude == null){
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
        };

        if(this.resImage){
          doc._attachments = {
              'image': {
                "content_type": 'image/jpg',
                "data": this.resImage
              }
            }
        }


        store.create(doc).then(results => {
          store.reloadPosts(this, 'posts')
          toast({message: `successfully saved`, type: 'success'})
          // toast({message: `Copied ${e.text}`, type: 'success'})
        })

        this.comment = null;
        this.latitude = null;
        this.longitude = null;
        this.imageSrc = null;
        this.resImage = null;

      },
      deletePost: function (id) {

        store.deletePostById(id).then(response => {
          store.reloadPosts(this, 'posts')
          toast({message: `deleted`, type: 'warning'})
        })

      },
      guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4();
        },
        turnBlobToImage: function (blob) {

          var data = {
            content_type: blob.content_type,
            data: blob.data
          }

          var binaryData = [];
          binaryData.push(data);

          var url = URL.createObjectURL(new Blob(binaryData, {type: "image/jpg"}))
          url = 'data:image/gif;base64,' + data.data
          // console.log(url);
          return url;


        },
        previewThumbnail: function (event) {
        var self = this;

        this.imageSrc = null

        console.log("event: ", event);

        var input = event.target

        if (input.files && input.files[0]) {

          self.imageSrc = input.files[0]

          input.files = null;

          console.log("self.imageSrc: ", self.imageSrc);

          reader.onload = function (e) {
            self.imageSrc = e.target.result
          }
          reader.onloadend = function () {
            setTimeout(function(){
              self.resizeImage(1000, 'image/jpeg', 1)
            }, 100);

          };
          reader.readAsDataURL(input.files[0])

        }
      },
      resizeImage: function (newWidth, imageType, imageArguments) {

        var vm = this;


        var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

              // Provide default values
              imageType = imageType || "image/jpeg";
              imageArguments = imageArguments || 0.7;



                  // Create a temporary image so that we can compute the height of the downscaled image.
                  image = new Image();
                  image.src = this.imageSrc;


                  // image.crossOrigin = 'Anonymous';
                  oldWidth = image.width;
                  oldHeight = image.height;
                  newHeight = Math.floor(oldHeight / oldWidth * newWidth)

                  // Create a temporary canvas to draw the downscaled image on.
                  canvas = document.createElement("canvas");
                  canvas.width = newWidth;
                  canvas.height = newHeight;
                  var ctx = canvas.getContext("2d");


                  // Draw the downscaled image on the canvas and return the new data URL.
                  ctx.drawImage(image, 0, 0, newWidth, newHeight);

                  newDataUrl = canvas.toDataURL(imageType, imageArguments);

                  // vm.resImage = new File([newDataUrl], "resize.jpg", {type: "image/jpg"})

                  var binary = atob(newDataUrl.split(',')[1]);
                  var array = [];
                  for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                  }
                  vm.resImage = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

                  console.log("vm.resImage: ", vm.resImage);


                  // vm.resImage = newDataUrl
      },
      getLocation: function () {

        var vm = this;
        // console.log('get location')
        function geo_success(position) {

          // console.log('success')

                        vm.latitude = position.coords.latitude
                        vm.longitude = position.coords.longitude

                    }

                    function geo_error() {

                      alert("didn't work offline")

                    }

                    var geo_options = {
                      enableHighAccuracy: true,
                      maximumAge        : 30000,
                      timeout           : 27000
                    };

          var wpid = navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
      }
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
  .el-textarea__inner{
    font-size: 16px !important;
  }
</style>

<style src="native-toast/dist/native-toast.css"></style>

<style scoped>
  #app {
    max-width: 700px;
    margin: 0 auto;
    padding: 10px;
  }
  el-input {
  font-size: 30px;
}
.comment{
  padding-bottom: 5px;
}
.comment textarea{
  font-size: 30px !important;
  padding-bottom: 5px;
}
.el-input{
  font-size: 30px !important;
  padding-bottom: 5px;
}
</style>

