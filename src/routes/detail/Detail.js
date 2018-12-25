import React from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp'
import './Detail.scss'
import styles from './Detail.scss';
import { Breadcrumb } from 'antd';
// 自定义组件
import Left from '../../components/detail/left'
import Right from '../../components/detail/right'

const DetailPage = ({
			dispatch,
      history,
      location,
      projectInterface,
      rule
    }) => {
	let projectName = pathToRegexp('/detail/:id/:name').exec(location.pathname)[2]
	function bock () {
		history.go(-1)
	}
  let InterfaceHandle = {
    handleLeftDialog (payload) {
      dispatch({
        type: 'projectInterface/controlDialog',
        payload
      })
    },
    addInterface (params) {
      dispatch({
        type: 'projectInterface/add',
        payload: params
      })
    },
    updateInterface (params) {
      dispatch({
        type: 'projectInterface/update',
        payload: params
      })
    },
    delInterface (id) {
      dispatch({
        type: 'projectInterface/del',
        payload: {id}
      })
    },
    searchInterface (key) {
      dispatch({
        type: 'projectInterface/getlist',
        payload: { 'search': key}
      })
    },
    getRuleList (item) {
      dispatch({
        type: 'rule/getlist', payload: item
      })
    }
  }
  let ruleHandle = {
    updateDialog (params) {
      dispatch({
        type: 'rule/updateDialog',
        payload: {...params}
      })
    },
    addRule (params) {
      dispatch({
        type: 'rule/add',
        payload: {...params}
      })
    },
    updateRule (params) {
      dispatch({
        type: 'rule/update',
        payload: {...params}
      })
    },
    openMockDialog () {
      dispatch({
        type: 'rule/getMockData',
        payload: {}
      })
    },
    closeMockDialog () {
      dispatch({
        type: 'rule/closeMockDialog',
        payload: {}
      })
    },
    goDeepPage (ruleId) {
      dispatch({
        type: 'rule/goDeepPage',
        payload: { ruleId }
      })
    },
    backPage () {
      dispatch({
        type: 'rule/backPage',
        payload: {}
      })
    }
  }
  return (
    <section className={styles.detail + ' t-mock-page-card'}>
      <Breadcrumb>
      	<Breadcrumb.Item><a href="javascript:void(0)" onClick={() => bock()}>首页</a></Breadcrumb.Item>
      	<Breadcrumb.Item>{`${projectName}`}</Breadcrumb.Item>
      	<Breadcrumb.Item>{`接口管理`}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.detail__layout}>
      	<div className={styles.detail__left}>
      		<Left
            list={projectInterface.list}
            dialog={projectInterface.dialog}
            {...InterfaceHandle}
          />
      	</div>
      	<div className={styles.detail__right}>
          <Right
          rule={rule}
          ruleHandle={ruleHandle}/>
      	</div>
      </div>
    </section>
  );
}

DetailPage.propTypes = {
};

export default connect(d => d)(DetailPage);
