<template>
  <BasicLayout title="贴士专区">
    <div class="container latest-clue">
      <div class="scroll-view" ref="scroll" @scroll="onScroll">
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

          <div class="latest-clue-empty" v-show="!showLoading && showNoData">
            暂无数据…
          </div>

          <div
            class="latest-clue-load-more"
            v-show="dataSource.length > 0 && showMoreLoading"
          >
            加载中...
          </div>

          <div
            class="latest-clue-no-data"
            v-show="dataSource.length > 0 && showNoMore"
          >
            - 没有更多了 -
          </div>
        </div>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import throttle from "lodash/throttle";
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
    this.onScroll = throttle(this.onScroll, 100);

    return {
      assetsURL,

      authorListLoad: false,
      authorList: [],

      dataSource: [],

      picker: false,

      // 分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
      },

      showLoading: false,

      // 没有数据
      showNoData: false,

      // 加载更多数据
      showMoreLoading: false,

      // 没有更多数据
      showNoMore: false,

      scrollHeight: 0,

      scrollToLower: false,
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
    getLatestArticleList(params, cb, fn) {
      requestLatestArticleList(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          fn && fn();
        });
    },

    // 滑动事件
    onScroll(e) {
      // console.log("scrollTop", e.target.scrollTop);
      if (
        this.scrollHeight > 0 &&
        this.scrollHeight - e.target.scrollTop < 50 &&
        this.scrollToLower === false
      ) {
        // console.log("scrollToLower");
        this.scrollToLower = true;

        this.onScrollToLower(() => {
          this.$nextTick(() => {
            this.scrollToLower = false;

            /**
             * Promise 的 finally 回调比 then 回调晚执行，导致 nextTick 执行时 loading 状态还存在
             * 这时候获取的 scroll-view 高度包含 loading 元素的高度，所以延迟 50 毫秒后再获取新的 scroll-view 高度
             */
            setTimeout(() => {
              const { clientHeight, scrollHeight } = this.$refs.scroll;
              this.scrollHeight = scrollHeight - clientHeight;
              this.scrollToLower = false;
            }, 50);
          });
        });
      }
    },

    /**
     * 滑动到底部
     */
    onScrollToLower(cb) {
      const { pageNo, pageSize } = this.pagination;

      if (this.showNoData || this.showNoMore) {
        return;
      }

      const params = {
        pageNo: pageNo + 1,
        pageSize,
        token: this.token,
        columnIds: ["3", "524377944060203023"],
      };

      this.showMoreLoading = true;
      this.getLatestArticleList(
        params,
        (res) => {
          const { current, size, pages, total, records } = res;

          this.pagination = {
            pageNo: current,
            pageSize: size,
            pages,
            total,
          };

          this.dataSource = this.dataSource.concat(records);

          if (current === pages) {
            this.showNoMore = true;
          }

          cb && cb();
        },
        () => {
          this.showMoreLoading = false;
        }
      );
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

    const params = {
      pageNo: 1,
      pageSize: 20,
      token: this.token,
      columnIds: ["3", "524377944060203023"],
    };

    this.showLoading = true;
    this.getLatestArticleList(
      params,
      (res) => {
        const { current, size, pages, total, records } = res;

        this.pagination = {
          pageNo: current,
          pageSize: size,
          pages,
          total,
        };

        this.dataSource = records;

        if (total === 0) {
          this.showNoData = true;
        } else if (current === pages) {
          this.showNoMore = true;
        }

        this.$nextTick(() => {
          const { clientHeight, scrollHeight } = this.$refs.scroll;
          this.scrollHeight = scrollHeight - clientHeight;
        });
      },
      () => {
        this.showLoading = false;
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

.latest-clue-empty {
  padding: 40px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.6;
}

.latest-clue-load-more,
.latest-clue-no-data {
  padding: 40px 0;
  width: 100%;
  font-size: 28px;
  text-align: center;
  color: #888;
}
</style>
