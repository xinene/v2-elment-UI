<!--
 * @Author: huaxu huaxu@dgg.net
 * @Date: 2024-04-16 10:42:09
 * @LastEditors: huaxu huaxu@dgg.net
 * @LastEditTime: 2024-06-24 14:25:28
 * @FilePath: /v2-elment-UI/src/base-ui/form/src/form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: https://wangkai.com
 * @Date: 2021-11-16 11:20:11
 * @LastEditors: kkw
 * @FilePath: /v2-base-ui/src/base-ui/form/src/form.vue
 * @Description: 全局form表单
-->


<template>
  <el-form
    ref="form"
    :model="model"
    :class="{ 'k-form': layout }"
    :rules="rules"
    v-bind="{
      labelWidth: $BASECONFIG.formStyle.labelWidth,
      ...$attrs,
      ...formProps,
    }"
    @submit.native.prevent
  >
    <slot name="header"></slot>
    <template v-for="(item, index) of formItems">
      <el-form-item
        v-if="!item.isHidden"
        :key="index"
        :label="item.label ? `${item.label}${colon}` : ''"
        :prop="item.field || item.startField"
        :rules="item.rules"
        :class="{ 'k-row': item.row }"
        v-bind="item.formItemProps"
      >
        <!-- 输入框 -->
        <template v-if="item.type === 'input'">
          <el-input
            :value="model[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :maxlength="item.maxlength || $BASECONFIG.formMaxlength"
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            v-bind="{ clearable: true, ...item.itemProps }"
            @input="handleValueChange($event, item)"
          >
            <template v-if="item.prepend" slot="prepend">{{
              item.prepend
            }}</template>
            <template v-if="item.append" slot="append">{{
              item.append
            }}</template>
          </el-input>
        </template>
        <template v-else-if="item.type === 'textarea'">
          <el-input
            type="textarea"
            :value="model[item.field]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            :maxlength="item.maxlength || $BASECONFIG.textareaMaxlength"
            :show-word-limit="item.showWordLimit"
            :rows="item.rows"
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            v-bind="{ clearable: true, ...item.itemProps }"
            @input="handleValueChange($event, item)"
          >
          </el-input>
        </template>
        <!-- 选择器 -->
        <template v-else-if="item.type === 'select'">
          <el-select
            clearable
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :value="model[item.field]"
            v-bind="item.itemProps"
            v-on="item.events"
            @change="handleValueChange($event, item)"
          >
            <el-option
              v-for="option in item.options"
              :key="option.key"
              v-bind="option"
            >
            </el-option>
          </el-select>
        </template>
        <!-- 单选 -->
        <template v-else-if="item.type === 'radio'">
          <el-radio-group v-model="model[item.field]" v-on="item.events">
            <el-radio
              v-for="option of item.options"
              :key="option.value"
              :label="option.value"
              v-bind="option"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>
        </template>
        <!-- 多选 -->
        <template v-else-if="item.type === 'checkbox'">
          <el-checkbox-group v-model="model[item.field]">
            <el-checkbox
              v-for="option in item.options"
              :key="option.value"
              :label="option.value"
              v-bind="option"
              >{{ option.label }}</el-checkbox
            >
          </el-checkbox-group>
        </template>
        <!-- 日期选择器 -->
        <template v-else-if="item.type === 'datePicker'">
          <!-- 时间范围 -->
          <el-date-picker
            v-if="item.itemProps && item.itemProps.type.includes('range')"
            :value="datePickerRangeValue(item)"
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            v-bind="item.itemProps"
            clearable
            :placeholder="item.placeholder || `请选择${item.label}`"
            @input="handleValueChange($event, item)"
          >
          </el-date-picker>
          <!-- 单日期 -->
          <el-date-picker
            v-else
            :value="model[item.field]"
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            v-bind="item.itemProps"
            clearable
            :placeholder="item.placeholder || `请选择${item.label}`"
            @input="handleValueChange($event, item)"
          >
          </el-date-picker>
        </template>
        <!-- 自定义插槽 -->
        <template v-else-if="item.type === 'slot'">
          <slot :name="item.slotName" :item="item"> </slot>
        </template>
        <!-- 开关 -->
        <template v-else-if="item.type === 'switch'">
          <el-switch v-model="model[item.field]" v-bind="item.itemProps">
          </el-switch>
        </template>
        <!-- 计数器 -->
        <template v-else-if="item.type === 'inputNumber'">
          <el-input-number
            v-model="model[item.field]"
            :style="{
              ...$BASECONFIG.formStyle,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
              ...formStyle,
            }"
            v-bind="item.itemProps"
          ></el-input-number>
        </template>
        <!-- 滑块 -->
        <template v-else-if="item.type === 'slider'">
          <el-slider
            v-model="model[item.field]"
            v-bind="item.itemProps"
          ></el-slider>
        </template>
        <!-- 评分 -->
        <template v-else-if="item.type === 'rate'">
          <el-rate
            v-model="model[item.field]"
            v-bind="item.itemProps"
          ></el-rate>
        </template>
        <!-- 没有type展示详情 -->
        <template v-else>
          <div
            v-if="!item.multi && isEllipsis"
            :style="{
              'font-size': $BASECONFIG.defaultFontSize,
              width: item.width || $BASECONFIG.formStyle.width,
              ...ellipsis,
              ...item.style,
            }"
            :title="model[item.field]"
          >
            <slot :name="item.slotName" :item="item">
              {{
                typeof model[item.field] === "number"
                  ? model[item.field]
                  : model[item.field] || $BASECONFIG.emptyStr
              }}
            </slot>
          </div>
          <div
            v-else-if="item.options"
            :style="{
              'font-size': $BASECONFIG.defaultFontSize,
              width: item.width || $BASECONFIG.formStyle.width,
              ...ellipsis,
              ...item.style,
            }"
          >
            <slot :name="item.slotName" :item="item">
              {{ filterOptions(model[item.field], item) }}
            </slot>
          </div>
          <div
            v-else
            :style="{
              'font-size': $BASECONFIG.defaultFontSize,
              width: item.width || $BASECONFIG.formStyle.width,
              ...item.style,
            }"
          >
            <slot :name="item.slotName" :item="item">
              {{
                typeof model[item.field] === "number"
                  ? model[item.field]
                  : model[item.field] || $BASECONFIG.emptyStr
              }}
            </slot>
          </div>
        </template>
      </el-form-item>
      <!-- hidden 自定义 -->
      <slot v-if="item.noFormItem" :name="item.slotName"></slot>
    </template>
    <slot name="footer"></slot>
  </el-form>
