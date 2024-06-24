<!--
 * @Author: https://wangkai.com
 * @Date: 2021-11-16 11:20:11
 * @LastEditors: kkw
 * @FilePath: /v2-base-ui/src/base-ui/search/src/search.vue
 * @Description: 全局搜索栏
-->

<template>
  <div class="kkw-search" style="border: 1px solid #fff">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form
      ref="form"
      class="xx"
      :class="{ 'k-queryFrom': layout }"
      :model="queryForm"
      v-bind="{
        ...$BASECONFIG.searchProps,
        ...$attrs,
        ...formProps,
      }"
      @submit.native.prevent
    >
      <template v-for="(item, index) in formItems">
        <el-form-item
          v-show="
            !item.isHidden && showToggle && toggle ? foldLength > index : true
          "
          :key="index"
          :label="item.label ? `${item.label}${colon}` : ''"
        >
          <template v-if="item.type === 'input'">
            <el-input
              clearable
              :maxlength="
                item.maxlength || maxlength || $BASECONFIG.searchMaxlength
              "
              :placeholder="item.placeholder || `请输入${item.label}`"
              :value="queryForm[item.field]"
              :style="{ ...item.style, ...$BASECONFIG.searchStyle }"
              v-bind="{ ...item.itemProps }"
              @input="handleValueChange($event, item)"
              @keyup.enter.native="getList"
            >
            </el-input>
          </template>
          <template v-if="item.type === 'select'">
            <el-select
              clearable
              :placeholder="item.placeholder || `请选择${item.label}`"
              :value="queryForm[item.field]"
              :style="{ ...item.style, ...$BASECONFIG.searchStyle }"
              v-bind="{ ...item.itemProps }"
              v-on="item.events"
              @input="handleValueChange($event, item)"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                v-bind="option"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'datePicker'">
            <!-- 时间范围 -->
            <el-date-picker
              v-if="item.itemProps && item.itemProps.type.includes('range')"
              :value="datePickerRangeValue(item)"
              :style="{ ...item.style, ...$BASECONFIG.searchStyle }"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              v-bind="{
                ...defaultPicker,
                ...item.itemProps,
              }"
              @input="handleValueChange($event, item)"
            >
            </el-date-picker>
            <!-- 单日期 -->
            <el-date-picker
              v-else
              :value="queryForm[item.field]"
              :placeholder="item.placeholder || `请选择${item.label}`"
              clearable
              :style="{ ...item.style, ...$BASECONFIG.searchStyle }"
              v-bind="{
                ...item.itemProps,
              }"
              @input="handleValueChange($event, item)"
            >
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'slot'">
            <slot :name="item.slotName" :item="item"> </slot>
          </template>
        </el-form-item>
      </template>
      <el-form-item class="btn-group">
        <template v-if="showPresetBtn">
          <slot name="preset">
            <el-button type="primary" @click="getList">
              {{ presetSearchBtn }}
            </el-button>
            <el-button v-if="showResetBtn" @click="reset">
              {{ presetResetBtn }}
            </el-button>
          </slot>
        </template>
        <slot> </slot>
      </el-form-item>
    </el-form>
    <!-- 展开搜索  待完成 -->
    <el-divider v-if="showToggle" dashed>
      <el-button style="flex: 1" type="text" @click="toggle = !toggle">
        {{ toggle ? "展开" : "收起" }}
        <i :class="toggle ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
      </el-button>
    </el-divider>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { reset, copyField } from "../../utils/index";
