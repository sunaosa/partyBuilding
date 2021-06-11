//#ifdef H5
const BASEURL = ''
//#endif

//#ifndef H5
const BASEURL = getApp().globalData.url
 //#endif
 
function previepdf(url) {
  uni.showLoading({
    title: '加载中'
  });
  uni.downloadFile({
    url: BASEURL + url,

    success(res) {
      let path = res.tempFilePath;
      uni.openDocument({
        filePath: path,
        fileType: "pdf",

        success() {
          uni.hideLoading(); 
        },

        fail() {
          uni.hideLoading();
        }

      });
    }

  });
}

module.exports = {
  previepdf
};