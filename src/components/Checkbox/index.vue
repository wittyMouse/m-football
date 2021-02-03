<template>
  <div class="wm-checkbox" @click="onClick">
    <div class="wm-checkbox-inner">
      <img
        class="wm-checkbox-image"
        :src="assetsURL + '/check.png'"
        v-show="innerChecked"
      />
    </div>
    <div class="wm-checkbox-text" v-if="label">{{ label }}</div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "Checkbox",
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      assetsURL,
      innerChecked: false,
    };
  },
  watch: {
    checked(val) {
      this.innerChecked = val;
    },
  },
  methods: {
    onClick() {
      this.$emit("click", this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-checkbox {
  display: inline-block;
  vertical-align: middle;
}

.wm-checkbox-inner {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  vertical-align: middle;
}

.wm-checkbox-inner::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 1px solid #000;
  border-radius: 4px;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-checkbox-image {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #0075ff;
}

.wm-checkbox-text {
  display: inline-block;
  margin-left: 8px;
  font-size: 24px;
  color: #888;
  line-height: 60px;
  vertical-align: middle;
}
</style>
