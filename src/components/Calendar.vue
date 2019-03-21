<template>
	<div class="content">
		<ul class="weeks">
			<li v-for="week in weeks" :key="week" :class="{weekend: isWeekend(week)}">{{week}}</li>
		</ul>
		<div class="months">
			<section v-for="(month, midx) in months" :key="[month.year,month.month].join('-')">
				<p class="month">{{month.year}}年{{month.month}}月</p>
				<ul class="month-days">
					<li :class="[day.belong != 1 ? 'gray': '', day.isWeekend ? 'weekend' : '', day.isToday ? 'today' : '', day.selectedClass]" 
					v-for="(day, idx) in month.days"
					:key="bindDayKeys(month.year, month.month, idx)"
					@click="dayClick(midx, day, idx)">
						<div class="tips" v-if="day.isStart">入住</div>
						<div class="tips" v-if="day.isEnd">离店</div>
						<em>{{cleanMode ? (day.belong==1 ? day.day : '') : day.day}}</em>
						<em class="price" v-if="day.price">{{cleanMode ? (day.belong==1 ? '￥'+ day.price : '') : '￥'+ day.price}}</em>
					</li>
				</ul>
			</section>
			<!-- <section>
				<p class="month">2019年4月</p>
				<ul class="month-days">
					<li class="gray"><em>31</em></li>
					<li class="sel start">
						<div class="tips">入驻</div>
						<em>1</em>
						<em class="price">￥256</em>
					</li>
					<li class="light">2</li>
					<li class="light">3</li>
					<li class="light">4</li>
					<li class="sel end">
						<div class="tips">离店</div>
						<em>5</em>
						<em class="price">￥256</em>
					</li>
					<li class="weekend">6</li>
					<li class="weekend">7</li>
					<li><em>8</em><em class="price">￥256</em></li>
					<li><em>9</em><em class="price">￥256</em></li>
					<li>10</li>
					<li>11</li>
					<li>12</li>
					<li class="weekend">13</li>
					<li class="weekend">14</li>
					<li>15</li>
					<li>16</li>
					<li>17</li>
					<li>18</li>
					<li>19</li>
					<li class="weekend">20</li>
					<li class="weekend">21</li>
					<li>22</li>
					<li>23</li>
					<li>24</li>
					<li>25</li>
					<li>26</li>
					<li class="weekend">27</li>
					<li class="weekend">28</li>
					<li>29</li>
					<li>30</li>
					<li class="gray">1</li>
					<li class="gray">2</li>
					<li class="gray">3</li>
					<li class="gray">4</li>
				</ul>
			</section> -->
			<p class="confirm-btn" @click="confirm">提交</p>
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: 'Calendar',
		props: ['options'],
		data() {
			return {
				weeks: [],
				firstDay: 0, //一周的开始日期 0周日,1周一
				months: [],
				selectType: 0, //0单选，1起始多选，2跳跃多选
				selectedData: [],
				cleanMode: true,	//是否在当月中拼接显示上月的末尾和下月开始的日期
				userData: {}
			}
		},
		methods: {
			bindDayKeys(year, month, idx) {
				return [year, month, idx].join('-')
			},
			isWeekend(week) {
				return ['六', '日'].indexOf(week) > -1
			},
			getCountDays(date) {
				var curDate = date || new Date;
				/* 获取当前月份 */
				var curMonth = curDate.getMonth();
				/*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
				curDate.setMonth(curMonth + 1);
				/* 将日期设置为0 */
				curDate.setDate(0);
				/* 返回当月的天数 */
				return curDate.getDate();
			},
			getDayOfMonthFirstDay(date) {
				var d = date || new Date()
				d.setDate(1);
				return d.getDay()
			},
			createMonthData(date) {
				let currentDate = date || new Date()
				const year = currentDate.getFullYear()
				const month = currentDate.getMonth() + 1
				let monthObj = {
					year: year,
					month: month,
					days: []
				}
				let lastMonthDays = this.getDayOfMonthFirstDay(currentDate)
				//这个月总共多少天
				let curMonthDays = this.getCountDays(currentDate);
				//上个月
				currentDate.setMonth(currentDate.getMonth() - 1);
				// 上个月最后一天
				let lastDay = this.getCountDays(currentDate)
				let days = []
				while (lastMonthDays > 0) {
					//补齐上月数据
					days.unshift({
						day: lastDay--,
						belong: 0,
						price: '',
						isWeekend: false,
						selected: false,
						isStart: false,
						isEnd: false,
						selectedClass: ''
					})
					lastMonthDays--;
				}
				let today = new Date;
				for (var i = 1; i <= curMonthDays; i++) {
					let week = new Date(year, month - 1, i).getDay()
					let isToday =(today.getFullYear() == year) && (today.getMonth() + 1 == month) && (today.getDate() == i)
					let dayObj = {
						day: i,
						belong: 1,
						price: '',
						isWeekend: week == 0 || week == 6,
						selected: false,
						isStart: false,
						isEnd: false,
						isToday: isToday,
						selectedClass: ''
					}
					//绑定用户数据
					let theUserData = this.getUserDataByDate(year, month, i)
					if (theUserData) {
						dayObj.price = theUserData.price
						dayObj.userData = theUserData
						// Object.assign(dayObj, theUserData)
					}
					days.push(dayObj)
				}
				if (days.length % 7 != 0) {
					//补齐下月数据
					let len = 7 - days.length % 7;
					for (i = 1; i <= len; i++) {
						days.push({
							day: i,
							belong: 2,
							price: '',
							isWeekend: false,
							selected: false,
							isStart: false,
							isEnd: false,
							selectedClass: ''
						})
					}
				}
				days[0].isWeekend = true;
				days[days.length - 1].isWeekend = true;
				monthObj.days = days;
				this.months.push(monthObj)
			},
			dayClick(monthIdx, day, dayIdx) {
				// 只有当月数据可点击
				if (day.belong != 1) return;
				let clearSelectData = () => {
					this.selectedData.forEach((item) => {
						this.months[item.monthIdx].days[item.dayIdx].selected = false;
						this.months[item.monthIdx].days[item.dayIdx].selectedClass = '';
						this.months[item.monthIdx].days[item.dayIdx].isStart = false;
						this.months[item.monthIdx].days[item.dayIdx].isEnd = false;
					})
					this.selectedData.splice(0)
				}
				let selectAsStartOrEnd = (type) => {
					day.selected = true
					type == 1 ? day.isStart = true : day.isEnd = true
					day.selectedClass = type == 1 ? 'sel start' : 'sel end'
					this.selectedData.push({
						monthIdx: monthIdx,
						dayIdx: dayIdx
					})
				}
				let selectAsSingle = () =>{
					day.selected = !day.selected;
					day.selectedClass = day.selected ? 'selected' : '';
					if (!day.selected) {
						let spliceIdx = 0
						this.selectedData.forEach((item, index)=>{
							if (item.monthIdx == monthIdx && item.dayIdx == dayIdx){
								spliceIdx = index
							}
						})
						this.selectedData.splice(spliceIdx,1)
					} else {
						this.selectedData.push({
							monthIdx: monthIdx,
							dayIdx: dayIdx
						})
					}
				}
				if (this.selectType == 1) {
					let selectedDataLen = this.selectedData.length
					if (selectedDataLen != 1) {
						if (selectedDataLen >= 2) {
							// 清空先前选择
							clearSelectData()
						}
						selectAsStartOrEnd(1)
					} else {
						var start = this.selectedData[0]
						if ((monthIdx == start.monthIdx && dayIdx > start.dayIdx) || monthIdx > start.monthIdx) {
							// 作为选中结束日期
							selectAsStartOrEnd()
							// 选中两者之间的日期
							for (let m = start.monthIdx; m <= monthIdx; m++) {
								let days = this.months[m].days
								let end = m == monthIdx ? dayIdx : (days.length - 1)
								let startDay = m == start.monthIdx ? start.dayIdx + 1 : 0;
								for (let j = startDay; j < end; j++) {
									if (days[j].belong == 1){
										days[j].selectedClass = 'light'
										days[j].selected = true;
										this.selectedData.push({
											monthIdx: m,
											dayIdx: j
										})
									}
								}
							}
						} else {
							clearSelectData()
							// 作为开始选中日期
							selectAsStartOrEnd(1)
						}
					}
				} else {
					// 单选
					if (this.selectType == 0) {
						// 清除之前选中的，选中或取消当前
						clearSelectData()
					}
					selectAsSingle()
				}
			},
			confirm() {
				let callbackData = []
				this.selectedData.forEach((item)=>{
					let month = this.months[item.monthIdx]
					let day = month.days[item.dayIdx]
					let date = [month.year,month.month,day.day].join('/')
					let obj = { date: date }
					if (day.userData) {
						Object.assign(obj, day.userData)
					}
					callbackData.push(obj)
				})
				callbackData.sort((a,b)=>{
					return new Date(a.date) - new Date(b.date) 
				})
				console.log(callbackData)
			},
			getUserDataByDate(year, month, day) {
				let key = [year, month].join('/')
				if (this.userData.hasOwnProperty(key)){
					return this.userData[key][day]
				}
				return null
			},
			initOptions() {
				this.weeks = this.firstDay == 1 ? ['一', '二', '三', '四', '五', '六', '日'] : ['日', '一', '二', '三', '四', '五', '六']
				if (this.options) {
					this.selectType = this.options.selectType || 0
					this.cleanMode = this.options.cleanMode || true
					if (this.options.data) {
						this.options.data.forEach((item)=>{
							let date = item.date
							let dateObj = new Date(date)
							let year = dateObj.getFullYear()
							let month = dateObj.getMonth() + 1
							let day = dateObj.getDate()
							let key = [year,month].join('/')
							if (!this.userData[key]) {
								this.userData[key] = {}
							}
							if (!this.userData[key][day]){
								this.userData[key][day] = {}
							}
							this.userData[key][day] = item
						})
					}
				}
				// console.log(this.userData)
				if (this.selectType == 1) {
					this.cleanMode = true;
				}
				for (let i=0;i<6;i++) {
					let date = new Date;
					date.setMonth(date.getMonth()+i)
					this.createMonthData(date)
				}
			}
		},
		created() {
			this.initOptions();
		}
	}
