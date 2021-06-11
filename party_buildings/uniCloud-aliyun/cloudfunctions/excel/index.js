const xlsx = require('node-xlsx');
exports.main = async(event, context) => {
	try {
		let userdata = event.userdata
		console.log(event.name)
		let activityName = event.name + "打卡情况"
		let dataCVS = 'test.xlsx'
		let alldata = []
		let row = ['姓名', '学号', '是否打卡']
		alldata.push(row) 
		
		for(let key in userdata) {
			let arr = [];
			arr.push(userdata[key].name)
			arr.push(userdata[key].studentNumber)
			arr.push(userdata[key].ifClock)
			alldata.push(arr)
		}
		var buffer = await xlsx.build([{
			name: activityName,
			data: alldata
		}])
		return await uniCloud.uploadFile({
		    cloudPath: dataCVS,
		    fileContent: buffer
		})
	}catch (err) {
		console.log(err)
	}
}