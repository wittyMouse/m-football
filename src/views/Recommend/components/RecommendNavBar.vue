<template>
  <div class="recommend-nav-bar">
    <div
      class="recommend-nav-item"
      v-for="item in navList"
      :key="item.id"
      @click="onClick(item.id)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendNavBar",
  data() {
    return {
      navList: [
        {
          id: "1",
          title: "至尊精选推荐",
        },
        {
          id: "2",
          title: "合作机构",
        },
        {
          id: "3",
          title: "至尊赢利套餐",
        },
      ],
    };
  },
  methods: {
    onClick(id) {
      this.$emit("nav", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend-nav-bar {
  position: fixed;
  top: 80px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 88px;
  background-color: #fff;
}

.recommend-nav-bar::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.recommend-nav-item {
  display: inline-block;
  position: relative;
  width: calc(100% / 3);
  height: 88px;
  font-size: 28px;
  text-align: center;
  line-height: 88px;
  color: #555;
}

.recommend-nav-item:not(:last-child)::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-right: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}
</style>
