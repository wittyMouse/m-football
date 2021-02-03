<template>
  <div class="latest-clue-card" @click="onClick(LatestClueDetail.articleId)">
    <div class="latest-clue-card-content">
      <span>[{{ LatestClueDetail.realName }}]&nbsp;&nbsp;</span>
      <span class="latest-clue-card-title-text">
        {{ LatestClueDetail.articleTitle }}
      </span>
    </div>
    <div class="latest-clue-card-footer">
      <div class="latest-clue-card-footer-text" style="color: #e00;">
        所需金币：{{ LatestClueDetail.amount }}
      </div>
      <div class="latest-clue-card-footer-text">
        <span>时间：{{ formatDate(LatestClueDetail.publicationTime) }}</span>
        <span>点击：{{ LatestClueDetail.clickNum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LatestClueCard",
  props: {
    LatestClueDetail: {
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
.latest-clue-card {
  padding: 20px;
}

.latest-clue-card:nth-child(odd) {
  background-color: #fff;
}

.latest-clue-card-content {
  font-size: 28px;
  color: #333;
}

.latest-clue-card-title-text {
  font-size: 28px;
  color: #888;
}

.latest-clue-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 0;
}

.latest-clue-card-footer-text {
  font-size: 24px;
  color: #aaa;
  line-height: 32px;
}
</style>
