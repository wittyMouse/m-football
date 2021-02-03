<template>
  <BasicLayout title="重大利好">
    <div class="container best-news">
      <div class="scroll-view" ref="scroll">
        <div class="best-news-inner">
          <div v-html="dataSource.content || ''"></div>
        </div>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "@/layouts/BasicLayout";
import { requestBestNews } from "@/api";

export default {
  name: "BestNews",
  components: {
    BasicLayout,
  },
  data() {
    return {
      dataSource: {},
    };
  },
  methods: {
    // 获取重大利好数据
    getBestNews() {
      requestBestNews({ id: 1 }).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.result;
        } else {
          console.error(res.message);
        }
      });
    },
  },
  mounted() {
    this.getBestNews();
  },
};
</script>

<style lang="scss" scoped>
.best-news {
}

.best-news-inner {
  width: 100%;
  padding: 20px 20px 54px;
  box-sizing: border-box;
}

.best-news-background-image {
  display: block;
  width: 100%;
}
</style>
