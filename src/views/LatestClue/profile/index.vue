<template>
  <BasicLayout title="贴士专区" show-back>
    <div class="container latest-clue-profile">
      <div class="scroll-view" ref="scroll" @scroll="onScroll">
        <wm-header>{{ authorInfo.realname }}</wm-header>

        <div class="latest-clue-author-wrapper">
          <LatestClueAuthor :authorInfo="authorInfo" />
        </div>

        <div class="latest-clue-list">
          <LatestClueCard
            :LatestClueDetail="item"
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
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import LatestClueAuthor from "./components/LatestClueAuthor";
import LatestClueCard from "./components/LatestClueCard";
import throttle from "lodash/throttle";
import { requestAuthorInfo, requestArticleListByAuthor } from "@/api";

export default {
  name: "LatestClueProfile",
  components: {
    BasicLayout,
    "wm-header": Header,
    LatestClueAuthor,
    LatestClueCard,
  },
  data() {
    this.onScroll = throttle(this.onScroll, 100);

    return {
      authorInfoLoad: false,
      authorInfo: {},

      dataSource: [],

      // 分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
      },

      // 刷新页面
      reload: false,

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
  methods: {
    /**
     * 获取发布会员详细信息
     * @param {*} params
     * @param {*} cb
     */
    getAuthorInfo(params, cb) {
      this.pageLoading = true;
      requestAuthorInfo(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },

    /**
     * 根据发布人获取文章分页列表
     * @param {*} params
     * @param {*} cb
     */
    getArticleListByAuthor(params, cb, fn) {
      requestArticleListByAuthor(params)
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

    /**
     * 点击卡片
     * @param {*} e
     */
    onCardClick(id) {
      this.$router.push(`/latest-clue/detail?id=${id}`);
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
        userId: this.id,
      };

      this.showMoreLoading = true;
      this.getArticleListByAuthor(
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
  },
  mounted() {
    const { id } = this.$route.query;
    this.id = id;

    this.getAuthorInfo({ token: this.token, userId: id }, (res) => {
      this.authorInfo = res;
    });

    const params = {
      pageNo: 1,
      pageSize: 20,
      token: this.token,
      userId: id,
    };

    this.showLoading = true;
    this.getArticleListByAuthor(
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
  font-size: 36px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}

.latest-clue-author-wrapper {
  width: 100%;
  padding: 20px 2%;
  box-sizing: border-box;
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
