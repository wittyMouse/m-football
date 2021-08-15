<template>
  <BasicLayout
    ref="layout"
    title="会员中心"
    show-back
    @login="onLogin"
    @logout="onLogout"
  >
    <div class="container user-center">
      <div class="scroll-view" ref="scroll">
        <wm-header>
          <div class="user-center-header-layout-left">
            客服热线：<span class="text-strong">400-000-1357</span>
          </div>

          <div class="user-center-header-layout-right">
            <div class="user-center-header-text">工作服务时间</div>
            <div class="user-center-header-text">周一至周日 13:30-21:00</div>
          </div>
        </wm-header>

        <RecordWelcome :userInfo="userInfo" />

        <div class="divider"></div>

        <div class="user-center-panel check-in">
          <div class="user-center-panel__header">签到有奖</div>
          <div class="user-center-panel__content">
            <div class="check-in-card">
              <template v-if="checkInInfo.isSignIn">
                <div class="check-in-card__success">
                  你已签到，获取{{ getSignInIntegral(checkInInfo.dayNum) }}积分
                </div>
              </template>
              <template v-else>
                <div class="check-in-card__title">
                  请签到！可获{{
                    getCurrentSignInIntegral(checkInInfo.dayNum)
                  }}积分
                </div>
                <div class="check-in-card__desc">
                  注：签到第7天可获{{
                    signInConfigList.length > 0
                      ? signInConfigList[signInConfigList.length - 1]
                          .donateIntegral
                      : 0
                  }}积分，每周共{{ total }}积分
                </div>
              </template>

              <div class="check-in-card__content">
                <ul class="coin-bar">
                  <li
                    class="coin-bar-item"
                    v-for="item in signInConfigList"
                    :key="item.id"
                  >
                    <img class="coin-bar-image" :src="getCoinIcon(item)" />
                    {{ item.donateIntegral }}
                  </li>
                </ul>
              </div>
              <div
                :class="[
                  'check-in-card__button',
                  { 'is-check-in': checkInInfo.isSignIn },
                ]"
                @click="handleCheckIn"
              >
                {{ checkInInfo.isSignIn ? "今日已签到" : "签到" }}
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="user-center-panel nav-bar">
          <div class="user-center-panel__header">快捷通道</div>
          <div class="user-center-panel__content">
            <div class="wm-menu-list">
              <div
                class="wm-menu-item"
                @click="onMenuClick('record', 'recharge')"
              >
                <span>充值与消费记录</span>
              </div>
              <div class="wm-menu-item" @click="onMenuClick('record', 'clue')">
                <span>贴士专区订单</span>
              </div>
              <div
                class="wm-menu-item"
                @click="onMenuClick('record', 'recommend')"
              >
                <span>王牌推介订单</span>
              </div>
              <div
                class="wm-menu-item"
                @click="onMenuClick('record', 'journal')"
              >
                <span>所有流水记录</span>
              </div>
              <div class="wm-menu-item" @click="onMenuClick('index')">
                <span style="color: #e00;">签到有奖</span>
              </div>
              <div class="wm-menu-item" @click="onMenuClick('recharge')">
                <img
                  class="wm-menu-coin-icon"
                  :src="assetsURL + '/icon-add01.png'"
                />
                <span style="color: #e00;">会员快速充值</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="divider"></div>

        <div class="user-center-panel user-info">
          <div class="user-center-panel__header">会员资讯</div>
          <div class="user-center-panel__content">
            
          </div>
        </div> -->
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import RecordWelcome from "./record/components/RecordWelcome";
import {
  requestCheckInConfig,
  requestCheckInInfo,
  requestCheckIn,
  requestUserInfo,
} from "@/api";
import { assetsURL } from "@/api/config";

const Unchecked = assetsURL + "/icon-qd02.png";
const Checked = assetsURL + "/icon-qd01.png";

