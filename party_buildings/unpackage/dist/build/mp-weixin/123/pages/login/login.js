require('../../common/runtime.js');require('../../common/vendor.js');require('../../common/main.js');(global["webpackJsonp_123"]=global["webpackJsonp_123"]||[]).push([["pages/login/login"],{"05ad":function(t,e,n){"use strict";n.r(e);var a=n("eb70"),r=n("24f9");for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);n("adb0");var i,u=n("f0c5"),s=Object(u["a"])(r["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],i);e["default"]=s.exports},"24f9":function(t,e,n){"use strict";n.r(e);var a=n("fdba"),r=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=r.a},"4f68":function(t,e,n){"use strict";(function(t){n("e2f0");a(n("66fd"));var e=a(n("05ad"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},adb0:function(t,e,n){"use strict";var a=n("e5cf"),r=n.n(a);r.a},e5cf:function(t,e,n){},eb70:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}));var a={uToast:function(){return n.e("uview-ui/components/u-toast/u-toast").then(n.bind(null,"1ea0"))}},r=function(){var t=this,e=t.$createElement;t._self._c},o=[]},fdba:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=r(n("a34a"));function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e,n,a,r,o,i){try{var u=t[o](i),s=u.value}catch(c){return void n(c)}u.done?e(s):Promise.resolve(s).then(a,r)}function i(t){return function(){var e=this,n=arguments;return new Promise((function(a,r){var i=t.apply(e,n);function u(t){o(i,a,r,u,s,"next",t)}function s(t){o(i,a,r,u,s,"throw",t)}u(void 0)}))}}var u={onLoad:function(){t.hideHomeButton()},data:function(){return{users:{username:"",password:"",valicateCode:""},hideOrNo:"",type_password:"password",type_text:"text",ifHide:!0,imgCode:"http://127.0.0.1:3000/users/images"}},methods:{hidePassward:function(){this.ifHide=!this.ifHide},login:function(){var e=this;return i(a.default.mark((function n(){var r;return a.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(""!==e.users.username){n.next=4;break}t.showToast({title:"请输入账号",image:"/static/error.png"}),n.next=12;break;case 4:if(""!==e.users.password){n.next=8;break}t.showToast({title:"请输入密码",image:"/static/error.png"}),n.next=12;break;case 8:return n.next=10,e.$myRequest({url:"/users/login",method:"post",data:e.users});case 10:r=n.sent,"密码错误"===r.data?t.showModal({title:"密码错误",content:"密码错误请重新确认后登录",showCancel:!1}):"账号不存在"===r.data?t.showModal({title:"账号不存在",content:"请确定账号重新登陆",showCancel:!1}):"验证码错误"===r.data?e.$refs.uToast.show({title:"验证码错误区分大小写",type:"error"}):(t.setStorageSync("idVerification",r.data),t.switchTab({url:"../index/index"}));case 12:case"end":return n.stop()}}),n)})))()},register:function(){t.navigateTo({url:"../register/register"})},changeImgCode:function(){this.imgCode="http://127.0.0.1:3000/users/images?"+Math.ceil(10*Math.random())}}};e.default=u}).call(this,n("543d")["default"])}},[["4f68","common/runtime","common/vendor"]]]);