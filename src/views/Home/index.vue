<template>
  <BasicLayout title="巅峰足球">
    <div class="container home">
      <div class="scroll-view" ref="scroll">
        <wm-banner :bannerList="bannerList" />

        <div class="divider"></div>

        <wm-tabs :activeKey="activeKey" @change="onTabsChange">
          <wm-tab-item
            :tab="item.columnName"
            :value="item.columnId"
            v-for="item in articleList"
            :key="item.columnId"
          >
            <wm-table
              :columns="columns"
              :dataSource="filter(item.articleInfoList)"
              @click="onArticleClick"
            />
          </wm-tab-item>
        </wm-tabs>

        <div class="divider"></div>

        <RankingList :rankingList="rankingList" />

        <div class="divider"></div>

        <RankingChart :rankingChartData="rankingChartData" />
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import isEmpty from "lodash/isEmpty";
import BasicLayout from "@/layouts/BasicLayout";
import Banner from "./components/Banner";
import Tabs from "./components/Tabs";
import TabItem from "./components/TabItem";
import Table from "./components/Table";
import RankingList from "./components/RankingList";
import RankingChart from "./components/RankingChart";
import {
  requestAdConfigInfo,
  requestArticleList,
  requestRankingList,
  requestRankingChart,
} from "@/api";
import columns from "./columns";

export default {
  name: "Home",
  components: {
    BasicLayout,
    "wm-banner": Banner,
    "wm-tabs": Tabs,
    "wm-tab-item": TabItem,
    "wm-table": Table,
    RankingList,
    RankingChart,
  },
  data() {
    return {
      bannerList: [],
      columns,
      articleList: [],
      activeKey: "",
      rankingList: [],
      rankingChartData: [],
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    filter(list) {
      return list.filter(function(_, index) {
        return index < 10;
      });
    },

    // 获取广告配置信息
    getAdConfigInfo() {
      requestAdConfigInfo().then((res) => {
        // console.log(res);
        if (res.code === 0) {
          if (!isEmpty(res.result) && res.result[0]) {
            this.bannerList = res.result[0] || [];
          }
        } else {
          console.error(res.message);
        }
      });
    },

    // 获取文章分类列表
    getArticleList(params, cb) {
      requestArticleList(params).then((res) => {
        // console.log(res);
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          console.error(res.message);
        }
      });
    },

    // 获取文章分类列表
    getRankingList(params) {
      requestRankingList(params).then((res) => {
        // console.log(res);
        if (res.code === 0) {
          this.rankingList = res.result;
        } else {
          console.error(res.message);
        }
      });
    },

    // 获取文章分类列表
    getRankingChart(params) {
      requestRankingChart(params).then((res) => {
        // console.log(res);
        if (res.code === 0) {
          this.rankingChartData = res.result;
        } else {
          console.error(res.message);
        }
      });
    },

    /**
     * 切换 tabs
     * @param {*} e
     */
    onTabsChange(activeKey) {
      this.activeKey = activeKey;
    },

    /**
     * 点击文章标题
     * @param {*} e
     */
    onArticleClick(id) {
      this.$router.push(`/latest-clue/detail?id=${id}`);
    },
  },
  created() {
    const { from } = this.$route.query;
    this.getAdConfigInfo();
    this.getArticleList({ token: this.token }, (articleList) => {
      this.articleList = articleList;
      if (from) {
        this.activeKey = articleList[1].columnId;
      } else {
        this.activeKey = articleList[0].columnId;
      }
    });
    this.getRankingList({ token: this.token });
    this.getRankingChart({ token: this.token });
  },
};
</script>

<style lang="scss" scoped>
.wm-table-wrapper {
  min-height: 792px;
  padding: 20px 0;
  background-color: #fff;
}
</style>
