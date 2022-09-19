import store from './store'

export default function () {

    function hasAuth(perm){
        let authority = store.state.menus.permitList
        console.log(authority)
        return authority.indexOf(perm) > -1
    }

    return{
        hasAuth
    }
}
