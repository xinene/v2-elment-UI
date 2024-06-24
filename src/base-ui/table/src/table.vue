<!--
 * @Author: huaxu huaxu@dgg.net
 * @Date: 2024-04-16 10:42:09
 * @LastEditors: huaxu huaxu@dgg.net
 * @LastEditTime: 2024-06-24 14:27:36
 * @FilePath: /v2-elment-UI/src/base-ui/table/src/table.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="base-table">
    <div>
      <slot name="header"></slot>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      v-bind="{ ...$BASECONFIG.tableProps, ...$attrs, ...tableProps }"
      v-on="$listeners"
    >
      <el-table-column
        v-if="showSelect || showSelectColumn"
        align="center"
        type="selection"
        width="60"
      />
      <el-table-column
        v-if="showIndex || showIndexColumn"
        type="index"
        label="序号"
        align="center"
        width="60"
      />
      <template v-for="(propItem, index) in propList">
        <el-table-column
          v-if="!propItem.isHidden"
          :key="propItem.key || index"
          v-bind="
            ['selection', 'index'].includes(propItem.type)
              ? { ...defaultStyle, ...propItem }
              : { showOverflowTooltip, ...propItem }
          "
        >
          <template
            v-if="!['selection', 'index'].includes(propItem.type)"
            #default="scope"
          >
            <!-- 如果需要筛选，有options就去匹配 -->
            <slot
              v-if="propItem.options"
              :name="propItem.slotName"
              :scope="scope"
              :row="scope.row"
              :index="scope.$index"
              :item="propItem"
            >
              {{ filterOptions(scope, propItem) }}
            </slot>
            <!-- 如果有两个值展示（name/no），有prop2就展示 -->
            <slot
              v-else-if="propItem.prop2"
              :name="propItem.slotName"
              :scope="scope"
              :row="scope.row"
              :index="scope.$index"
              :item="propItem"
            >
              {{ twoProp(scope, propItem) }}
            </slot>
            <!-- 链接跳转 -->
            <slot
              v-else-if="propItem.isLink"
              :name="propItem.slotName"
              :scope="scope"
              :row="scope.row"
              :index="scope.$index"
              :item="propItem"
            >
              <span
                :style="{
                  color: '#4974f5',
                  cursor: 'pointer',
                  ...propItem.style,
                }"
                @click="propItem.click && propItem.click(scope)"
                v-on="propItem.events"
                >{{ defaultText(scope, propItem) }}</span
              >
            </slot>
            <!-- 默认 -->
            <slot
              v-else
              :name="propItem.slotName"
              :scope="scope"
              :row="scope.row"
              :index="scope.$index"
              :item="propItem"
            >
              {{ defaultText(scope, propItem) }}
            </slot>
          </template>
          <template v-if="propItem.slotHeaderName" #header="scope">
            <slot
              :name="propItem.slotHeaderName"
              :scope="scope"
              :row="scope.row"
              :index="scope.$index"
              :item="propItem"
            >
              {{
                typeof propItem.label === "number"
                  ? propItem.label
                  : propItem.label || $BASECONFIG.emptyStr
              }}
            </slot>
          </template>
        </el-table-column>
      </template>
      <!-- <template #empty>
        <slot name="empty">
          <div style="padding: 20px 0; line-height: 20px">
            <img-empty
              v-if="
                !$BASECONFIG.tableProps.hideEmptyIcon &&
                !tableProps.hideEmptyIcon
              "
            />
            <div style="line-height: 18px">
              {{
                $BASECONFIG.tableProps.emptyText ||
                tableProps.emptyText ||
                "无数据"
              }}
            </div>
          </div>
        </slot>
      </template> -->
    </el-table>
    <div
      v-if="showPage && total > 0"
      :style="{
        ...defaultPageStyle,
        ...$BASECONFIG.pageStyle,
        ...pagePosition,
        ...pageStyle,
      }"
    >
      <slot name="page">
        <el-pagination
          :page-sizes="pageSizes"
          :layout="layout"
          :current-page="page[isPageStart ? 'start' : 'currentPage']"
          :page-size="page[isPageStart ? 'limit' : 'pageSize']"
          :total="total"
          v-bind="pageProps"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script>
