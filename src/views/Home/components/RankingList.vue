<template>
  <div class="wm-ranking-list">
    <div class="wm-ranking-list-header">
      <img
        class="wm-ranking-list-title-image"
        :src="assetsURL + '/icon-title01.png'"
      />
    </div>

    <div class="wm-ranking-list-content">
      <div
        :class="['wm-ranking-card', { 'first-child': index === 0 }]"
        v-for="(item, index) in rankingList"
        :key="item.userId"
        @click="bindCardClick(item.userId)"
      >
        <div class="wm-ranking-card-sort">{{ index > 2 ? index + 1 : "" }}</div>

        <div class="wm-ranking-card-chart">
          <wm-pie-chart :value="item.proportion" />
          <div class="wm-ranking-card-avatar">
            <img class="wm-ranking-card-avatar-image" :src="item.avatar" />
          </div>
        </div>

        <div class="wm-ranking-card-info">
          <div class="wm-ranking-card-header van-ellipsis">
            {{ item.realname }}
          </div>
          <div
            :class="[
              'wm-ranking-card-content',
              index === 0 ? 'van-multi-ellipsis--l2' : 'van-multi-ellipsis--l3',
            ]"
          >
            {{ item.description }}
          </div>
        </div>

        <div class="wm-ranking-card-button" v-if="index === 0">
          点击进入
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/PieChart";
import { assetsURL } from "@/api/config";

export default {
  name: "RankingList",
  components: {
    "wm-pie-chart": PieChart,
  },
  props: {
    rankingList: {
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
     * 点击胜率榜
     * @param {*} e
     */
    bindCardClick(id) {
      this.$router.push(`/recommend/detail?id=${id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-ranking-list {
}

.wm-ranking-list-header {
  width: 100%;
  height: 70px;
  padding: 32px 0;
}

.wm-ranking-list-title-image {
  display: block;
  margin: 0 auto;
  width: 360px;
  height: 70px;
}

.wm-ranking-list-content {
  display: flex;
  flex-wrap: wrap;
}

.wm-ranking-card {
  flex: 0 0 auto;
  position: relative;
  margin: 0 15px 30px;
  padding: 20px 0 0;
  width: 220px;
  height: 380px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 0 12px #d0d0d0;
}

.wm-ranking-card.first-child {
  display: flex;
  margin: 0 16px 30px;
  padding: 20px 0 30px;
  width: 718px;
  height: unset;
  border-radius: 100px 20px 20px 100px;
}

.wm-ranking-card-sort {
  position: absolute;
  right: 0;
  top: 0;
  width: 48px;
  font-size: 28px;
  text-align: center;
  line-height: 1.6;
  color: #555;
}

.wm-ranking-card:nth-child(1) .wm-ranking-card-sort,
.wm-ranking-card:nth-child(2) .wm-ranking-card-sort,
.wm-ranking-card:nth-child(3) .wm-ranking-card-sort {
  top: 4px;
  width: 48px;
  height: 64px;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100%;
}

.wm-ranking-card:nth-child(1) .wm-ranking-card-sort {
  width: 56px;
  height: 72px;
  background-image: url("https://www.df1668.com/images/icon-pm01.png");
}

.wm-ranking-card:nth-child(2) .wm-ranking-card-sort {
  background-image: url("https://www.df1668.com/images/icon-pm02.png");
}

.wm-ranking-card:nth-child(3) .wm-ranking-card-sort {
  background-image: url("https://www.df1668.com/images/icon-pm03.png");
}

.wm-ranking-card-chart {
  position: relative;
  text-align: center;
}

.wm-ranking-card.first-child .wm-ranking-card-chart {
  flex: 0 0 auto;
  width: 212px;
}

.wm-pie-chart::v-deep .wm-pie-chart-percentage {
  left: 60%;
  bottom: -6px;
  z-index: 5;
  transform: translateX(0);
}

.wm-ranking-card-avatar {
  position: absolute;
  top: 12px;
  left: 50%;
  border: 8px solid #fff;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  transform: translateX(-50%);
}

.wm-ranking-card-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.wm-ranking-card-info {
}

.wm-ranking-card.first-child .wm-ranking-card-info {
  flex: 0 0 auto;
}

.wm-ranking-card-header {
  position: relative;
  margin: 0 16px;
  padding: 28px 0 0 0;
  font-size: 28px;
  text-align: center;
  font-weight: normal;
  line-height: 48px;
  color: #555;
}

.wm-ranking-card-header::after {
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

.wm-ranking-card.first-child .wm-ranking-card-header {
  width: 442px;
  padding: 0 16px 12px;
  text-align: left;
  font-size: 32px;
}

.wm-ranking-card-content {
  margin: 0 12px;
  padding: 4px 0 0;
  font-size: 24px;
  color: #999;
  line-height: 1.6;
}

.wm-ranking-card.first-child .wm-ranking-card-content {
  width: 442px;
  padding: 8px 16px 0;
  margin: 0 16px;
}

.wm-ranking-card-button {
  position: absolute;
  right: 20px;
  bottom: 8px;
  margin: 0;
  padding: 0;
  width: 136px !important;
  height: 48px;
  border-radius: 24px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  line-height: 48px;
  color: #fff;
  background-color: #555;
}
</style>
