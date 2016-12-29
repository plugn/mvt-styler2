<template>
  <div id="app">
    <editor :content="variable"></editor>
    <img src="./assets/logo.png">
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'
import editor from 'vue2-ace'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

export default {
  name: 'app',
  components: {
    Hello,
    editor
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
