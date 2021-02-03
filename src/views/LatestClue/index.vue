<template>
  <BasicLayout title="贴士专区">
    <div class="container latest-clue">
      <div class="scroll-view" ref="scroll">
        <wm-header>
          <div>最新发布</div>
          <img
            class="latest-clue-detail-header-image"
            :src="assetsURL + '/icon-line.png'"
          />
          <div
            class="latest-clue-detail-header-small-text"
            @click="onTitleClick"
          >
            当日热点
          </div>
        </wm-header>

        <LatestClueAuthor
          :authorList="authorList"
          :picker="picker"
          @picker="onPickerClick"
          @click="onAuthorClick"
        />

        <div class="latest-clue-list">
          <LatestClueCard
            :latestClueDetail="item"
            v-for="(item, index) in dataSource"
            :key="index"
            @click="onCardClick"
          />
        </div>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import LatestClueAuthor from "./components/LatestClueAuthor";
import LatestClueCard from "./components/LatestClueCard";
import { assetsURL } from "@/api/config";
import { requestAuthorInfoList, requestLatestArticleList } from "@/api";

export default {
  name: "LatestClue",
  components: {
    BasicLayout,
    "wm-header": Header,
    LatestClueAuthor,
    LatestClueCard,
  },
  data() {
    return {
      assetsURL,

      authorListLoad: false,
      authorList: [],

      loading: false,
      dataSource: [],

      picker: false,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    // 根据部门 Id 获取用户信息
    getAuthorInfoList(params, cb) {
      this.authorListLoad = true;
      requestAuthorInfoList(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            console.error(res.message);
          }
        })
        .finally(() => {
          this.authorListLoad = false;
        });
    },

    // 最新发布
    getLatestArticleList(params, cb) {
      this.loading = true;
      requestLatestArticleList(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            console.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 点击当日热点跳转到首页的当日热点
     */
    onTitleClick() {
      this.$router.push(`/home?from=${encodeURIComponent("latest-clue")}`);
    },

    /**
     * 点击导航栏
     * @param {*} e
     */
    onPickerClick() {
      this.picker = !this.picker;
    },

    /**
     * 点击作者
     * @param {*} e
     */
    onAuthorClick(id) {
      this.$router.push(`/latest-clue/profile?id=${id}`);
    },

    /**
     * 点击卡片
     * @param {*} e
     */
    onCardClick(id) {
      this.$router.push(`/latest-clue/detail?id=${id}`);
    },
  },
  mounted() {
    this.getAuthorInfoList({ token: this.token, departId: "9" }, (res) => {
      this.authorList = res;
    });

    this.getLatestArticleList(
      {
        token: this.token,
        columnIds: ["3", "524377944060203023"],
      },
      (res) => {
        this.dataSource = res;
      }
    );
  },
};
</script>

<style lang="scss" scoped>
.wm-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}

.latest-clue-detail-header-image {
  display: block;
  width: 4px;
  height: 32px;
  margin: 0 24px;
}

.latest-clue-detail-header-small-text {
  font-size: 24px;
  color: #ffbabc;
}

.latest-clue-list {
}
</style>
