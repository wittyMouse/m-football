<template>
  <div class="wm-ranking-chart">
    <div class="wm-ranking-chart-header">
      <img
        class="wm-ranking-chart-title-image"
        :src="assetsURL + '/icon-title02.png'"
      />
    </div>

    <div class="wm-ranking-chart-content">
      <div class="wm-ranking-chart-card">
        <div class="wm-ranking-chart-card-layout-left">
          <div
            class="wm-ranking-chart-card-row"
            v-for="item in rankingChartData"
            :key="item.userId"
          >
            <div
              class="wm-ranking-chart-card-block"
              @click="bindCardClick(item.userId)"
            >
              <div class="wm-ranking-chart-card-avatar">
                <img
                  class="wm-ranking-chart-card-avatar-image"
                  :src="item.avatar"
                />
              </div>
              <div class="wm-ranking-chart-card-name van-ellipsis">
                {{ item.realname }}
              </div>
            </div>

            <div class="wm-ranking-chart-card-bar-chart">
              <div
                class="bar-chart-zhong"
                :style="{ width: (item['中'] / item['推']) * 100 + '%' }"
              ></div>
              <div
                class="bar-chart-zou"
                :style="{ width: (item['负'] / item['推']) * 100 + '%' }"
              ></div>
              <div
                class="bar-chart-fu"
                :style="{ width: (item['输'] / item['推']) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="wm-ranking-chart-card-layout-right">
          <div
            class="wm-ranking-chart-card-grid"
            v-for="(item, index) in 10"
            :key="index"
          >
            {{ index * 10 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "RankingChart",
  props: {
    rankingChartData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      assetsURL,
    };
  },
  methods: {
    /**
     * 点击胜场榜
     * @param {*} e
     */
    bindCardClick(id) {
      this.$router.push(`/recommend/detail?id=${id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-ranking-chart {
}

.wm-ranking-chart-header {
  width: 100%;
  height: 70px;
  padding: 32px 0;
}

.wm-ranking-chart-title-image {
  display: block;
  margin: 0 auto;
  width: 360px;
  height: 70px;
}

.wm-ranking-chart-content {
  padding-bottom: 32px;
}

.wm-ranking-chart-card {
  position: relative;
  margin: 0 auto;
  padding: 24px 0;
  width: 720px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 12px #d0d0d0;
}

.wm-ranking-chart-card-layout-left {
}

.wm-ranking-chart-card-row {
  display: flex;
}

.wm-ranking-chart-card-block {
  width: 216px;
  height: 140px;
}

.wm-ranking-chart-card-avatar {
  position: relative;
  margin: 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.wm-ranking-chart-card-avatar::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 50%;
  border: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-ranking-chart-card-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.wm-ranking-chart-card-name {
  font-size: 24px;
  text-align: center;
  line-height: 1.6;
  color: #555;
}

.wm-ranking-chart-card-bar-chart {
  padding: 25px 0;
  width: calc(100% - 216px);
  height: 140px;
  box-sizing: border-box;
}

.bar-chart-zhong,
.bar-chart-zou,
.bar-chart-fu {
  /* position: relative; */
  width: 0;
  height: 30px;
  transition: width 0.3s;
}

/* .bar-chart-zhong::after,
.bar-chart-zou::after,
.bar-chart-fu::after {
  position: absolute;
  top: 50%;
  right: 0;
  font-size: 24px;
  color: #555;
  transform: translateY(-50%);
}

.bar-chart-zhong::after {
  content: '中';
}
.bar-chart-zou::after {
  content: '走';
}
.bar-chart-fu::after {
  content: '负';
} */

.bar-chart-zhong {
  background-color: #c7000b;
}

.bar-chart-zou {
  background-color: #7fedbd;
}

.bar-chart-fu {
  background-color: #5b5b5b;
}

.wm-ranking-chart-card-layout-right {
  display: flex;
  position: absolute;
  top: 24px;
  right: 0;
  width: calc(100% - 216px);
  margin-left: 216px;
  box-sizing: border-box;
}

.wm-ranking-chart-card-layout-right::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-ranking-chart-card-grid {
  flex: 1 0 auto;
  position: relative;
  width: calc(100% / 10);
  height: 1400px;
  font-size: 20px;
  color: #aaa;
}

.wm-ranking-chart-card-grid::before {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-left: 1px solid #ededed;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}
</style>
