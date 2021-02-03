<template>
  <div class="wm-header">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style lang="scss" scoped>
.wm-header {
  width: 100%;
  height: 80px;
  background-image: url("https://www.df1668.com/images/bg-title.jpg");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 80px;
}
</style>
