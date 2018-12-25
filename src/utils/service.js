/*
* 解析对应参数成为代码
* id          对应id
* name        字段名
* type        类型
* parentId    父id
* content     内容
* range       范围// 数量范围 默认：a,b 数字：a-b.c-d
* isInc       数字类型下 是否自增
* interfaceId 对应的接口id
*/
// range:范围统一为 a,b
function getRuleItem(item) {
  // 当为字符串类型
  if (item.type === 'string') {
    // 单一字符串重复
    if (item.content && item.range) {
      item.rule = `${item.name}|${item.range.split(',').join('-')}:'${item.content}'`
      // 随机字符串范围
    } else if (!item.content) {
      item.rule = `${item.name}:'@string(${item.range})'`
    }
  }
  // 布尔解析
  if (item.type === 'number') {
    // content参数只在自增的情况下 作为开始数字试用 其他情况并无它用
    if (item.content && item.isInc) {
      item.rule = `${item.name}|+1:${item.content}`
    } else if (item.range) {
      item.rule = `${item.name}|${item.range}: 1`
    }
  }
  // 布尔解析
  if (item.type === 'boolean') {
    if (item.content) {
      item.rule = `${item.name}|${item.content === 'true' ? '1' : '2'}: true`
    } else {
      item.rule = `${item.name}|1-2: true`
    }
  }
  // 数组解析
  if (item.type === 'array') {
    item.rule = `${item.name}|${item.range.split(',').join('-')}: ${'具体请点击查看详情'}`
  }
  // 对象解析
  if (item.type === 'object') {
    if (item.range) {
      item.rule = `${item.name}|${item.range.split(',').join('-')}: ${'具体请点击查看详情'}`
    } else {
      item.rule = `${item.name}: ${'具体请点击查看详情'}`
    }
  }
  // 需要范围的普通类型通用
  let rangeArr = ['date', 'time', 'datetime', 'now']
  if (rangeArr.includes(item.type)) {
    item.rule = `${item.name}: '@${item.type}("${item.range}")'`
  }
  // 不需要范围的普通类型通用
  let defaultArr = ['color', 'hex', 'rgb', 'rgba', 'hsl', 'first', 'cfirst', 'last', 'clast', 'name', 'cname', 'url', 'domain', 'email', 'ip']
  if (defaultArr.includes(item.type)) {
    item.rule = `${item.name}: '@${item.type}()'`
  }
  if (item.type === 'address') {
   item.rule = `${item.name}: '@province() @city()'` 
  }
  if (item.type === 'normal') {
    item.rule = item.content
  }
  return item
}

export default {
  getRuleItem
}
