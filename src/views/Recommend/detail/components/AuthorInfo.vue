<template>
  <div class="author-info">
    <div class="author-info-layout-left">
      <div class="author-info-chart">
        <wm-pie-chart :value="authorInfo.winning" />
        <div class="author-info-avatar">
          <img class="author-info-avatar-image" :src="authorInfo.avatar" />
        </div>
      </div>
      <!-- <button class="author-info-rule">推介规则服务说明</button> -->
    </div>

    <div class="author-info-layout-right">
      <div class="author-info-line">
        <div class="author-info-score-label">近五场成绩</div>
        <img class="author-info-shape" :src="assetsURL + '/icon-jt02.png'" />
        <div class="author-info-score-wrapper">
          <div
            :class="['author-info-score', 'bg-color-' + resultClassMap[score]]"
            v-for="(score, index) in authorInfo.result"
            :key="index"
          >
            {{ resultTextMap[score] }}
          </div>
        </div>
      </div>
      <div class="author-info-description">
        {{ authorInfo.description }}
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/PieChart";
import { assetsURL } from "@/api/config";

export default {
  name: "AuthorInfo",
  components: {
    "wm-pie-chart": PieChart,
  },
  props: {
    resultClassMap: {
      type: Object,
      default() {
        return {};
      },
    },
    resultTextMap: {
      type: Object,
      default() {
        return {};
      },
    },
    authorInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      assetsURL,
    };
  },
};
</script>

<style lang="scss" scoped>
.author-info {
  display: flex;
  background-color: #fff;
  box-shadow: 0 0 12px #d0d0d0;
}
.author-info-layout-left {
  width: 216px;
  padding: 20px 0;
  box-sizing: border-box;
}
.author-info-chart {
  position: relative;
  text-align: center;
}
.wm-pie-chart::v-deep .wm-pie-chart-percentage {
  z-index: 5;
}
.author-info-avatar {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 128px;
  height: 128px;
  border: 8px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
}
.author-info-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.author-info-rule {
  position: relative;
  display: block;
  margin: 80px auto 0;
  padding: 0;
  border: 0;
  width: 200px !important;
  height: 68px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  line-height: 68px;
  color: #555;
  background-color: #ebecf1;
}
.author-info-rule::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 24px;
  border: 1px solid #ddd;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}
.author-info-layout-right {
  padding-right: 20px;
  width: calc(100% - 216px);
  box-sizing: border-box;
}
.author-info-line {
  display: flex;
  align-items: center;
  padding: 20px 0 16px 16px;
}
.author-info-score-label {
  font-size: 24px;
}
.author-info-shape {
  display: block;
  margin: 0 12px;
  width: 8px;
  height: 18px;
}
.author-info-score-wrapper {
  display: flex;
  align-items: center;
  line-height: 0;
}
.author-info-score {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  text-align: center;
  line-height: 32px;
  color: #fff;
}
.author-info-score + .author-info-score {
  margin-left: 6px;
}
.author-info-description {
  padding: 8px 16px 24px;
  font-size: 24px;
  line-height: 40px;
  color: #888;
}
.author-info-score.bg-color-1 {
  background-color: #e00;
}
.author-info-score.bg-color-2 {
  background-color: #555;
}
.author-info-score.bg-color-3 {
  background-color: #00c759;
}
</style>
