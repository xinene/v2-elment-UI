// 引入组件
import { BASECONFIG } from "./utils";
export const importComponents = (files) => {
  const path = require("path");
  const modules = {};
  files.keys().forEach((key) => {
    let name = path.basename(key, ".vue");
    if (name === "index") {
      // 如果是index.vue就用路径名标注
      name = path.dirname(key, ".vue");
    }
    modules[name] = files(key).default || files(key);
  });
  return modules;
};

const files = require.context("@/base-ui", true, /\.vue$/);
const modules = importComponents(files);

const install = (Vue,opts) => {
  // 组件全局配置
  Vue.prototype.$BASECONFIG = {...BASECONFIG,...opts};

  Object.keys(modules).map((component) => {
    modules[component].name &&
      Vue.component(modules[component].name, modules[component]);
  });
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default { install };
