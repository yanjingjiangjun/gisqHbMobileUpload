<template>
  <div class="wrapper" v-if="p_visiable">
    <div class="gisq-dialog" ref="box" @click.stop="">
      <div v-if="p_title != null" class="gisq-title">
        {{ p_title }}
      </div>

      <div class="gisq-items">
        <div v-for="(item, index) in p_sheetItems" :key="index" @click="clickOnSheetItem(item)" class="gisq-item">
          <div>{{ item.name }}</div>
          <div class="gisq-line"></div>
        </div>
      </div>
      <div class="gisq-cancel" @click="dismiss()">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gisq-sheet",
  props: {
    p_title: null,
    p_cancelable: {
      type: Boolean,
      default: true,
    },
    p_visiable: false,
    p_sheetItems: Array,
  },
  data() {
    return {};
  },
  methods: {
    dismiss() {
      this.$emit("update:p_visiable", false);
    },
    clickOnSheetItem(obj) {
        this.dismiss()
		
        this.$emit("clickOnSheet", obj);
    }
  },
};
</script>

<style >
.wrapper {
  background: #000000ff;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: bottom;
}
.gisq-dialog {
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  margin: auto;
  overflow: hidden;
  padding: 10px 0px;
  width: 100%;
}
.gisq-title {
  color: #111;
  font-weight: bolder;
}
.gisq-items {
  padding: 10px 0px;
}
.gisq-item {
  color: #333;
  height: 2.2rem;
  line-height: 2.2rem;
  font-weight: bolder;
}
.gisq-line {
  background: #f2f2f2;
  height: 1px;
}
.gisq-cancel {
  color: red;
  height: 2rem;
  line-height: 2rem;
}
</style>