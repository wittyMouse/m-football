<template>
  <div class="wm-radio" @click="onClick">
    <div :class="['wm-radio-inner', { active: innerChecked }]"></div>
    <div class="wm-radio-text" v-if="label">{{ label }}</div>
    <input
      type="radio"
      :name="innerName"
      :value="value"
      :checked="innerChecked"
      v-show="false"
    />
  </div>
</template>

<script>
export default {
  name: "Radio",
  props: {
    name: {
      type: String,
      default: "",
    },
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
  computed: {
    isGroup() {
      return this.$parent.$options._componentTag === "wm-radio-group";
    },
    innerChecked() {
      return this.isGroup ? this.$parent.value === this.value : this.checked;
    },
    innerName() {
      return this.isGroup ? this.$parent.name : this.name;
    },
  },
  methods: {
    onClick() {
      if (this.isGroup) {
        this.$parent.onChange(this.value);
      }
      this.$emit("change", this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-radio {
  display: inline-block;
  vertical-align: middle;
}

.wm-radio-inner {
  position: relative;
  display: inline-block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  vertical-align: middle;
}

.wm-radio-inner::before {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 50%;
  border: 1px solid #0075ff;
  transform: scale(0.5);
}

.wm-radio-inner.active::after {
  content: " ";
  display: block;
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  background-color: #0075ff;
}

.wm-radio-text {
  display: inline-block;
  margin-left: 8px;
  font-size: 24px;
  color: #888;
  line-height: 60px;
  vertical-align: middle;
}
</style>
