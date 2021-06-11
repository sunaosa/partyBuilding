### easy-upload 组件

使用方法
```js
	<easy-upload
		:dataList="dataList" 
		uploadUrl="http://192.168.137.1:3000/upload" 
		deleteUrl='http://192.168.137.1:3000/upload' 
		:types="types" 
		@successImage="successImage" 
		@successVideo="successvideo"
	/>

	//使用 hbuilderX (easycom) 可以直接使用 或
	import easyUpload from '@/components/easy-upload/easy-upload.vue'
	export default {
		//用easycom 则省略注册组件
		components:{
			easyUpload
		},
		data() {
			return {
				dataList: [],
				types: 'image'
			}
		}
	}	
```

|  参数   | 类型  | 是否必填 | 参数描述
|  ----  | ----  | ---- | ----
| types  | String | 否 | 上传类型 image/video
| autoUpload  | Boolean | 否 | 自动上传 默认false
| dataList  | Array | 否 | 图片/视频数据展示
| clearIcon  | String | 否 | 删除图标(可以换成自己的图片)
| uploadIcon  | String | 否 | 上传图标(可以换成自己的图片)
| uploadUrl  | String | 否 | 上传的接口
| deleteUrl  | String | 否 | 删除的接口
| uploadCount  | Number | 否 | 上传图片最大个数(默认为一张)
| upload_max  | Number | 否 | 上传大小(默认为3M)
| upload_max  | Number | 否 | 上传大小(默认为3M)
| upload_max  | Number | 否 | 上传大小(默认为3M)

|  事件  | 是否必填 | 参数描述
|  ---- | ---- | ----
| successImage  | 否 | 上传图片成功事件
| successVideo  |  否 | 上传视频成功回调

示例项目中有简单的服务端代码 /server (node.js)
如果本地测试可以先运行一下服务端的代码 

