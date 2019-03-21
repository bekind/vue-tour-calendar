<template>
  <div id="app">
		<Calendar :options="option" :render-data="renderData" @calendar_confirm="confirm"></Calendar>
  </div>
</template>

<script>
	/* eslint-disable */
import Calendar from './components/Calendar.vue'

export default {
  name: 'app',
  components: {
    Calendar
  },
	data(){
		return {
			option:{
				selectType: 1
			},
			renderData: [{
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
	},
	methods: {
		confirm(data){
			console.log(data)
		}
	},
	created(){
// 		setTimeout(()=>{
// 			this.renderData = [{
// 				date: '2019/03/20',
// 				price: '123',
// 				id: 1
// 			},{
// 				date: '2019/03/21',
// 				price: '249',
// 				id: 2
// 			},{
// 				date: '2019/03/22',
// 				price: '349',
// 				id: 3
// 			},{
// 				date: '2019/04/21',
// 				price: '249',
// 				id: 4
// 			}]
// 		},2000)
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
