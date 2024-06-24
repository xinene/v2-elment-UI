// 初始化查询条件
export const copyField = (formConfigOrFormItems) => {
  if (!formConfigOrFormItems) {
    return {};
  }
  const formItems = Array.isArray(formConfigOrFormItems) ? formConfigOrFormItems : formConfigOrFormItems?.formItems ?? [];
  return formItems.reduce((obj, item) => {
    item.field && (obj[item.field] = "");
    return obj;
  }, {});
};

// 重置属性为空
export const reset = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = Array.isArray(value) ? [] : "";
    }
  }
};

// 组件全局基础配置
export const BASECONFIG = {
  // 查询默认length
  searchMaxlength: 50,
  // 表单默认length
  formMaxlength: 50,
  // 表单文本框默认length
  textareaMaxlength: 200,
  // 数据为空时默认占位符号
  emptyStr: "-",
  // table props 配置
  tableProps: { border: true },
  // 查询form的props
  searchProps: { inline: true, labelPosition: "right", labelWidth: "120px" },
  // 查询组件默认样式
  searchStyle: { width: "100%" },
  // 表单组件默认样式
  formStyle: { width: "400px", labelWidth: "120px" },
  // 分页默认样式
  pageStyle: { justifyContent: "flex-end" },
  // 默认字体大小
  defaultFontSize: "",
};
