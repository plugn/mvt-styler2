<template>
  <div id="app">

    <img src="./assets/logo.png">
    <!--<hello></hello>-->
    <Editor>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Editor from './components/Editor'

export default {
  name: 'app',
  components: {
    Hello,
    Editor
  },
  data(){
      return {
          msg:'{"id":"MVT1"}'
      }
  },

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: initial;
  /*color: #2c3e50;*/
  /*margin-top: 60px; */
}
</style>
