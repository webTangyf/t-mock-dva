import React from 'react';
import { connect } from 'dva';
import './Home.scss'
import styles from './Home.scss';
import { Button, Modal, Input, Form } from 'antd';
const FormItem = Form.Item
const confirm = Modal.confirm

const HomePage = ({
    dispatch,
    history,
    project,
    form: {
      getFieldDecorator,
      isFieldTouched,
      getFieldError,
      validateFields,
      resetFields
    }
  }) => {
  function openDialog () {
    dispatch({
      type: 'project/openDialog'
    })
  }
  function closeDialog () {
    dispatch({
      type: 'project/closeDialog'
    })
    resetFields()
  }
  function addProject () {
    validateFields((err, values) => {
      if (!err) {
        resetFields()
        dispatch({
          type: 'project/add',
          payload: values
        })
      }
    })
  }
  function deleteProject ({id, name}) {
    confirm({
      title: `提示`,
      content: `确定删除${name}?`,
      onOk: () => dispatch({ type: 'project/del', payload: {id} })
    })
  }
  function goDetail({ id, name }) {
    dispatch({
      type: 'rule/clear'
    })
    dispatch({
      type: 'projectInterface/clear'
    })
    history.push(`/detail/${id}/${name}`)
  }
  const nameError = isFieldTouched('name') && getFieldError('name')
  let projectDom = project.list.map((item, index) => {
    return  <li className={"row " + styles.project__item} key={index + 1}>
              <span className={styles.project__itemIndex}>{index + 1}</span>
              <span className={styles.project__itemName}>{item.name}</span>
              <div className={styles.project__itemHandle + ' flex-1'}>
                <Button type="primary" shape="circle" icon="right" size="large" onClick={() => goDetail(item)}></Button>
                <Button type="danger" shape="circle" icon="delete" size="large" onClick={() => deleteProject(item)}></Button>
              </div>
            </li>
  })
  return (
    <section className={styles.home + ' t-mock-page-card'}>
    	<div className={styles.home__left + ' project'}>
        <div className={styles.home__leftTitle + ' row'}>
          <p>项目列表</p>
          <Button type="primary" icon="plus" onClick={() => openDialog()}>新增</Button>
        </div>
    		<ul>
          {projectDom}
    		</ul>
    	</div>
    	<div className={styles.home__right}></div>
      <Modal
        onCancel={() => closeDialog()}
        onOk={() => addProject()}
        visible={project.dialogFlag}>
        <div className={styles.modalWrap}>
          <Form>
            <FormItem
              label="项目名称"
              hasFeedback
              validateStatus={nameError ? 'error' : ''}
              help={nameError && '名称不能为空' }>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                },
              ]
            })(<Input className="flex-1" placeholder="请输入项目名称" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    </section>
  );
}

export default connect(({project}) => {
  return {project}
})(Form.create()(HomePage));
