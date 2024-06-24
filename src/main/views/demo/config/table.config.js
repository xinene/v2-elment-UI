export const tableConfig = {
  propList: [
    { type: "selection", width: "60" },
    { prop: "name", prop2: "userNo", label: "姓名/工号" },
    { prop: "age", label: "年龄" },
    { prop: "phone", label: "手机" },
    {
      prop: "sex",
      label: "性别",
      options: [
        { value: 1, label: "男" },
        { value: 2, label: "女" },
      ],
      // 数组或者对象，然后会根据value值自动去匹配
      // options: {
      //   1: "男",
      //   2: "女",
      // },
    },
    { prop: "address", label: "地址", slotName: "address" },
    { label: "操作", width: "220", slotName: "handler", fixed: "right" },
  ],
};
