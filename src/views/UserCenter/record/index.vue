<template>
  <BasicLayout ref="layout" title="会员中心" show-back>
    <div class="container record">
      <div class="scroll-view" ref="scroll" @scroll="onScroll">
        <RecordWelcome :userInfo="userInfo" />

        <wm-header>{{
          pageData[target] ? pageData[target].title : ""
        }}</wm-header>

        <div class="record-list">
          <RecordCard
            :target="target"
            :recordDetail="item"
            :typeList="typeList"
            :checked="selectedRowKeys.includes(item.id)"
            v-for="item in dataSource"
            :key="item.id"
            @check="onCheckClick"
          />

          <div class="record-empty" v-show="!showLoading && showNoData">
            暂无数据…
          </div>

          <div
            class="record-load-more-tips"
            v-show="dataSource.length > 0 && !showNoMore"
          >
            上拉加载更多
          </div>

          <div
            class="record-load-more"
            v-show="dataSource.length > 0 && showMoreLoading"
          >
            加载中...
          </div>

          <div
            class="record-no-data"
            v-show="dataSource.length > 0 && showNoMore"
          >
            - 没有更多了 -
          </div>
        </div>
      </div>

      <RecordBottomBar
        :dataSource="dataSource"
        :checkAll="checkAll"
        :pagination="pagination"
        @checkAll="onCheckAll"
        @delete="onDeleteClick"
      />
    </div>
  </BasicLayout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import RecordWelcome from "./components/RecordWelcome";
import RecordCard from "./components/RecordCard";
import RecordBottomBar from "./components/RecordBottomBar";
import throttle from "lodash/throttle";
import {
  requestAmountChangeList,
  requestDeleteAmountChange,
  requestSubscribeRecordList,
  requestDeleteSubscribeRecord,
  requestBuyRecordList,
  requestDeleteBuyRecord,
  requestUserInfo,
} from "@/api";

const typeList = ["充值", "购买文章", "至尊推荐"];

export default {
  name: "UserCenterRecord",
  components: {
    BasicLayout,
    "wm-header": Header,
    RecordWelcome,
    RecordCard,
    RecordBottomBar,
  },
  data() {
    this.onScroll = throttle(this.onScroll, 100);

    return {
      typeList,

      // 页面数据
      pageData: {
        recharge: {
          title: "充值与消费记录",
          fn: requestAmountChangeList,
          delete: requestDeleteAmountChange,
        },
        journal: {
          title: "所有流水账记录",
          fn: requestAmountChangeList,
          delete: requestDeleteAmountChange,
        },
        recommend: {
          title: "王牌推介订购记录",
          fn: requestSubscribeRecordList,
          delete: requestDeleteSubscribeRecord,
        },
        clue: {
          title: "贴士专区订购记录",
          fn: requestBuyRecordList,
          delete: requestDeleteBuyRecord,
        },
      },

      // 当前显示页面
      target: "",

      // 选中项的 key 数组
      selectedRowKeys: [],
      // 全选
      checkAll: false,

      // 分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
      },

      // 数据加载状态
      showLoading: false,
      // 没有数据
      showNoData: false,
      // 加载更多数据
      showMoreLoading: false,
      // 没有更多数据
      showNoMore: false,
      // 数据项
      columns: [],
      // 数据源
      dataSource: [],

      scrollHeight: 0,

      scrollToLower: false,

      userInfoLoading: false,
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),
  },
  watch: {
    "$route.query"() {
      this.$refs.layout.currentPath = this.$route.fullPath;
      this.$refs.layout.menuVisible = false;
      this.pageInit();
    },
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
     * 点击多选框
     * @param {*} e
     */
    onCheckClick(value) {
      // console.log(e);
      const idx = this.selectedRowKeys.findIndex((key) => key === value);
      if (idx > -1) {
        // 去除选中
        this.selectedRowKeys.splice(idx, 1);
        if (this.checkAll) {
          this.checkAll = false;
        }
      } else {
        // 选中
        this.selectedRowKeys.push(value);
        if (
          this.selectedRowKeys.length === this.dataSource.length &&
          !this.checkAll
        ) {
          this.checkAll = true;
        }
      }
    },

    /**
     * 全选/取消全选
     */
    onCheckAll() {
      if (this.checkAll) {
        // 取消全选
        this.selectedRowKeys = [];
      } else {
        // 全选
        this.selectedRowKeys = this.dataSource.map((item) => item.id);
      }
      this.checkAll = !this.checkAll;
    },

    /**
     * 删除
     */
    onDeleteClick() {
      if (this.selectedRowKeys.length === 0) {
        this.$toast("请先选择记录");
        return;
      }

      const params = {
        ids: this.selectedRowKeys,
        token: this.token,
      };

      this.deleteLoading = true;
      this.pageData[this.target]
        .delete(params)
        .then((res) => {
          if (res.code === 0) {
            this.getDataSource(this.target);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.deleteLoading = false;
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
        this.scrollToLower = false;
        return;
      }

      const params = {
        pageNo: pageNo + 1,
        pageSize,
        token: this.token,
      };

      this.showMoreLoading = true;
      this.pageData[this.target]
        .fn(params)
        .then((res) => {
          if (res.code === 0) {
            const { current, size, pages, total, records } = res.result;

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
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.showMoreLoading = false;
        });
    },

    /**
     * 获取数据源
     */
    getDataSource(target) {
      if (this.$refs.scroll.scrollTop !== 0) {
        this.$refs.scroll.scrollTop = 0;
      }
      this.scrollHeight = 0;
      this.selectedRowKeys = [];
      if (this.checkAll) {
        this.checkAll = false;
      }
      this.showNoData = false;
      this.showNoMore = false;

      const params = {
        pageNo: 1,
        pageSize: 10,
        token: this.token,
      };

      this.showLoading = true;
      this.pageData[target]
        .fn(params)
        .then((res) => {
          if (res.code === 0) {
            const { current, size, pages, total, records } = res.result;

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
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.showLoading = false;
        });
    },

    /**
     * 页面初始化
     */
    pageInit() {
      const { target } = this.$route.query;
      this.target = target;

      this.getUserInfo({ token: this.token }, (res) => {
        this.updateUserInfo(res);
      });

      this.getDataSource(target);
    },
  },
  mounted() {
    this.pageInit();
  },
};
</script>

<style lang="scss" scoped>
.scroll-view {
  height: calc(100% - 88px);
}

.wm-header {
  font-size: 36px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}

.record-list {
}

.record-empty {
  padding: 40px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.6;
}

.record-load-more-tips {
  position: relative;
  /* margin: 0 auto;
  padding: 40px 0; */
  margin: 40px auto;
  width: 80%;
  height: 80px;
  font-size: 28px;
  text-align: center;
  line-height: 80px;
  color: #888;
  background-color: #f5f5f5;
}

.record-load-more-tips::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 1px solid #ccc;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.record-load-more,
.record-no-data {
  padding: 40px 0;
  width: 100%;
  font-size: 28px;
  text-align: center;
  color: #888;
}
</style>
