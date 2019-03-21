<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
		<Calendar :options="option"></Calendar>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Calendar from './components/Calendar.vue'

export default {
  name: 'app',
  components: {
    Calendar
  },
	data(){
		return {
			option:{
				selectType: 2,
				data: [{
					date: '2019/03/20',
					price: '123',
					id: 1
				},{
					date: '2019/03/21',
					price: '249',
					id: 2
				},{
					date: '2019/03/22',
					price: '349',
					id: 3
				},{
					date: '2019/04/21',
					price: '249',
					id: 4
				}]
			}
		}
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
