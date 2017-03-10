<template>
  <div id="app">
    <h1>Hello: I'm offline</h1>

    <el-input placeholder="Write your commit" v-model="comment" type="textarea"
    :rows="2"></el-input>

    <el-input placeholder="lat" v-model="latitude" type="number"
    ></el-input>
    <el-input placeholder="long" v-model="longitude" type="number"
    ></el-input>

    <el-button type="primary" size="large" style="margin: auto;">Submit</el-button>



    <!-- <emoji-panel v-if="source" :source="source"></emoji-panel> -->
    <!-- <loading v-else></loading> -->
  </div>
</template>

<script>
  import EmojiPanel from './EmojiPanel.vue'
  import Loading from './Loading.vue'

  import {Input, Button} from 'element-ui'

  export default {
    name: 'app',
    data() {
      return {
        comment: null,
        latitude: null,
        longitude: null
      }
    },
    // async created() {
    //   const emojilib = await import('emojilib')
    //   this.source = Object.keys(emojilib.lib).map(name => ({
    //     name,
    //     ...emojilib.lib[name]
    //   }))
    // },
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