import { cloneDeep } from "lodash";
export default {
  name: "BaseSearch",
  props: {
    formItems: {
      type: Array,
      default: () => [],
    },
    queryForm: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => {},
    },
    showPresetBtn: {
      type: Boolean,
      default: true,
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
    presetSearchBtn: {
      type: String,
      default: "查询",
    },
    presetResetBtn: {
      type: String,
      default: "重置",
    },
    // 重置时是否需要默认清空
    isReset: {
      type: Boolean,
      default: true,
    },
    page: {
      type: Object,
      default: () => ({}),
    },
    // 重置时是否需要重置分页
    isResetPage: {
      type: Boolean,
      default: true,
    },
    // 是否需要布局
    layout: {
      type: Boolean,
      default: true,
    },
    maxlength: {
      type: [Number, String],
      default: "",
    },
    colon: {
      type: String,
      default: "：",
    },
    init: { type: Boolean, default: true },
    // 是否展示收起展开
    showToggle: { type: Boolean, default: false },
    // 默认收起长度
    foldLength: {
      type: Number,
      default: 5,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    defaultCurrentPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      defaultPicker: {
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
      },

      toggle: true,
    };
  },
  computed: {
    datePickerRangeValue() {
      return (item) => {
        const startField = item?.startField;
        const endField = item?.endField;
        const field = item?.field;
        const startFieldValue = this.queryForm[startField];
        const endFieldValue = this.queryForm[endField];
        const fieldvalue = this.queryForm[field];

        if (field) {
          return fieldvalue;
        } else {
          return startFieldValue && endFieldValue
            ? [startFieldValue, endFieldValue]
            : null;
        }
      };
    },
    // 如果page传入的是 start 和 limit
    isPageStart() {
      return Object.prototype.hasOwnProperty.call(this.page, "start");
    },
  },
  watch: {
    init: {
      handler(newVal) {
        newVal && this.initForm();
      },
      immediate: true,
    },
  },
  methods: {
    // 双向绑定
    handleValueChange(value, item) {
      const { field, trim, type, itemProps, limit } = item;

      // 去空格
      const trimmedValue = trim ? value : this.trim(value);

      let processedValue = trimmedValue;
      if (limit === "number") {
        processedValue = processedValue.replace(/[^\d]/g, "");
      }

      let tempForm = {};

      if (
        type === "datePicker" &&
        itemProps &&
        itemProps?.type.includes("range")
      ) {
        tempForm = {
          [item.startField]: processedValue ? processedValue[0] : "",
          [item.endField]: processedValue ? processedValue[1] : "",
          [field]: processedValue,
        };

        delete tempForm.undefined;
        delete tempForm[""];
      } else {
        tempForm = { [field]: processedValue };
      }

      this.$emit("update:queryForm", { ...this.queryForm, ...tempForm });
    },

    // 查询数据
    getList() {
      this.$emit("getList");
    },
    // 重置
    reset() {
      // 如果组件有@reset方法，就不清空查询条件，自定义去清空（暂时不考虑这种情况，先注释）
      // if (typeof this.$listeners === 'object' && 'reset' in this.$listeners === false) {
      //   reset(this.queryForm);
      // }

      if (this.isReset) {
        reset(this.queryForm);
      }
      if (this.isResetPage) {
        this.$emit("update:page", {
          ...this.page,
          [this.isPageStart ? "limit" : "pageSize"]: this.defaultPageSize,
          [this.isPageStart ? "start" : "currentPage"]: this.defaultCurrentPage,
        });
      }
      this.$emit("reset");
    },
    // 字符串去空格
    trim(value) {
      if (typeof value === "string") {
        return value.trim();
        // value.replace("\\u200B","") // 如果是unicode字符空格,暂不考虑处理
      } else {
        return value;
      }
    },
    // 初始化queryForm
    initForm() {
      // 如果父组件没有初始化queryForm，那就执行初始化
      if (
        typeof this.queryForm === "object" &&
        Object.keys(this.queryForm).length === 0
      ) {
        const queryForm = copyField(this.formItems);
        this.$emit("update:queryForm", queryForm);
      }
    },

    // 设置select数据
    setOptions(field, options, optionsObj, emptyText = "") {
      // 如果options不是标准的label，value数据结构需要做一下处理，optionsObj = { label: "text", value: "id" };
      if (optionsObj && Array.isArray(options) && options.length) {
        options = options.map((item) => {
          for (const key in optionsObj) {
            item[key] = item[optionsObj[key]];
          }
          return item;
        });
      }
      const tempFormItems = cloneDeep(this.formItems);
      tempFormItems.map((i) => {
        if (field && i?.field === field) {
          i.options = emptyText
            ? [{ value: "", label: emptyText }, ...options]
            : options;
        }
      });
      this.$emit("update:formItems", tempFormItems);
    },
  },
};
</script>
<style lang="scss" scoped>
$-md: 940px !default;
$-lg: 1440px !default;
$-xl: 1740px !default;

$--breakpoints: (
  "sm": (
    max-width: $-md,
  ),
  "md": (
    min-width: $-md,
  ),
  "lg": (
    min-width: $-lg,
  ),
  "xl": (
    min-width: $-xl,
  ),
);

@mixin res($key, $map: $--breakpoints) {
  // 循环断点Map，如果存在则返回
  @if map-has-key($map, $key) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "Undefeined points: `#{$map}`";
  }
}

@mixin setWidth($w-sm, $w-md, $w-lg, $w-xl) {
  $map: (
    "sm": $w-sm,
    "md": $w-md,
    "lg": $w-lg,
    "xl": $w-xl,
  );

  @each $i in sm, md, lg, xl {
    @include res(#{$i}) {
      ::v-deep .el-form-item {
        width: #{inspect(map-get($map, #{$i}))};
      }
    }
  }
}

.xx {
  // @include setWidth(100%, 50%, 33.3%, 25%);
  @include setWidth(33.3%, 33.3%, 33.3%, 25%);
}

@for $i from 1 through 5 {
  .kkw-search.x#{$i} {
    $w: #{calc(1 / $i * 100 * 1%)};
    @include setWidth($w, $w, $w, $w);
  }
  // 大屏固定 3 列 小屏自己设置
  .kkw-search.y#{$i} {
    $w: #{calc(1 / $i * 100 * 1%)};
    @include setWidth($w, $w, 33.3%, 33.3%);
  }
}

.k-queryFrom {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  ::v-deep {
    .el-form-item {
      margin: 0;
      padding: 8px 0px;
      display: flex;
    }

    .el-form-item__content {
      width: calc(100% - 120px);

      .el-select,
      .el-date-editor {
        width: 100%;
      }

      .el-select {
        width: 100% !important;
      }
    }
  }

  .btn-group {
    flex: 1;

    ::v-deep .el-form-item__content {
      text-align: right;
      width: 100% !important;
    }
  }
}

::v-deep {
  .el-divider--horizontal {
    margin: 13px 0 25px;
  }
}
</style>
