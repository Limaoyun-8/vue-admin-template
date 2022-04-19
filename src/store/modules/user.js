import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  /*
    处理登录业务
  */
  async login({ commit }, userInfo) {
    // 结构出用户名及密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 注意：当前请求使用的Mock模拟数据，20000表示成功！
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'login: OK!'
    } else return Promise.reject(new Error('login: Fail!'))
  },

  /*
    获取用户信息
  */
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if (result.code === 20000) {
      const { data } = result
      /* eslint-disable */
      const { avatar, introduction, name, roles } = data
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      return 'getInfo: OK!'
    } else return Promise.reject(new Error('getInfo: Fail!'))
  },

  /*
    退出登录业务
  */
  async logout({ commit, state }) {
    const result = await logout(state.token)
    if (result.code === 20000) {
      // 必须优先移除token
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      return 'logout: OK!'
    } else return Promise.reject(new Error('logout: Fail!'))
  },

  // remove token
  resetToken({ commit }) {
    console.log('resetToken...')
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
