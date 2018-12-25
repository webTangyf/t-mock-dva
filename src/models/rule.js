import api from '../api/index'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd';
const url = api.url

export default {
  namespace: 'rule',
  state: {
    list: [],
    mockDialog: {
      flag: false,
      data: '',
    },
    dialogInfo: {
      dialogFlag: false,
      dialogType: 'add', // add, update
      id: '',
      name: '',
      type: '',
      parentId: '',
      content: '',
      range: '',
      isInc: '',
      interfaceId: ''
    },
    page: {
      isDeepPage: false,
      ruleId: null,
      ruleHistory: []
    },
    projectInterface: {
      id: '',
      interfaceType: '',
      name: '',
      textDesc: ''
    }
  },
  subscriptions: {
  },
  effects: {
    *getlist({ payload }, {put, call}) {  // eslint-disable-line
      let params = {
        id: payload.id
      }
      // 保存当前item
      yield put({ type: 'saveInterface', payload })
      let ajax = api.get(url.rule.get, { params })
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'save', payload: data.retdata.returnlist })
      } else {
        message.error(data.retmsg)
      }
    },
    *add ({ payload }, {put, call, select}) {
      let ajax = api.post(url.rule.add, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        const rule = yield select(state => state.rule)
        yield put({ type: 'getlist', payload: rule.projectInterface })
        message.success('新增成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *update ({ payload }, {put, call, select}) {
      let ajax = api.post(url.rule.update, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        const rule = yield select(state => state.rule)
        yield put({ type: 'getlist', payload: rule.projectInterface })
        message.success('修改成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *del({ payload }, { put, call }) {
      let ajax = api.post(url.rule.del, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        message.success('删除成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *getMockData ({ payload }, { put, call, select }) {
      const rule = yield select(state => state.rule)
      let params = { id: rule.projectInterface.id }
      let ajax = api.get(url.appMock.get, {params})
      let { data } = yield call(ajax)
      data = JSON.stringify(data, null, 2)
      console.log(data)
      yield put({ type: 'openMockDialog', payload: { data } })
    }
  },
  reducers: {
    save (state, action) {
      state.list = [...action.payload]
      return { ...state }
    },
    saveInterface (state, { payload }) {
      state.projectInterface = {  ...payload }
      return { ...state }
    },
    updateDialog (state, { payload }) {
      state.dialogInfo = { ...state.dialogInfo, ...payload }
      return { ...state }
    },
    openMockDialog (state, { payload }) {
      state.mockDialog = { ...state.mockDialog, ...payload, flag: true }
      return { ...state }
    },
    closeMockDialog (state, { payload }) {
      state.mockDialog = { flag: false, data: '' }
      return { ...state }
    },
    goDeepPage (state, { payload }) {
      let { ruleId } = payload
      state.page.ruleHistory.push(ruleId)
      state.page.ruleId = ruleId
      state.page.isDeepPage = true
      return { ...state }
    },
    backPage (state, { payload }) {
      let page = state.page
      let history = page.ruleHistory
      console.log()
      // 回退
      history.pop()
      if (history.length > 0) {
        page.ruleId = history[history.length - 1]
        page.isDeepPage = true
      } else {
        page.ruleId = null
        page.isDeepPage = false
      }
      return { ...state }
    },
    clear (state, { payload }) {
      let emptyTemplate = {
        list: [],
        mockDialog: {
          flag: false,
          data: '',
        },
        dialogInfo: {
          dialogFlag: false,
          dialogType: 'add', // add, update
          id: '',
          name: '',
          type: '',
          parentId: '',
          content: '',
          range: '',
          isInc: '',
          interfaceId: ''
        },
        page: {
          isDeepPage: false,
          ruleId: null,
          ruleHistory: []
        },
        projectInterface: {
          id: '',
          interfaceType: '',
          name: '',
          textDesc: ''
        }
      }
      return { ...emptyTemplate }
    }
  },
};
