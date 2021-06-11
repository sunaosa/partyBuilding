  <template>
	<view>
		<u-card :title="`公告${index+1}`" :sub-title-color='item|setColor' :sub-title='item | getDate' head-border-bottom v-for="(item,index) in issue" :key = 'index'>
			<view class="body" slot="body">
				<u-icon name="close-circle"@click="handleDelete(item)" class="clear-icon" v-if="isAdmin==='y'"></u-icon>
				<u-input :value="item.announcement" type="textarea" :border="true" auto-height disabled/>
				<view class="issuer">
					{{`发布人：${item.issuer}`}}
				</view>
			</view>
		</u-card> 
		<u-toast ref="uToast" />
		<u-modal v-model="show" :content="content" show-cancel-button @confirm="confirmDelete" @cancel="cancelDelete"></u-modal>
		<u-loadmore :status="status" :load-text='loadText' @loadmore='loadMore'/>
	</view>
</template>

<script>
	export default {
		filters: {
			getDate(el) {
				let now = new Date().getTime();
				let timeDifference = parseInt((now - el.dateStamp)/86400000)
				if(timeDifference === 0){
					return '一天之内'
				} 
				 else if(timeDifference >= 30) {
					return el.createdAt
				} else {
					return timeDifference + '天前'
				}
			},
			setColor(el) {
				let now = new Date().getTime();
				let timeDifference = parseInt((now - el.dateStamp)/86400000)
				if(timeDifference === 0){
					return '#fa3534'
				}
				else if(timeDifference >= 30) {
					return ''
				} else {
					return '#ff9900'
				}
			}
		},
		computed:{
			status() {
				if(this.issue.length === 10) {
					return 'loadmore'
				} else {
					return 'nomore'
				}
			}
		},
		onLoad(options) {
			this.page = 1
			this.isAdmin = options.isAdmin
			this.getIssue()
		},
		data() {
			return {
				isAdmin: '',
				date: '',
				page: 1,
				item: {},
				issue: [],
				loadText: {
					loadmore: '点击获取全部历史公告',
					loading: '努力加载中',
					nomore: '已显示全部'
				},
				show: false,
				content: "确定要删除这条公告吗"
			}
		},
		methods: {
			async getIssue(){
				let {data} = await this.$myRequest({
					url: '/issue/select-all',
					data: {page:this.page},
					method: 'post'
				})
				this.issue = data
			}, 
			loadMore() {
				this.status = 'loading'
				this.page = 2
				this.getIssue()
				this.status = 'nomore'
			},
			handleDelete(item) {
				this.item = item
				this.show = true
			},
			cancelDelete() {
				this.show = false
			},
			async confirmDelete() {
				try {
					let {data} = await this.$myRequest({
						url: '/issue/delete',
						method: 'post',
						data: {id: this.item.id}
					})
					this.$refs.uToast.show({
						title: data,
						type: 'success'
					})
					this.getIssue()
				} catch(err) {
					console.log(err)
				}	
			}
		}
	}
</script>

<style>
page{
	background-color: #C0C0C0;
},
.body {
	margin-top: -50rpx;
}
.clear-icon {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
}
</style>
