<template>
  <div class="latest-clue-item" @click="onClick(latestClueDetail.articleId)">
    <div class="latest-clue-item-layout-left">
      <img class="latest-clue-item-avatar" :src="latestClueDetail.avatar" />
    </div>
    <div class="latest-clue-item-layout-right">
      <div class="latest-clue-item-content">
        <span>[{{ latestClueDetail.realName }}]&nbsp;</span>
        <span class="latest-clue-item-title-text">
          {{ latestClueDetail.articleTitle }}
        </span>
      </div>
      <div class="latest-clue-item-footer">
        <div class="latest-clue-item-footer-text" style="color: #e00;">
          所需金币：{{ latestClueDetail.amount }}
        </div>
        <div class="latest-clue-item-footer-text">
          <span>
            时间：{{ formatDate(latestClueDetail.publicationTime) }}
          </span>
          <span>点击：{{ latestClueDetail.clickNum }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LatestClueCard",
  props: {
    latestClueDetail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    formatDate(val) {
      if (val) {
        let temp = val.split(" ")[0].split("-");
        return temp[1] + "-" + temp[2];
      }
      return "";
    },

    onClick(id) {
      this.$emit("click", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.latest-clue-item {
  display: flex;
  padding: 20px;
}

.latest-clue-item:nth-child(odd) {
  background-color: #fff;
}

.latest-clue-item-layout-left {
  flex: 0 0 auto;
  width: 112px;
}

.latest-clue-item-avatar {
  display: block;
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.latest-clue-item-layout-right {
  flex: 0 0 auto;
  width: calc(100% - 112px);
}

.latest-clue-item-content {
  font-size: 28px;
  color: #333;
}

.latest-clue-item-title-text {
  font-size: 28px;
  color: #888;
}

.latest-clue-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 0;
}

.latest-clue-item-footer-text {
  font-size: 24px;
  color: #aaa;
  line-height: 32px;
}
</style>
