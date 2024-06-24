<template>
  <el-card v-loading="loading">
    <!-- 查询 -->
    <BaseSearch
      ref="BaseSearch"
      v-bind.sync="searchConfig"
      :query-form.sync="queryForm"
      @getList="getList"
    >
      <el-button type="primary" @click="doAction('add')">新增</el-button>
    </BaseSearch>
    <!-- 表格 -->
    <BaseTable
      v-bind="tableConfig"
      :table-data="tableData"
      :total="total"
      :page.sync="page"
      @getList="getList"
    >
      <template #handler="{ row, index }">
        <div>
          <el-button type="text" @click="doAction('edit', row)">编辑</el-button>
          <el-button type="text" @click="doAction('view', row)">查看</el-button>
          <el-button type="text" @click="doAction('del', row, index)"
            >删除</el-button
          >
        </div>
      </template>
    </BaseTable>

    <!-- 弹窗 -->
    <BaseDialog
      width="600px"
      :title="title"
      :visible.sync="dialogVisible"
      :loading="dialogLoading"
      @click="doAction('confirm')"
    >
      <BaseForm
        ref="baseForm"
        v-bind.sync="dialogType === 'view' ? formConfigView : formConfig"
        :model.sync="form"
      >
      </BaseForm>
    </BaseDialog>
  </el-card>
</template>

<script>
import { tableConfig } from "./config/table.config";
import { searchConfig } from "./config/search.config";
import { formConfig, formConfigView } from "./config/form.config";
import { copyField } from "@/base-ui/utils";

// 接口返回的表格数据
const tableData = {
  code: 200,
  data: {
    total: 2,
    records: [
      {
        name: "张三",
        userNo: "U123456",
        age: "16",
        phone: "13822002211",
        sex: 1,
        address: "四川成都",
      },
      {
        name: "李四",
        userNo: "U123456",
        age: "18",
        phone: "18200000000",
        sex: 2,
        address: "",
      },
    ],
  },
};

// 模拟真实接口，返回数据
const getUser = (args) => {
  return new Promise((resolve, reject) => {
    if (args.currentPage === 1) {
      resolve(tableData);
    } else {
      reject("第二页没有数据");
    }
  });
};

export default {
  name: "demo",
  data() {
    const tb = {
      tableData: [],
      page: { currentPage: 1, pageSize: 10 },
      total: 0,
      loading: false,
      queryForm: {},
      searchConfig,
      tableConfig,
    };
    return {
      // 表格
      ...tb,
      // 表单配置
      formConfig,
      formConfigView,
      // 弹窗
      dialogVisible: false,
      dialogLoading: false,
      dialogType: "add",
      form: {},
      title: "",
      isAdd: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //  数据查询
    getList() {
      getUser(this.page)
        .then((res) => {
          this.tableData = res.data.records || [];
          this.total = Number(res.data.total || 0);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * @description: 页面操作
     * @param {*} type 操作类型
     * @param {*} data 数据
     */
    doAction(type, data, index) {
      this.dialogType = type;
      if (type === "add" || type === "edit" || type === "view") {
        this.form = type === "add" ? copyField(this.formConfig) : data;
        this.dialogVisible = true;
        this.isAdd = type === "add";
        this.title = { add: "新增", edit: "编辑", view: "查看" }[type];
      } else if (type === "del") {
        this.tableData.splice(index, 1);
      } else if (type === "confirm") {
        if (this.isAdd) {
          this.tableData.push(this.form);
        }
        this.dialogVisible = false;
      }
    },
  },
};
</script>