</script>

<style lang="less" scoped>
	@bgColor: #f0f0f0;
	@fontColor: #333;
	@highlightColor: #41a863;
	@grayColor: #aaa;
	@lightColor: #e0edd3;
	@toastColor: #000;

	body {
		font-size: .26rem;
		color: @fontColor;
	}

	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);

		.content {
			background: #fff;
			position: absolute;
			bottom: 0;
		}
	}

	.weeks {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 10;
		display: -webkit-flex;
		display: flex;
		text-align: center;
		background: @bgColor;
		color: @fontColor;

		li {
			-webkit-flex: 1;
			flex: 1;
			line-height: .8rem;

			&.weekend {
				color: @highlightColor;
			}
		}
	}

	.months {
		margin: 1rem 0 1.4rem;
	}

	.month {
		text-align: center;
		line-height: .6rem;
		font-weight: 600;
		margin-top: .2rem;
		font-size: .28rem;
	}

	.month-days {
		//解决空格留白问题
		font-size: 0;

		li {
			font-size: 0.26rem;
			display: inline-block;
			line-height: 1.2rem;
			width: 14.28%;
			text-align: center;
			position: relative;

			.price {
				position: absolute;
				line-height: .4rem;
				font-size: .22rem;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0.1rem;
				color: @grayColor;
			}

			&.weekend {
				color: @highlightColor;
			}

			&.gray {
				color: @grayColor;
			}

			&.sel {
				background: @highlightColor;
				color: white;

				.price {
					color: #fff;
				}

				&.start {
					border-top-left-radius: .1rem;
					border-bottom-left-radius: .1rem;
				}

				&.end {
					border-top-right-radius: .1rem;
					border-bottom-right-radius: .1rem;
				}
			}
			
			&.selected {
				background: @highlightColor;
				color: white;
				border-radius: .1rem;
				.price {
					color: #fff;
				}
			}

			&.light {
				background: @lightColor;
				&.today{
					border: none;
					border-radius: 0;
				}
			}
			box-sizing: border-box;
			&.today {
				border: 1px solid @highlightColor;
				border-radius: .1rem;
			}
		}
	}

	.tips {
		background: @toastColor;
		display: inline-block;
		color: white;
		padding: .1rem .2rem;
		line-height: .24rem;
		left: 0;
		transform: translateX(-50%);
		top: -.3rem;
		border-radius: .1rem;
		position: absolute;
		font-size: .2rem;

		&::after {
			content: '';
			position: absolute;
			width: 0;
			height: 0;
			// background: red;
			border-style: solid;
			border-color: @toastColor @toastColor transparent transparent;
			border-width: .1rem .15rem .1rem .15rem;
			bottom: -.14rem;
			left: 50%;
			transform: skewX(30deg)
		}
	}
	.confirm-btn {
		line-height: 1rem;
		background: @highlightColor;
		color: #fff;
		font-size: .32rem;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