// import ImgEmpty from "./img-empty.vue";
export default {
  name: "BaseTable",
  components: {
    // ImgEmpty,
  },
  inheritAttrs: false,
  props: {
    // table配置
    propList: {
      type: Array,
      required: true,
    },
    // table数据
    tableData: {
      type: Array,
      required: true,
    },
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    pageProps: {
      type: Object,
      default: () => ({}),
    },
    showPage: {
      type: Boolean,
      default: true,
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    showHeader: Boolean,
    showSelect: Boolean,
    showSelectColumn: Boolean,
    showIndex: Boolean,
    showIndexColumn: Boolean,
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
    pageStyle: {
      type: Object,
      default: () => ({}),
    },
    pageLeft: {
      type: Boolean,
      default: false,
    },
    pageRight: {
      type: Boolean,
      default: false,
    },
    defaultPageStyle: {
      type: Object,
      default: () => ({
        margin: "12px 0",
        display: "flex",
        justifyContent: "center", // start左 end右
      }),
    },
  },
  data() {
    return {
      defaultStyle: {
        width: "60",
        align: "center",
      },
    };
  },
  computed: {
    pagePosition() {
      if (this.pageLeft) {
        return {
          justifyContent: "flex-start",
        };
      }
      if (this.pageRight) {
        return {
          justifyContent: "flex-end",
        };
      }
      return {};
    },

    // 处理列表筛选
    filterOptions() {
      const handleLabelValueOptions = (options, optionsObj, itemValue) => {
        if (Array.isArray(options) && optionsObj && options.length) {
          // 如果options不是标准的label，value数据结构需要做一下处理，optionsObj = { label: "text", value: "id" };
          options = options.map((item) => {
            for (const key in optionsObj) {
              item[key] = item[optionsObj[key]];
            }
            return item;
          });
        }
        const obj = options.find((i) => i.value === itemValue);
        return obj ? obj.label : this.$BASECONFIG.emptyStr;
      };

      return (scope, propItem) => {
        const { options, optionsObj } = propItem;
        const itemValue = scope.row[propItem.prop];

        if (Array.isArray(options)) {
          return handleLabelValueOptions(options, optionsObj, itemValue);
        } else if (typeof options === "object") {
          return Object.prototype.hasOwnProperty.call(options, itemValue)
            ? options[itemValue]
            : this.$BASECONFIG.emptyStr;
        } else {
          return typeof itemValue === "number"
            ? itemValue
            : itemValue || this.$BASECONFIG.emptyStr;
        }
      };
    },

    // 列表默认项展示
    twoProp() {
      return (scope, propItem) => {
        const value = scope.row[propItem.prop];
        const value2 = scope.row[propItem.prop2];
        const hasValue = typeof value === "number" || value;
        const hasValue2 = typeof value2 === "number" || value2;
        const separator = propItem.split || "/";
        const formattedValue =
          hasValue && hasValue2
            ? `${value}${separator}${value2}`
            : hasValue || hasValue2
            ? value || value2
            : this.$BASECONFIG.emptyStr;
        return formattedValue;
      };
    },
    // 列表默认项展示
    defaultText() {
      return (scope, propItem) => {
        const value = scope.row[propItem.prop];
        const hasValue = typeof value === "number" || value;
        const formattedValue = hasValue
          ? `${propItem.leftUnit || ""}${value}${propItem.unit || ""}`
          : this.$BASECONFIG.emptyStr;
        return formattedValue;
      };
    },

    // 如果page传入的是 start 和 limit
    isPageStart() {
      return Object.prototype.hasOwnProperty.call(this.page, "start");
    },
  },
  methods: {
    // pageSize 改变时会触发
    handleSizeChange(val) {
      const pageForm = {
        ...this.page,
        [this.isPageStart ? "limit" : "pageSize"]: val,
      };
      this.$emit("update:page", pageForm);
      this.$emit("getList", pageForm);
    },
    // current-change 改变时会触发
    handleCurrentChange(val) {
      const pageForm = {
        ...this.page,
        [this.isPageStart ? "start" : "currentPage"]: val,
      };
      this.$emit("update:page", pageForm);
      this.$emit("getList", pageForm);
    },
  },
};
</script>
