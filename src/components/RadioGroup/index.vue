<template>
  <div class="wm-radio-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "RadioGroup",
  props: {
    name: {
      type: String,
      value: "",
    },
    value: {
      type: String,
      value: "",
    },
  },
  methods: {
    onChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
