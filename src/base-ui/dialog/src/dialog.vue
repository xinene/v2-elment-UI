<!--
 * @Author: huaxu huaxu@dgg.net
 * @Date: 2024-04-16 10:42:09
 * @LastEditors: huaxu huaxu@dgg.net
 * @LastEditTime: 2024-06-24 12:01:43
 * @FilePath: /v2-elment-UI/src/base-ui/dialog/src/dialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: https://wangkai.com
 * @Date: 2021-11-16 11:20:11
 * @LastEditors: kkw
 * @LastEditTime: 2023-06-08 16:34:57
 * @FilePath: /v2-base-ui/src/base-ui/dialog/src/dialog.vue
 * @Description: 全局弹窗
-->


<template>
  <el-dialog
    :title="title"
    destroy-on-close
    v-bind="{ ...$attrs, ...defaultDialogProps, ...dialogProps }"
    :visible.sync="dialogVisibleRef"
    @closed="
      () => {
        $emit('update:loading', false);
        $emit('closed');
      }
    "
    v-on="$listeners"
  >
    <!-- 自定义title -->
    <template #title>
      <slot name="title" />
    </template>
    <!-- 内容 -->
    <div v-loading="loading">
      <!-- 内容 -->
      <slot />
    </div>
    <span v-if="showFooter" slot="footer">
      <slot name="footer">
        <el-button
          :disabled="loading"
          v-bind="btnProps"
          @click="dialogVisibleRef = false"
          >{{ cancelBtnText }}</el-button
        >
        <el-button
          :disabled="loading"
          type="primary"
          v-bind="btnProps"
          @click="$emit('click')"
          >{{ confirmBtnText }}</el-button
        >
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "BaseDialog",
  props: {
    title: {
      type: String,
      default: "",
    },
    dialogProps: {
      type: Object,
      default: () => ({}),
    },
    confirmBtnText: {
      type: String,
      default: "确 定",
    },
    cancelBtnText: {
      type: String,
      default: "取 消",
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    btnProps: {
      type: Object,
      default: () => ({}),
    },
    visible: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      // 项目自定义的一些属性， 每个项目的都不一样，可以自己预设
      defaultDialogProps: {
        closeOnClickModal: false,
        closeOnPressEscape: false,
      },
    };
  },
  computed: {
    dialogVisibleRef: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit("update:visible", v);
      },
    },
  },
};
</script>
