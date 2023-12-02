import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const actions = {
    saveUserInfo(context, value) {
        sessionStorage.setItem('userInfo', JSON.stringify(value))
        context.commit('SAVE_USER_INFO', value)
    }
}

const mutations = {
    SAVE_USER_INFO(state, value) {
        state.userInfo = value
    }
}

const state = {
    userInfo: {}
}

const getters = {
    getUserId(state) {
        if (!state.userInfo.uId) {
            state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        }
        // console.log(123, state.userInfo);
        // console.log(JSON);
        return state.userInfo.uId
    },
    getUserPhoto(state) {
        if (!state.userInfo.uId) {
            state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        }
        return state.userInfo.userImage
    },
    getUsername(state) {
        if (!state.userInfo.uId) {
            state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        }
        return state.userInfo.userName
    }

}

export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})