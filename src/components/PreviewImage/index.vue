<template>
  <div class="preview-image" @click="onClick">
    <img class="qr-code" :src="`${url}?timestamp=${Date.now()}`" />
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "PreviewImage",
  data() {
    return {
      url: assetsURL + "/qrcode.jpg",
    };
  },
  methods: {
    onClick() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-image {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code {
  display: block;
  width: 100%;
  height: auto;
}
</style>
