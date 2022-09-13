export default {
	state: {
        menuList: [],
        permitList: [],
        hasRoute: false
    },
	mutations: {
		setMenuList: (state, menuList) => {
			state.menuList = menuList
		},
		setPermitList: (state, permitList) => {
			state.permitList = permitList
		},
        setRoute: (state, hasRoute) => {
			state.hasRoute = hasRoute
			// sessionStorage.setItem('hasRoute', hasRoute)
		}
	}
}