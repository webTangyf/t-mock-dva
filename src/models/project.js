import api from '../api/index'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd';
const url = api.url

export default {
  namespace: 'project',
  state: {
    list: [],
    dialogFlag: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen (location => {
        const match = pathToRegexp('/').exec(location.pathname)
        if (match) {
          dispatch({ type: 'getlist' })
        }
      })
    },
  },
  effects: {
    *getlist({ payload }, {put, call}) {  // eslint-disable-line
      let ajax = api.get(url.project.get)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'save', payload: data.retdata.returnlist })
      } else {
        message.error(data.retmsg)
      }
    },
    *add ({ payload }, {put, call}) {
      let ajax = api.post(url.project.add, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        yield put({ type: 'closeDialog' })
        message.success('新增成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *del({ payload }, { put, call }) {
      let ajax = api.post(url.project.del, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        message.success('删除成功')
      } else {
        message.error(data.retmsg)
      }
    }
  },
  reducers: {
    save (state, action) {
      state.list = [...action.payload]
      return { ...state }
    },
    openDialog (state, action) {
      state.dialogFlag = true
      return { ...state }
    },
    closeDialog (state, action) {
      state.dialogFlag = false
      state.projectName = ''
      return { ...state }
    },
  },
};
