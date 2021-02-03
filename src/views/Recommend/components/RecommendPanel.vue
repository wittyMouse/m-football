<template>
  <div class="recommend-panel">
    <div class="recommend-panel-header">
      <img
        class="recommend-panel-header-image"
        :src="`${assetsURL}/zj-title0${target}.png`"
      />
    </div>

    <div class="recommend-panel-content">
      <div
        class="recommend-card"
        v-for="item in dataSource"
        :key="item.id"
        @click="onClick(item.id)"
      >
        <div class="recommend-card-layout-left">
          <div class="recommend-card-chart">
            <wm-pie-chart :value="item.winning" />
            <div class="recommend-card-avatar">
              <img class="recommend-card-avatar-image" :src="item.avatar" />
            </div>
          </div>
        </div>

        <div class="recommend-card-layout-right">
          <div class="recommend-card-layout-right-header">
            <div class="recommend-card-title">{{ item.realname }}</div>
            <div class="recommend-card-right-text">暂无最新推介</div>
          </div>

          <div class="recommend-card-layout-right-content">
            <div class="recommend-card-description van-multi-ellipsis--l3">
              {{ item.description }}
            </div>
          </div>

          <div class="recommend-card-layout-right-footer">
            <div class="recommend-card-score-label">近五场成绩</div>
            <img
              class="recommend-card-shape"
              :src="assetsURL + '/icon-jt02.png'"
            />
            <div class="recommend-card-score-wrapper">
              <div
                :class="[
                  'recommend-card-score',
                  'bg-color-' + resultClassMap[score],
                ]"
                v-for="(score, index) in item.result"
                :key="index"
              >
                {{ resultTextMap[score] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/PieChart";
import { assetsURL } from "@/api/config";

export default {
  name: "RecommendPanel",
  components: {
    "wm-pie-chart": PieChart,
  },
  props: {
    target: {
      type: String,
      default: "",
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
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
  },
  data() {
    return {
      assetsURL,
    };
  },
  methods: {
    onClick(id) {
      this.$emit("click", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.recommend-panel {
}

.recommend-panel-header {
}

.recommend-panel-header-image {
  display: block;
  width: 100%;
  height: 80px;
}

.recommend-panel-content {
  padding: 16px 2%;
  box-sizing: border-box;
}

.recommend-card {
  display: flex;
  min-height: 240px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 12px #d0d0d0;
}

.recommend-card:not(:last-child) {
  margin-bottom: 16px;
}

.recommend-card-layout-left {
  position: relative;
  flex: 0 0 auto;
  padding-top: 20px;
  width: 216px;
  box-sizing: border-box;
}

.recommend-card-layout-right {
  flex: 1 0 auto;
  padding-right: 20px;
  width: calc(100% - 216px);
  box-sizing: border-box;
}

.recommend-card-chart {
  text-align: center;
}

.wm-pie-chart::v-deep .wm-pie-chart-percentage {
  z-index: 5;
}

.recommend-card-avatar {
  position: absolute;
  top: 32px;
  left: 50%;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 8px solid #fff;
  transform: translateX(-50%);
  overflow: hidden;
}

.recommend-card-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.recommend-card-layout-right-header {
  position: relative;
  display: flex;
  align-items: center;
}

.recommend-card-layout-right-header::after {
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

.recommend-card-title {
  flex: 0 0 auto;
  padding-left: 16px;
  font-size: 28px;
  font-weight: normal;
  line-height: 72px;
  color: #555;
}

.recommend-card-right-text {
  flex: 1 0 auto;
  font-size: 24px;
  font-weight: normal;
  text-align: right;
  line-height: 72px;
  color: #999;
}

.recommend-card-description {
  padding: 7px 16px 0;
  font-size: 24px;
  line-height: 32px;
  color: #888;
}

.recommend-card-layout-right-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 6px 6px 16px 0;
}

.recommend-card-score-label {
  font-size: 24px;
  color: #555;
}

.recommend-card-shape {
  display: block;
  margin: 0 12px;
  width: 8px;
  height: 18px;
}

.recommend-card-score-wrapper {
  line-height: 0;
}

.recommend-card-score {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  text-align: center;
  line-height: 32px;
  color: #fff;
}

.recommend-card-score + .recommend-card-score {
  margin-left: 6px;
}

.recommend-card-score.bg-color-1 {
  background-color: #e00;
}

.recommend-card-score.bg-color-2 {
  background-color: #555;
}

.recommend-card-score.bg-color-3 {
  background-color: #00c759;
}
</style>