</template>

<script>
import { copyField } from "../../utils/index";
import { cloneDeep } from "lodash";
export default {
  name: "BaseForm",
  props: {
    formItems: {
      type: Array,
      default: () => [],
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    formStyle: {
      type: Object,
      default: () => ({}),
    },
    colon: {
      type: String,
      default: "",
    },
    // 展示的时候是否单行省略 true 单行省略
    isEllipsis: Boolean,
    // 是否需要布局
    layout: {
      type: Boolean,
      default: false,
    },
    init: { type: Boolean, default: true },
  },
  data() {
    return {
      ellipsis: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  },
  computed: {
    datePickerRangeValue() {
      return (item) => {
        const startField = item?.startField;
        const endField = item?.endField;
        const field = item?.field;
        const startFieldValue = this.model[startField];
        const endFieldValue = this.model[endField];
        const fieldvalue = this.model[field];

        if (field) {
          return fieldvalue;
        } else {
          return startFieldValue && endFieldValue
            ? [startFieldValue, endFieldValue]
            : null;
        }
      };
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

      return (itemValue, item) => {
        const { options, optionsObj } = item;

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
  },
  watch: {
    // init: {
    //   handler(newVal) {
    //     newVal && this.initForm();
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    /**
     * @description: 双向数据绑定
     */
    handleValueChange(value, item) {
      const { field, trim, limit, type, itemProps } = item;
      !trim && (value = this.trim(value)); // 查询条件的字符串默认去空格,如果不需要去空格添加 trim:true
      // 限制数字
      value = limit === "number" ? value.replace(/[^\d]/g, "") : value;
      // 自己写正则
      value = item.reg ? value.replace(item.reg, "") : value;
      // 自己写过滤器方法处理
      value = item.filter ? item.filter(value) : value;

      let tempForm = {};

      // 处理时间
      if (
        type === "datePicker" &&
        itemProps &&
        itemProps?.type.includes("range")
      ) {
        tempForm = {
          [item.startField]: value ? value[0] : "",
          [item.endField]: value ? value[1] : "",
          [field]: value,
        };

        delete tempForm.undefined;
        delete tempForm[""];
      } else {
        tempForm = { [field]: value };
      }
      this.$emit("update:model", { ...this.model, ...tempForm });
    },
    // 字符串去空格
    trim(value) {
      if (typeof value === "string") {
        return value.trim();
        // value.replace("\\u200B","") //暂不考虑
      } else {
        return value;
      }
    },
    // 初始化model
    initForm() {
      // 如果父组件没有初始化model，那就执行初始化
      if (typeof this.model === "object" && !Object.keys(this.model).length) {
        const model = copyField(this.formItems);
        this.$emit("update:model", model);
      }
    },

    setOptions(field, options, optionsObj) {
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
      tempFormItems.forEach((i) => {
        if (field && i?.field === field) {
          i.options = options;
        }
      });
      this.$emit("update:formItems", tempFormItems);
    },
    setField(field, key, value) {
      const tempFormItems = cloneDeep(this.formItems);
      tempFormItems.forEach((item) => {
        if (Array.isArray(field) && field.includes(item?.field)) {
          item[key] = value;
        } else if (item?.field === field) {
          item[key] = value;
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

.k-form.xx {
  // @include setWidth(100%, 50%, 33.3%, 25%);
  @include setWidth(33.3%, 33.3%, 33.3%, 25%);
}

@for $i from 1 through 5 {
  .k-form.x#{$i} {
    $w: #{calc(1 / $i * 100 * 1%)};
    @include setWidth($w, $w, $w, $w);

    ::v-deep {
      .el-form-item__content {
        margin-right: 10px;
      }
    }
  }
}

.k-form {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.k-row {
  width: 100% !important;
}
</style>
