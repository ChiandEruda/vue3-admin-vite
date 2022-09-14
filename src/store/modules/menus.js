import router from '@/router'
export default {
	state: {
        menuList: [],
        permitList: [],
        hasRoute: false,
		editableTabsValue: "Index",
		editableTabs: [
			{
				title: '首页',
				name: 'Index',
			}
		]
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
		},
		changeTab: (state, name) => {
			state.editableTabsValue = name
		},
		addTab: (state, tab) => {
			const newTabName = tab.name
			const index = state.editableTabs.findIndex(e => e.name === tab.name)
			if(index === -1) {
				state.editableTabs.push({
				  title: tab.title,
				  name: tab.name,
				})
			}
			state.editableTabsValue = newTabName
		},
		removeTab: (state, targetName) => {
			if(targetName === 'Index')return;

			const tabs = state.editableTabs
			let activeName = state.editableTabsValue
			if (activeName === targetName) {
			  tabs.forEach((tab, index) => {
				if (tab.name === targetName) {
				  const nextTab = tabs[index + 1] || tabs[index - 1]
				  if (nextTab) {
					activeName = nextTab.name
				  }
				}
			  })
			}
		  
			state.editableTabsValue = activeName
			state.editableTabs = tabs.filter((tab) => tab.name !== targetName)
			router.push({name: activeName})
		},		
		resetState: (state) => {
			// state.token = ''
			state.menuList = []
			state.permitList = []

			state.hasRoute = false
			state.editableTabsValue = 'Index' 
			state.editableTabs = [
				{
					title: '首页',
					name: 'Index',
				}
			]
		}
	}
}