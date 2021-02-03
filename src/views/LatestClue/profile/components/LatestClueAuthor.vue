<template>
  <div class="latest-clue-author">
    <div class="latest-clue-author-layout-left">
      <div class="latest-clue-author-chart">
        <wm-pie-chart :value="authorInfo.winning" />
        <div class="latest-clue-author-avatar">
          <img
            class="latest-clue-author-avatar-image"
            :src="authorInfo.avatar"
          />
        </div>
      </div>
    </div>
    <div class="latest-clue-author-layout-right">
      <div class="latest-clue-author-description">
        {{ authorInfo.description }}
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/PieChart";

export default {
  name: "LatestClueAuthor",
  components: {
    "wm-pie-chart": PieChart,
  },
  props: {
    authorInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.latest-clue-author {
  display: flex;
  padding: 20px 0;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 12px #d0d0d0;
}

.latest-clue-author-layout-left {
  width: 216px;
  padding: 20px 0 52px;
  box-sizing: border-box;
}

.latest-clue-author-chart {
  position: relative;
  text-align: center;
}

.wm-pie-chart .wm-pie-chart-percentage {
  z-index: 5;
}

.latest-clue-author-avatar {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 128px;
  height: 128px;
  border: 8px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
}

.latest-clue-author-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.latest-clue-author-layout-right {
  padding-right: 20px;
  width: calc(100% - 216px);
  box-sizing: border-box;
}

.latest-clue-author-description {
  padding: 8px 16px 0;
  font-size: 24px;
  color: #888;
  line-height: 32px;
}
</style>
