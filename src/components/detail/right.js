import config from '../../utils/config.js'
import service from '../../utils/service.js'
import React from 'react';
import './right.scss'
import styles from './right.scss';
import { Button, Modal, Input, Form, Table, Select, Switch } from 'antd';
const TextArea = Input.TextArea
const FormItem = Form.Item
const Option = Select.Option
const DetailRight = ({
  rule,
  ruleHandle,
  form: {
    getFieldDecorator,
    isFieldTouched,
    getFieldError,
    validateFields,
    resetFields
  }}) => {
  // 页面的列表控制
  let pageInfo = rule.page
  console.log(pageInfo)
  let pageList = rule.list.filter (d => {
    if (pageInfo.isDeepPage) {
      return d.parentId == pageInfo.ruleId 
    }
    return !d.parentId
  })
  pageList = pageList.map(d => service.getRuleItem(d))
  // 弹出窗控制
  let dialogInfo = rule.dialogInfo
  let mockDialog = rule.mockDialog
  function openAddDialog () {
    ruleHandle.updateDialog({
      dialogFlag: true,
      dialogType: 'add', // add, update
      id: '',
      name: '',
      type: '',
      parentId: '',
      content: '',
      range: '',
      isInc: '',
      interfaceId: ''
    })
  }
  function openUpdateDialog (params) {
    delete params.rule
    ruleHandle.updateDialog({
      dialogFlag: true,
      dialogType: 'update', // add, update
      ...params
    })
  }
  function closeDialog () {
    ruleHandle.updateDialog({
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
    })
  }
  function onOk () {
    validateFields((err, values) => {
      if (err) {
        console.log(err)
        return false
      }
      values.interfaceId = rule.projectInterface.id
      values.isInc = Number(values.isInc)
      if (dialogInfo.dialogType === 'update') {
        values.id = dialogInfo.id
      }
      if (pageInfo.isDeepPage) {
        values.parentId = pageInfo.ruleId
      }
      ruleHandle[dialogInfo.dialogType === 'add' ? 'addRule' : 'updateRule'](values)
      resetFields()
      closeDialog()
      return false
    })
  }
  function onTypeChange (type) {
    ruleHandle.updateDialog({...dialogInfo ,type})
  }
  function closeMockDialog () {
    ruleHandle.closeMockDialog()
  }
  // table 配置
  let columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: 'mock代码',
      dataIndex: 'rule',
      key: 'rule',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (rowdata) => {
        // 当为引用对象时需要多出下一步来
        const deepArr = ['array', 'object']
        let deepBtn = deepArr.includes(rowdata.type) ? <Button shape="circle" icon="right" type="primary" onClick={() => ruleHandle.goDeepPage(rowdata.id)}></Button> : null
        return (
          <div>
            {deepBtn}
            <Button icon="edit" shape="circle" type="primary" onClick={() => openUpdateDialog(rowdata)} style={{marginLeft: '10px'}}></Button>
            <Button icon="delete" shape="circle" type="danger" style={{marginLeft: '10px'}}></Button>
          </div>
        )
      }
    }
  ]
  // form 配置
  return (
  	<div className={styles.detail__right}>
      <p className={styles.detail__rightTitle}>{'登录接口'}</p>
      <Form layout="inline">
        <FormItem>
          <Button shape="circle" onClick={() => ruleHandle.backPage()} icon="left" style={{display: pageInfo.isDeepPage ? 'block' : 'none', marginTop: '5px'}}></Button>
        </FormItem>
        <FormItem>
          <Button onClick={() => openAddDialog()}>新增规则</Button>
        </FormItem>
        <FormItem>
          <Button onClick={() => ruleHandle.openMockDialog()}>mock样例</Button>
        </FormItem>
        <FormItem>
          <Button shape="circle" icon="reload"></Button>
        </FormItem>
      </Form>
      <Table rowKey="id" pagination={false} dataSource={pageList} columns={columns} locale={{emptyText: '暂无数据'}}/>
      <Modal
        title={dialogInfo.dialogType === 'add' ? '新增规则' : '修改规则'}
        onOk={() => onOk()}
        onCancel={() => closeDialog()}
        visible={dialogInfo.dialogFlag}>
        <Form>
          <FormItem
            label="字段名">
            {
              getFieldDecorator('name', {
                initialValue: dialogInfo.name,
                rules: [
                  {
                    message: '参数类型不能为空'
                  }
                ]
              })(
                 <Input placeholder="请输入字段名称" />
              )
            }
          </FormItem>
          <FormItem
            label="参数类型">
            {
              getFieldDecorator('type', {
                initialValue: dialogInfo.type,
                rules: [
                  {
                    message: '参数类型不能为空'
                  }
                ]
              })(
                <Select placeholder="请选择mock类型" onChange={(value) => onTypeChange(value)}>
                  { config.typeList.map((d, i) => {
                    return <Option value={d} key={i}>{d}</Option>
                  }) }
                </Select>
              )
            }
          </FormItem>
          <FormItem
            label="参数范围"
            style={{display: config.rangeList.includes(dialogInfo.type)? 'block': 'none'}}>
            {
              // commonreg: /^(\d+(\,\d+)?)$/
              getFieldDecorator('range', {
                initialValue: dialogInfo.range,
                rules: dialogInfo.type === 'number' ? [{
                  pattern: /^(\d+(-\d+)?)(\.(\d+)|(\d+-\d+))?$|^(\s{0})$/,
                  message: '参数格式错误'
                }] : []
              })(
                <Input placeholder="请输入参数范围"/>
              )
            }
          </FormItem>
          <FormItem
            label="内容区域"
            style={{display: config.contentList.includes(dialogInfo.type)? 'block': 'none'}}>
            {
              getFieldDecorator('content', {
                initialValue: dialogInfo.content
              })(
                <Input placeholder="请输入参数范围"/>
              )
            }
          </FormItem>
          <Form.Item
            label="是否自增"
            style={{display: dialogInfo.type === 'number' ? 'block': 'none'}}>
            {getFieldDecorator('isInc', { initialValue: dialogInfo.isInc === '1' })(
              <Switch />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="mock数据样例"
        okText=""
        onCancel={() => closeMockDialog()}
        visible={mockDialog.flag}>
        <TextArea autosize={true} value={mockDialog.data}>
        </TextArea>
      </Modal>
  	</div>
  );
}

DetailRight.propTypes = {
};

export default Form.create()(DetailRight)
