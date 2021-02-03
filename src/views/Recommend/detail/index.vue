<template>
  <BasicLayout title="王牌推介" show-back @login="onLogin" @logout="onLogout">
    <div class="container recommend-detail">
      <div class="scroll-view" ref="scroll" @scroll="onScroll">
        <wm-header>总部线人报料</wm-header>

        <AuthorInfo
          :resultClassMap="resultClassMap"
          :resultTextMap="resultTextMap"
          :authorInfo="authorInfo"
        />

        <div class="divider"></div>

        <div class="recommend-list">
          <RecommendCard
            :resultClassMap="resultClassMap"
            :resultTextMap="resultTextMap"
            :recommendDetail="item"
            v-for="item in dataSource"
            :key="item.id"
          />

          <div
            class="recommend-detail-empty"
            v-show="!showLoading && showNoData"
          >
            暂无数据…
          </div>

          <div
            class="recommend-detail-load-more"
            v-show="dataSource.length > 0 && showMoreLoading"
          >
            加载中...
          </div>

          <div
            class="recommend-detail-no-data"
            v-show="dataSource.length > 0 && showNoMore"
          >
            - 没有更多了 -
          </div>
        </div>
      </div>

      <SubmitBar
        :authorInfo="authorInfo"
        :currentType.sync="currentType"
        @buy="onBuyClick"
        @car="onCarClick"
      />

      <TipsModal
        :visible="tipsModalVisible"
        :userInfo="userInfo"
        :authorInfo="authorInfo"
        :currentType="currentType"
        @submit="onBuySubmit"
        @close="onTipsModalClose"
      />
    </div>
  </BasicLayout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import AuthorInfo from "./components/AuthorInfo";
import RecommendCard from "./components/RecommendCard";
import SubmitBar from "./components/SubmitBar";
import TipsModal from "./components/TipsModal";
import throttle from "lodash/throttle";
import {
  requestUserInfo,
  requestAuthorInfo,
  requestRecommendList,
  requestSubscribe,
} from "@/api";

const resultClassMap = {
  "-2": 3,
  "-1": 3,
  0: 2,
  1: 1,
  2: 1,
};
const resultTextMap = {
  "-2": "负",
  "-1": "负",
  0: "走",
  1: "胜",
  2: "胜",
};

