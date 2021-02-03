<template>
  <div class="recommend-card">
    <div class="recommend-card-line">
      时间：{{ recommendDetail.publicationTime }}
    </div>
    <div class="recommend-card-line">
      对阵：（{{ recommendDetail.competition }}）{{ recommendDetail.homeTeam }}
      VS.
      {{ recommendDetail.visitingTeam }}
    </div>
    <div class="recommend-card-line">
      <span class="text-color-1">推介：</span
      ><span class="text-color-1">{{ recommendDetail.proposal }}</span>
    </div>
    <div class="recommend-card-line inline">
      比分：{{ recommendDetail.score || "--" }}
    </div>
    <div class="recommend-card-line inline">
      结果：<span
        :class="'text-color-' + resultClassMap[recommendDetail.result]"
        >{{
          isEmpty(recommendDetail.result)
            ? resultTextMap[recommendDetail.result]
            : "待"
        }}</span
      >
    </div>
  </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  name: "RecommendCard",
  props: {
    recommendDetail: {
      type: Object,
      default() {
        return {};
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
  methods: {
    isEmpty,
  },
};
</script>

<style lang="scss" scoped>
.recommend-card {
  position: relative;
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
}

.recommend-card::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ddd;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.recommend-card:nth-child(even) {
  background-color: #fff;
}

.recommend-card-line {
  font-size: 28px;
}

.recommend-card-line.inline {
  display: inline-block;
  /* vertical-align: middle; */
}

.recommend-card-line.inline + .recommend-card-line.inline {
  margin-left: 32px;
}

.recommend-card-line .text-color-1 {
  color: #e00;
}

.recommend-card-line .text-color-2 {
  color: #093;
}

.recommend-card-line .text-color-3 {
  color: #000;
}
</style>
