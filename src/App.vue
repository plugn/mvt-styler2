<template>
  <div id="app">

    <img src="./assets/logo.png">
    <!--<hello></hello>-->
    <Panes />
    <List />

    <Editor />
  </div>
</template>

<script>
import Hello from './components/Hello'
import List from './components/List'
import Editor from './components/Editor'
import Panes from './components/Panes'

export default {
  name: 'app',
  components: {
    Hello,
    List,
    Panes,
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