export default {
  name: "RecommendDetail",
  components: {
    BasicLayout,
    "wm-header": Header,
    AuthorInfo,
    RecommendCard,
    SubmitBar,
    TipsModal,
  },
  data() {
    this.onScroll = throttle(this.onScroll, 100);

    return {
      resultTextMap,
      resultClassMap,

      authorInfoLoading: false,
      authorInfo: {},

      recommendListLoading: false,
      dataSource: [],

      // 当前选中套餐
      currentType: 0,

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

      tipsModalVisible: false,

      scrollHeight: 0,

      scrollToLower: false,
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),
  },
  methods: {
    ...mapActions(["updateUserInfo"]),

    /**
     * 获取用户信息
     * @param {*} params
     * @param {*} cb
     */
    getUserInfo(params, cb) {
      this.userInfoLoading = true;
      requestUserInfo(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.userInfoLoading = false;
        });
    },

    /**
     * 根据部门 Id 获取用户信息
     * @param {*} params
     * @param {*} cb
     */
    getAuthorInfo(params, cb) {
      this.authorInfoLoading = true;
      requestAuthorInfo(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.authorInfoLoading = false;
        });
    },

    /**
     * 获取至尊推荐分页列表
     * @param {*} params
     * @param {*} cb
     */
    getRecommendList(params, cb, fn) {
      requestRecommendList(params)
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
     * 至尊推介订购
     * @param {*} params
     * @param {*} cb
     */
    subscribe(params, cb) {
      this.subscribeLoading = true;
      requestSubscribe(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb();
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.subscribeLoading = false;
        });
    },

    /**
     * 提交前的校验
     */
    beforeSubmit(cb) {
      if (!this.token) {
        this.$toast("请先登录");
        return;
      }

      this.getAuthorInfo({ token: this.token, userId: this.id }, (res) => {
        this.authorInfo = res;

        if (res.isSubscribe) {
          this.$toast("王牌推介订阅还在有效期内");
          return;
        }

        cb && cb(res);
      });
    },

    /**
     * 加车
     */
    onCarClick() {
      this.beforeSubmit((authorInfo) => {
        const newOrder = {
          id: authorInfo.id,
          realname: authorInfo.realname,
          type: this.currentType,
          dayAmount: authorInfo.dayAmount,
          weekAmount: authorInfo.weekAmount,
          monthAmount: authorInfo.monthAmount,
        };

        let orderList = window.localStorage.getItem(
          `${this.userInfo.id}-orderList`
        );

        if (orderList) {
          orderList = JSON.parse(orderList);
          let order = {};
          let idx = -1;
          for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].id === newOrder.id) {
              order = orderList[i];
              idx = i;
              break;
            }
          }

          if (idx > -1) {
            if (order.type === newOrder.type) {
              this.$toast("该订单已在购物车");
              return;
            } else {
              orderList[idx] = newOrder;
            }
          } else {
            orderList.push(newOrder);
          }
        } else {
          orderList = [newOrder];
        }

        window.localStorage.setItem(
          `${this.userInfo.id}-orderList`,
          JSON.stringify(orderList)
        );

        this.$toast("已添加到购物车");
      });
    },

    /**
     * 购买
     */
    onBuyClick() {
      this.beforeSubmit(() => {
        this.tipsModalVisible = true;
      });
    },

    /**
     * 确认购买
     */
    onBuySubmit() {
      this.subscribe(
        { token: this.token, type: this.currentType, userId: this.id },
        () => {
          this.onTipsModalClose();

          this.getUserInfo({ token: this.token }, (res) => {
            this.updateUserInfo(res);
          });

          let orderList = window.localStorage.getItem(
            `${this.userInfo.id}-orderList`
          );
          if (orderList) {
            orderList = JSON.parse(orderList);
            orderList = orderList.filter((item) => item.id !== this.id);
            window.localStorage.setItem(
              `${this.userInfo.id}-orderList`,
              JSON.stringify(orderList)
            );
          }

          this.$router.push("/tips?type=success&title=订阅成功");
        }
      );
    },

    /**
     * 关闭确认框
     */
    onTipsModalClose() {
      this.tipsModalVisible = false;
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
      this.getRecommendList(
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

    pageInit(id) {
      this.getAuthorInfo({ token: this.token, userId: id }, (res) => {
        this.authorInfo = res;
      });

      const params = {
        pageNo: 1,
        pageSize: 10,
        token: this.token,
        userId: id,
      };

      this.showLoading = true;
      this.getRecommendList(
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

    /**
     * 在当前页面登录
     */
    onLogin() {
      this.showNoData = false;
      this.showMoreLoading = false;
      this.showNoMore = false;
      this.scrollHeight = 0;
      this.scrollToLower = false;
      this.$refs.scroll.scrollTop = 0;

      this.pageInit(this.id);
    },

    /**
     * 在当前页退出
     */
    onLogout() {
      if (this.tipsModalVisible) {
        this.tipsModalVisible = false;
      }

      this.showNoData = false;
      this.showMoreLoading = false;
      this.showNoMore = false;
      this.scrollHeight = 0;
      this.scrollToLower = false;
      this.$refs.scroll.scrollTop = 0;

      this.pageInit(this.id);
    },
  },
  mounted() {
    const { id } = this.$route.query;
    this.id = id;

    this.pageInit(id);
  },
};
</script>

<style lang="scss" scoped>
.recommend-detail {
}

.scroll-view {
  height: calc(100% - 100px);
}

.wm-header {
  font-size: 36px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}

.recommend-detail-empty {
  padding: 40px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.6;
}

.recommend-detail-load-more,
.recommend-detail-no-data {
  padding: 40px 0;
  width: 100%;
  font-size: 28px;
  text-align: center;
  color: #888;
}
</style>
