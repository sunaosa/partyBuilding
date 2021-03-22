import Vue from 'vue'
import Vuex from 'vuex'
import list from './common.js'
Vue.use(Vuex);

const store = new Vuex.Store({
	
 state : {
	list
 },
 getters: {
 	tabBerList: state => state.list,
 } 
});
export default store;