export default {
  name: "UserCenter",
  components: {
    BasicLayout,
    "wm-header": Header,
    RecordWelcome,
  },
  data() {
    return {
      assetsURL,
      signInConfigList: [],
      checkInInfo: {},
      checkInLoading: false,
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),
    total() {
      return this.signInConfigList.reduce(
        (acc, curr) => acc + curr.donateIntegral,
        0
      );
    },
  },
  methods: {
    ...mapActions(["updateUserInfo"]),

    getSignInIntegral(dayNum) {
      if (typeof dayNum !== "undefined" && this.signInConfigList.length > 0) {
        return dayNum % 7 === 0
          ? this.signInConfigList[this.signInConfigList.length - 1]
              .donateIntegral
          : this.signInConfigList[(dayNum % 7) - 1].donateIntegral;
      } else {
        return 0;
      }
    },
    getCurrentSignInIntegral(dayNum) {
      if (typeof dayNum === "undefined") {
        if (this.signInConfigList.length > 0) {
          return this.signInConfigList[0].donateIntegral;
        } else {
          return 0;
        }
      } else {
        if (this.signInConfigList.length > 0) {
          return this.signInConfigList[dayNum % 7].donateIntegral;
        } else {
          return 0;
        }
      }
    },

    getCoinIcon(item) {
      let icon = Unchecked;
      if (
        typeof this.checkInInfo.dayNum !== "undefined" &&
        this.checkInInfo.dayNum !== 0
      ) {
        const result = this.checkInInfo.dayNum % 7;
        if (result === 0 && this.checkInInfo.isSignIn) {
          icon = Checked;
        } else {
          icon = result >= item.dayNum ? Checked : Unchecked;
        }
      }
      return icon;
    },

    /**
     * 获取签到配置
     */
    getCheckInConfig() {
      requestCheckInConfig().then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.signInConfigList = res.result;
        } else {
          this.$toast(res.message);
        }
      });
    },

    /**
     * 签到信息
     */
    getCheckInInfo(data) {
      requestCheckInInfo(data).then((res) => {
        if (res.code === 0) {
          this.checkInInfo = res.result;
        } else {
          this.$toast(res.message);
        }
      });
    },

    /**
     * 签到
     */
    requestCheckIn(data, cb) {
      this.checkInLoading = true;
      requestCheckIn(data)
        .then((res) => {
          if (res.data.code === 0) {
            this.$toast("签到成功");
            cb && cb();
          } else {
            this.$toast(res.data.message);
          }
        })
        .finally(() => {
          this.checkInLoading = false;
        });
    },

    /**
     * 点击签到按钮
     */
    handleCheckIn() {
      if (!this.token) {
        this.$refs.layout.menuVisible = true;
        return;
      }

      if (this.checkInInfo.isSignIn) {
        return;
      }

      if (this.checkInLoading) {
        return;
      }

      this.requestCheckIn({ token: this.token }, () => {
        this.getCheckInInfo({ token: this.token });
        requestUserInfo({ token: this.token }).then((res) => {
          if (res.code === 0) {
            this.updateUserInfo(res.result);
          }
        });
      });
    },

    /**
     * 点击菜单导航
     * @param {*} e
     */
    onMenuClick(target, page) {
      switch (target) {
        case "record":
          if (this.path !== `/user-center/record?target=${page}`) {
            this.$router.push(`/user-center/record?target=${page}`);
          }
          break;
        case "recharge":
          this.$router.push("/user-center/recharge");
          break;
        // case "index":
        //   this.$router.push("/user-center/index");
        //   break;
      }
    },

    /**
     * 在当前页面登录
     */
    onLogin() {
      this.getCheckInInfo({ token: this.token });
    },

    /**
     * 在当前页退出
     */
    onLogout() {},
  },
  mounted() {
    this.getCheckInConfig();
    this.getCheckInInfo({ token: this.token });
  },
};
</script>

<style lang="scss" scoped>
.wm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.user-center-header-layout-left {
  font-size: 24px;
  color: #fff;
  line-height: 80px;
}

.user-center-header-layout-right {
  font-size: 24px;
  color: #fff;
  line-height: 28px;
}

.text-strong {
  font-size: 36px;
}

.wm-menu-list {
  position: relative;
  width: 100%;
  background-color: #fff;
}

.wm-menu-list::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-top: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-menu-item {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: calc(100% / 3);
  height: 90px;
  font-size: 28px;
  text-align: center;
  line-height: 90px;
  color: #555;
  vertical-align: middle;
}

.wm-menu-item::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-menu-item:nth-of-type(3n)::after {
  border-right: 0;
}

.wm-menu-coin-icon {
  width: 36px;
  height: 36px;
  vertical-align: middle;
  margin-right: 8px;
}

.user-center-panel {
  &.check-in {
    .user-center-panel__header {
      background-image: url(https://www.df1668.com/images/icon-m07.png);
    }
  }

  &.nav-bar {
    .user-center-panel__header {
      background-image: url(https://www.df1668.com/images/icon-m05.png);
    }
  }

  &.user-info {
    .user-center-panel__header {
      background-image: url(https://www.df1668.com/images/icon-m06.png);
    }
  }

  &__header {
    background-repeat: no-repeat;
    background-position: 20px center;
    background-size: 48px;
    height: 80px;
    font-size: 32px;
    color: #555;
    line-height: 80px;
    text-indent: 80px;
  }

  &__content {
  }
}

.check-in-card {
  padding: 20px 0;
  background-image: url(https://www.df1668.com/images/bg-qiandao.png);
  background-repeat: no-repeat;
  background-size: 100% auto;

  &__success {
    font-size: 32px;
    font-weight: bolder;
    text-align: center;
    color: #c7000b;
  }

  &__title {
    font-size: 32px;
    font-weight: bolder;
    text-align: center;
  }

  &__desc {
    font-size: 24px;
    text-align: center;
    color: #888;
  }

  &__content {
    padding: 20px 0;

    .coin-bar {
      display: flex;
      margin: 0 auto;
      width: 92%;
      font-size: 28px;
      line-height: 1.6;
    }

    .coin-bar .coin-bar-item {
      flex: 1;
      position: relative;
      text-align: center;
    }

    .coin-bar .coin-bar-item .coin-bar-image {
      display: block;
      margin: 0 auto;
      width: 72px;
      height: 72px;
    }

    .coin-bar .coin-bar-item:before {
      content: " ";
      width: 12px;
      height: 4px;
      background-color: #ccc;
      display: block;
      position: absolute;
      top: 36px;
      right: -6px;
    }

    .coin-bar .coin-bar-item:last-child:before {
      width: 0;
    }
  }

  &__button {
    display: block;
    margin: 0 auto;
    padding: 0;
    border: 0;
    width: 200px;
    height: 72px;
    border-radius: 20px;
    font-size: 32px;
    font-weight: normal;
    text-align: center;
    line-height: 72px;
    color: #fff;
    background-color: #e00;

    &.is-check-in {
      background-color: #aaaaaa;
    }
  }
}
</style>
