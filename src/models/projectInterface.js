import api from '../api/index'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd';
const url = api.url

export default {
  namespace: 'projectInterface',
  state: {
    id: '',
    list: [],
    dialog: {
      id: '',
      name: '',
      textDesc: '',
      interfaceType: '',
      flag: false,
      title: '新增接口',
      type: 'add',  // add, update
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen (location => {
        const match = pathToRegexp('/detail/:id/:name').exec(location.pathname)
        if (match && match[1]) {
          dispatch({ type: 'getlist', payload: {id: match[1]} })
        }
      })
    },
  },
  effects: {
    *getlist({ payload }, {put, call, select}) {  // eslint-disable-line
      const projectInterface = yield select(state => state.projectInterface)
      let params = {}
      params.id = payload.id || projectInterface.id
      if (!params.id) {
        message.error('项目id缺失, 请确认正确的项目id')
        return false
      }
      if (payload.search) {
        params.search = payload.search
      }
      let ajax = api.get(url.projectinterface.get, {params})
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        let returnlist = data.retdata.returnlist
        console.log(payload.id)
        yield put({ type: 'saveId', payload: { id: params.id } })
        yield put({ type: 'save', payload: returnlist })
        if (returnlist.length > 0) {
          yield put({ type: 'rule/getlist', payload: returnlist[0] })
        }
      } else {
        message.error(data.retmsg)
      }
    },
    *add ({ payload }, {put, call}) {
      let ajax = api.post(url.projectinterface.add, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        message.success('新增成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *update ({ payload }, {put, call}) {
      let ajax = api.post(url.projectinterface.update, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        message.success('修改成功')
      } else {
        message.error(data.retmsg)
      }
    },
    *del ({ payload }, {put, call}) {
      let ajax = api.post(url.projectinterface.del, payload)
      let { data } = yield call(ajax)
      if (data.retcode === '0000') {
        yield put({ type: 'getlist' })
        message.success('删除成功')
      } else {
        message.error(data.retmsg)
      }
    },
  },
  reducers: {
    save (state, action) {
      state.list = [...action.payload]
      return { ...state }
    },
    controlDialog (state, { payload }) {
      state.dialog = {...payload}
      return { ...state }
    },
    saveId (state, { payload }) {
      state.id = payload.id
      return { ...state }
    },
    clear () {
      let emptyTemplate = {
        id: '',
        list: [],
        dialog: {
          id: '',
          name: '',
          textDesc: '',
          interfaceType: '',
          flag: false,
          title: '新增接口',
          type: 'add',  // add, update
        }
      }
      return { ...emptyTemplate }
    }
  },
};
