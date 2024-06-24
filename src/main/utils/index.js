// 引入组件
export const importComponents = (files) => {
  const path = require("path");
  const modules = {};
  files.keys().forEach((key) => {
    const name = path.basename(key, ".vue");
    modules[name] = files(key).default || files(key);
  });
  return modules;
};

