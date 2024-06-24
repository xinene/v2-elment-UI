<template>
  <el-pagination
    :page-sizes="pageSizes"
    :layout="layout"
    :current-page="page[isPageStart ? 'start' : 'currentPage']"
    :page-size="page[isPageStart ? 'limit' : 'pageSize']"
    :total="total"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "BasePagination",
  props: {
    // 分页
    total: {
      type: Number,
      default: 0,
    },
    page: {
      type: Object,
      default: () => ({ pageSize: 10, currentPage: 1 }),
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50, 100],
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes, jumper",
    },
  },
  computed: {
    // 如果page传入的是 start 和 limit
    isPageStart() {
      return Object.prototype.hasOwnProperty.call(this.page, "start");
    },
  },

  methods: {
    // pageSize 改变时会触发
    handleSizeChange(val) {
      const pageForm = { ...this.page, [this.isPageStart ? 'limit' : 'pageSize']: val };
      this.$emit("update:page", pageForm);
      this.$emit("getList", pageForm);
    },
    // current-change 改变时会触发
    handleCurrentChange(val) {
      const pageForm = { ...this.page,  [this.isPageStart ? 'start' : 'currentPage']: val };
      this.$emit("update:page", pageForm);
      this.$emit("getList", pageForm);
    },
  },
};
</script>
