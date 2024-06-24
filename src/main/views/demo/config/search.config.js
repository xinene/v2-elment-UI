export const searchConfig = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "姓名",
    },
    {
      field: "age",
      type: "input",
      label: "年龄",
    },
    {
      field: "phone",
      type: "input",
      label: "手机号",
    },
    {
      field: "sex",
      type: "select",
      label: "性别",
      options: [],
    },
    {
      startField: "startDate",
      endField: "endDate",
      type: "datePicker",
      label: "时间范围",
      itemProps: {
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        type: "daterange",
        format: "yyyy-MM-dd",
        valueFormat: "yyyy-MM-dd",
      },
    },
  ],
  // showToggle: true,
};
