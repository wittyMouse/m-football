<template>
  <wm-popup
    :visible="visible"
    @close="handlePopupClose"
    @closed="handlePopupClosed"
  >
    <wm-Login ref="login" @login="$emit('login')" v-show="!isLogin" />

    <div class="wm-menu" v-show="isLogin">
      <!-- <div class="wm-menu-welcome">
        <div class="wm-menu-welcome-item">
          <div class="wm-menu-welcome-text">
            你好！<span class="wm-menu-high-light-text">{{
              userInfo.nickname
            }}</span>
          </div>
        </div>

        <div class="wm-menu-welcome-item">
          <div class="wm-menu-welcome-text">
            当前金币数量：<span class="wm-menu-high-light-text">{{
              userInfo.balance
            }}</span>
            ，积分：<span class="wm-menu-high-light-text">{{
              userInfo.integral
            }}</span>
          </div>
        </div>

        <div class="wm-menu-welcome-item">
          <button class="wm-menu-button" @click="onLogOut">退出</button>
        </div>
      </div> -->

      <div class="wm-menu-welcome">
        <div class="wm-menu-welcome-item">
          <img class="wm-menu-welcome-image" :src="userInfo.avatar" />
        </div>

        <div class="wm-menu-welcome-item">
          <div class="wm-menu-welcome-text">
            你好！<span class="wm-menu-high-light-text">{{
              userInfo.nickname
            }}</span>
          </div>

          <div class="wm-menu-welcome-text">
            当前金币数量：<span class="wm-menu-high-light-text">{{
              userInfo.balance
            }}</span>
            ，积分：<span class="wm-menu-high-light-text">{{
              userInfo.integral
            }}</span>
          </div>
        </div>

        <div class="wm-menu-welcome-item">
          <button class="wm-menu-button" @click="onLogOut">退出</button>
        </div>
      </div>

      <div class="wm-menu-list">
        <div class="wm-menu-item" @click="onMenuClick('record', 'recharge')">
          <span>充值与消费记录</span>
        </div>
        <div class="wm-menu-item" @click="onMenuClick('record', 'clue')">
          <span>贴士专区订单</span>
        </div>
        <div class="wm-menu-item" @click="onMenuClick('record', 'recommend')">
          <span>王牌推介订单</span>
        </div>
        <div class="wm-menu-item" @click="onMenuClick('record', 'journal')">
          <span>所有流水记录</span>
        </div>
        <div class="wm-menu-item" @click="onMenuClick('modify')">
          <span>会员资料修改</span>
        </div>
        <div class="wm-menu-item" @click="onMenuClick('recharge')">
          <img class="wm-menu-coin-icon" :src="assetsURL + '/icon-add01.png'" />
          <span style="color: #e00;">会员快速充值</span>
        </div>
      </div>
      
      <div class="wm-menu-contact">
        <img class="wm-menu-contact-icon" :src="assetsURL + '/icon-tel.png'" />
        <span class="wm-menu-contact-text">客服热线：</span>
        <span class="wm-menu-contact-high-light-text">400-000-1357</span>
      </div>
    </div>
  </wm-popup>
</template>

<script>
import { mapState, mapActions } from "vuex";
import isEmpty from "lodash/isEmpty";
import Popup from "../Popup";
import Login from "./components/Login";
import { assetsURL } from "@/api/config";

export default {
  name: "Menu",
  components: {
    "wm-popup": Popup,
    "wm-Login": Login,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      assetsURL,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    isLogin() {
      return !isEmpty(this.userInfo);
    },
  },
  watch: {
    visible(val) {
      if (val && !this.isLogin) {
        this.$refs.login.getCaptcha();
      }
    },
  },
  methods: {
    ...mapActions(["logout"]),

    /**
     * 关闭登录框
     */
    handlePopupClose() {
      this.$emit("update:visible", false);
    },

    /**
     * 弹窗关闭后
     */
    handlePopupClosed() {
      if (!this.isLogin) {
        this.$refs.login.resetForm();
      }
    },

    /**
     * 退出
     */
    onLogOut() {
      this.logout();
      if (this.path !== "/home") {
        this.$router.push("/home");
      } else {
        this.$refs.login.getCaptcha();
      }
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
        case "modify":
          this.$router.push("/user-center/modify");
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-popup-wrapper::v-deep .wm-popup {
  bottom: 86px;
}

.wm-menu {
}

.wm-menu-welcome {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  // text-align: center;
}

.wm-menu-welcome-item {
  // display: inline-block;
  // vertical-align: middle;
}

.wm-menu-welcome-item:nth-of-type(2) {
  flex: 1;
}

.wm-menu-welcome-image {
  // margin-right: 20px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.wm-menu-welcome-item:not(:last-child) {
  padding-right: 20px;
}

.wm-menu-welcome-text {
  font-size: 26px;
  // text-align: center;
  // line-height: 92px;
}

.wm-menu-high-light-text {
  font-weight: bold;
  color: #e00;
}

.wm-menu-button {
  display: block;
  margin: 0 auto;
  padding: 0;
  border: 0;
  outline: none;
  width: 104px !important;
  height: 72px;
  border-radius: 12px;
  font-size: 28px;
  font-weight: normal;
  color: #fff;
  line-height: 72px;
  background-color: #000;
}

.wm-menu-list {
  position: relative;
  width: 100%;
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
  font-size: 24px;
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

.wm-menu-contact {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  line-height: 100px;
}

.wm-menu-contact-icon {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}

.wm-menu-contact-text {
  font-size: 32px;
  color: #555;
}

.wm-menu-contact-high-light-text {
  font-size: 40px;
  font-weight: bold;
  color: #e00;
}
</style>
