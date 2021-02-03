<template>
  <BasicLayout title="购物车" show-back>
    <div class="container shop-car">
      <div
        :class="[
          'scroll-view',
          { 'show-submit-bar': dataSource && dataSource.length > 0 },
        ]"
        ref="scroll"
      >
        <wm-header>
          <div class="shop-car-header-layout-left">
            客服热线：<span class="text-strong">400-000-1357</span>
          </div>

          <div class="shop-car-header-layout-right">
            <div class="shop-car-header-text">工作服务时间</div>
            <div class="shop-car-header-text">周一至周日 13:30-21:00</div>
          </div>
        </wm-header>

        <div
          class="shop-car-empty"
          v-show="dataSource && dataSource.length === 0"
        >
          暂无数据…
        </div>

        <div class="shop-car-list">
          <div class="shop-car-item" v-for="item in dataSource" :key="item.id">
            <div class="shop-car-item-layout-left">
              <wm-checkbox
                :checked="selectedRowKeys.includes(item.id)"
                :value="item.id"
                @click="onCheckClick"
              />
            </div>

            <div class="shop-car-item-layout-right">
              <div class="shop-car-item-line">
                专家名称：{{ item.realname }}
              </div>
              <div class="shop-car-item-line">
                服务类型：<span style="color: #e00;">{{
                  orderMap[item.type].label
                }}</span>
              </div>
              <div class="shop-car-item-line">
                消费价格：<span style="color: #e00;">{{
                  item.type === 3
                    ? item[orderMap[item.type].prop] * 10
                    : item[orderMap[item.type].prop]
                }}</span>
                {{ orderMap[item.type].unit }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="shop-car-no-data"
          v-show="dataSource && dataSource.length > 0"
        >
          - 没有更多了 -
        </div>

        <SubmitBar
          :visible="dataSource && dataSource.length > 0"
          :checkAll="checkAll"
          :total="total"
          :totalPoints="totalPoints"
          @checkAll="onCheckAll"
          @delete="onDeleteClick"
          @submit="onSubmitClick"
        />
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import Checkbox from "@/components/Checkbox";
import SubmitBar from "./components/SubmitBar";
import { requestUserInfo, requestBatchSubscribe } from "@/api";

const orderMap = {
  0: {
    label: "单日",
    prop: "dayAmount",
    unit: "金币",
  },
  1: {
    label: "包周",
    prop: "weekAmount",
    unit: "金币",
  },
  3: {
    label: "单日积分",
    prop: "dayAmount",
    unit: "积分",
  },
};

export default {
  name: "ShopCar",
  components: {
    BasicLayout,
    "wm-header": Header,
    "wm-checkbox": Checkbox,
    SubmitBar,
  },
  data() {
    return {
      dataSource: [],

      orderMap,

      // 选中项的 key 数组
      selectedRowKeys: [],

      // 全选
      checkAll: false,

      userInfoLoading: false,

      submitting: false,
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),
    total() {
      let sum = 0;
      this.dataSource.forEach((item) => {
        const { id, type, dayAmount, weekAmount } = item;
        if (this.selectedRowKeys.includes(id)) {
          if (type === 0 || type === 1) {
            sum += type === 0 ? dayAmount : weekAmount;
          }
        }
      });
      return sum;
    },
    totalPoints() {
      let sum = 0;
      this.dataSource.forEach((item) => {
        const { id, type, dayAmount } = item;
        if (this.selectedRowKeys.includes(id)) {
          if (type === 3) {
            sum += dayAmount * 10;
          }
        }
      });
      return sum;
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
     * 至尊推介订阅批量下单
     * @param {*} params
     * @param {*} cb
     */
    batchSubscribe(params, cb) {
      this.submitting = true;
      requestBatchSubscribe(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb();
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    /**
     * 点击多选框
     * @param {*} e
     */
    onCheckClick(value) {
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
        this.selectedRowKeys = this.dataSource.map((item) => {
          return item.id;
        });
      }
      this.checkAll = !this.checkAll;
    },

    /**
     * 删除
     */
    onDeleteClick() {
      if (this.selectedRowKeys.length === 0) {
        this.$toast("请先选择订单");
        return;
      }

      const orderList = this.dataSource.filter(
        (item) => !this.selectedRowKeys.includes(item.id)
      );
      this.dataSource = orderList;
      this.selectedRowKeys = [];

      if (this.checkAll) {
        this.checkAll = false;
      }

      window.localStorage.setItem(
        `${this.userInfo.id}-orderList`,
        JSON.stringify(orderList)
      );
    },

    /**
     * 结算
     */
    onSubmitClick() {
      if (this.submitting) {
        return;
      }

      if (this.selectedRowKeys.length === 0) {
        this.toast("请先选择订单");
        return;
      }

      this.getUserInfo({ token: this.token }, (userInfo) => {
        this.updateUserInfo(userInfo);
        if (userInfo.balance - this.total >= 0) {
          const subscribeList = [];
          const orderList = []; // 剩余订单
          this.dataSource.forEach((item) => {
            if (this.selectedRowKeys.includes(item.id)) {
              subscribeList.push({
                userId: item.id,
                type: item.type,
              });
            } else {
              orderList.push(item);
            }
          });

          const params = {
            token: this.token,
            subscribeList,
          };

          this.batchSubscribe(params, () => {
            this.getUserInfo({ token: this.token }, (userInfo) => {
              this.updateUserInfo(userInfo);
            });

            if (orderList.length > 0) {
              window.localStorage.setItem(
                `${userInfo.id}-orderList`,
                JSON.stringify(orderList)
              );
            } else {
              window.localStorage.removeItem(`${userInfo.id}-orderList`);
            }

            this.dataSource = orderList;
            this.selectedRowKeys = [];

            if (this.checkAll) {
              this.checkAll = false;
            }

            this.$router.push("/tips?type=success&title=订阅成功");
          });
        } else {
          this.$toast("余额不足，请充值");
        }
      });
    },

    /**
     * 获取数据
     */
    getDataSource() {
      let orderList = window.localStorage.getItem(
        `${this.userInfo.id}-orderList`
      );

      if (orderList) {
        this.dataSource = JSON.parse(orderList);
      }
    },
  },
  mounted() {
    console.log(this.$router);
    this.getDataSource();
  },
};
</script>

<style lang="scss" scoped>
.scroll-view.show-submit-bar {
  height: calc(100% - 88px);
}

.wm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.shop-car-header-layout-left {
  font-size: 24px;
  color: #fff;
  line-height: 80px;
}

.shop-car-header-layout-right {
  font-size: 24px;
  color: #fff;
  line-height: 28px;
}

.text-strong {
  font-size: 36px;
}

.shop-car-empty {
  padding: 40px 0;
  font-size: 32px;
  text-align: center;
  line-height: 1.6;
}

.shop-car-list {
}

.shop-car-item {
  display: flex;
  position: relative;
  padding: 18px 0;
}

.shop-car-item:nth-child(odd) {
  background-color: #fff;
}

.shop-car-item::after {
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

.shop-car-item-layout-left {
  flex: 0 0 10%;
  text-align: center;
  line-height: 0;
}

.shop-car-item-layout-right {
  flex: 0 0 90%;
  line-height: 1.6;
}

.shop-car-item-line {
  font-size: 28px;
}

.shop-car-item-line.inline {
  display: inline-block;
  /* vertical-align: middle; */
}

.shop-car-item-line.inline + .shop-car-item-line.inline {
  margin-left: 32px;
}

.shop-car-no-data {
  padding: 40px 0;
  width: 100%;
  font-size: 28px;
  text-align: center;
  color: #888;
}
</style>
