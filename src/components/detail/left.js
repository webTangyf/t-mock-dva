import React from 'react';
import './left.scss'
import styles from './left.scss';
import { Button, Modal, Input, Form, List, Avatar } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item
const DetailLeft = ({
  dialog,
  list,
  handleLeftDialog,
  addInterface,
  updateInterface,
  delInterface,
  searchInterface,
  getRuleList,
  form: {
    getFieldDecorator,
    isFieldTouched,
    getFieldError,
    validateFields,
    resetFields
  }}) => {
  function openAddDialog () {
    openDialog({ type: 'add', title: '新增接口'})
  }
  function openDialog (params) {
    let option = {
      id: '',
      name: '',
      textDesc: '',
      interfaceType: '',
      type: 'add',
      title: '新增接口',
      flag: true,
    }
    handleLeftDialog({...option, ...params})
  }
  function closeDialog () {
    handleLeftDialog({
      id: '',
      name: '',
      textDesc: '',
      interfaceType: '',
      type: 'add',
      title: '新增接口',
      flag: false,
    })
  }
  function onOk () {
    validateFields ((err, values) => {
      if (!err) {
        let { search, ...params} = values
        if (dialog.type === 'add') {
          addInterface(params)
        } else {
          let updateParams = {
            id: dialog.id,
            ...params
          }
          updateInterface(updateParams)
        }
        closeDialog()
      }
    })
  }
  function handleDel ({id, name}) {
    confirm({
      title: `确认删除${name}吗？`,
      content: '如果删除该接口，接口相关的规则也将会删除',
      onOk: () => delInterface(id)
    })
  }
  function handleEdit (item) {
    openDialog({ title: '修改接口', type: 'update', ...item })
  }
  function onCancel () {
    closeDialog()
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  let nameError = getFieldError('name')
  let textDescError = getFieldError('textDesc')
  let interfaceTypeError = getFieldError('interfaceType')
  return (
  	<div className={styles.detail__left}>
  		<div className={styles.detail__leftHead}>
        <Form layout="inline">
          <FormItem>
  			    <Button type="primary" icon="plus" onClick={() => openAddDialog()}>新增接口</Button>
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('search')(<Input.Search onSearch={value => searchInterface(value)} placeholder="请输入要搜索的内容" />)
            }
          </FormItem>
        </Form>
  		</div>
  		<div className={styles.detail__leftContent}>
  			<List
          locale={{emptyText: `暂无数据`}}
          bordered
          pagination={({
            pageSize: 10,
            simple: true
          })}
          size="default"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[
                <Button shape="circle" icon="right" type="primary" onClick={() => getRuleList(item)}></Button>,
                <Button shape="circle" icon="edit" onClick={() => handleEdit(item)}></Button>,
                <Button shape="circle" icon="delete" type="danger" onClick={() => handleDel(item)}></Button>
              ]}>
              <List.Item.Meta
              avatar={<Avatar size="large">{item.interfaceType}</Avatar>}
              description={item.textDesc}
              title={item.name}>
              </List.Item.Meta>
            </List.Item>
          )}
        />
  		</div>
      <Modal
        visible={dialog.flag}
        title={dialog.title}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
      >
        <Form>
          <FormItem
            label="接口名称"
            hasFeedback
            validateStatus={nameError ? 'error' : ''}
            help={nameError}
            {...formItemLayout}>
            {
              getFieldDecorator('name', {
                initialValue: dialog.name,
                rules: [
                  {
                    required: true,
                    message: '接口名称不能为空'
                  }
                ]
              })(<Input placeholder="请输入接口名称" />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="接口类型"
            hasFeedback
            validateStatus={interfaceTypeError ? 'error' : ''}
            help={interfaceTypeError}>
            {
              getFieldDecorator('interfaceType', {
                initialValue: dialog.interfaceType,
                rules: [
                  {
                    required: true,
                    message: '接口类型不能为空'
                  }
                ]
              })(<Input placeholder="请输入接口类型" />)
            }
          </FormItem>
          <FormItem
            label="接口叙述"
            hasFeedback
            validateStatus={textDescError ? 'error' : ''}
            help={textDescError}>
            {
              getFieldDecorator('textDesc', {
                initialValue: dialog.textDesc,
                rules: [
                  {
                    required: true,
                    message: '接口叙述不能为空'
                  }
                ]
              })(<Input.TextArea placeholder="请输入接口叙述" />)
            }
          </FormItem>
        </Form>
      </Modal>
  	</div>
  );
}

DetailLeft.propTypes = {
};

export default Form.create()(DetailLeft)
