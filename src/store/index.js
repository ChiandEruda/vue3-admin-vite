import { createStore } from 'vuex'
import menus from './modules/menus.js'

export default createStore({
	state: {
        token: ''
    },
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
			localStorage.setItem("token", token)
		}
	},
	actions: {},
	modules: {
		menus
	}
})