<template>
  <div class="wm-login">
    <div class="wm-login-layout-left">
      <div>【 客服热线 】</div>
      <div class="wm-login-number">400-000-1357</div>
    </div>

    <div class="wm-login-layout-right">
      <form autocomplete="off" @submit.prevent="onSubmit">
        <div class="wm-login-form-item account">
          <div class="wm-login-form-input-icon"></div>
          <input
            class="wm-login-form-input"
            name="account"
            :value="loginFormData.account"
            @input="onFieldInput"
          />
        </div>

        <div class="wm-login-form-item password">
          <div class="wm-login-form-input-icon"></div>
          <input
            class="wm-login-form-input"
            type="password"
            name="pwd"
            :value="loginFormData.pwd"
            @input="onFieldInput"
          />
        </div>

        <div class="wm-login-form-item captcha">
          <!-- <div class="wm-login-form-input-icon"></div> -->
          <input
            class="wm-login-form-input"
            maxlength="4"
            name="verificationCode"
            :value="loginFormData.verificationCode"
            @input="onFieldInput"
          />
          <img
            class="wm-login-form-captcha"
            :src="captchaImage"
            @click="onUpdateCaptcha"
          />
        </div>

        <div class="wm-login-form-item">
          <div class="wm-login-form-radio-group-wrapper">
            <div class="wm-login-form-radio-text">有效期：</div>
            <wm-radio-group
              name="type"
              :value="loginFormData.type"
              @change="onFieldChange"
            >
              <wm-radio label="一个月" value="2" />
              <wm-radio label="一周" value="1" />
              <wm-radio label="一天" value="0" />
            </wm-radio-group>
          </div>
        </div>

        <div class="wm-login-form-item">
          <button
            class="wm-login-form-button wm-login-form-button-wechart"
            type="button"
            @click="onWXLogin"
          >
            微信登录
          </button>
          <button class="wm-login-form-button" type="submit">
            账户登录
          </button>
        </div>

        <div class="wm-login-form-item">
          <div class="wm-login-form-link" @click="onRegisterClick">
            立即注册，享受巅峰！
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import RadioGroup from "@/components/RadioGroup";
import Radio from "@/components/Radio";
import { requestCaptcha, requestLogin, requestUserInfo } from "@/api";
import { appId } from "@/api/config";

export default {
  name: "Login",
  components: {
    "wm-radio-group": RadioGroup,
    "wm-radio": Radio,
  },
  data() {
    return {
      loginFormData: {
        account: "",
        pwd: "",
        verificationKey: "",
        verificationCode: "",
        type: "0",
      },
      captchaLoading: false,
      captchaImage: "",
      submitting: false,
    };
  },
  methods: {
    ...mapActions(["updateToken", "updateUserInfo", "logout"]),

    // 获取验证码
    getCaptcha() {
      const timestamp = Date.now() + "";
      this.loginFormData.verificationKey = timestamp;
      this.captchaLoading = true;
      requestCaptcha({ timestamp })
        .then((res) => {
          if (res.code === 0) {
            this.captchaImage = res.result;
          } else {
            console.error(res.message);
          }
        })
        .finally(() => {
          this.captchaLoading = false;
        });
    },

    // 账号登录
    login(params, cb) {
      this.submitting = true;
      requestLogin(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
            this.submitting = false;
          }
        })
        .catch(() => {
          this.submitting = false;
        });
    },

    // 重置表单
    resetForm() {
      this.loginFormData = {
        account: "",
        pwd: "",
        type: "0",
        verificationKey: "",
        verificationCode: "",
      };
      this.captchaImage = "";
    },

    /**
     * 输入事件
     * @param {*} e
     */
    onFieldInput(e) {
      const { name, value } = e.target;
      this.loginFormData[name] = value;
    },

    /**
     * 单选框
     */
    onFieldChange(value) {
      if (value !== this.loginFormData.type) {
        this.loginFormData.type = value;
      }
    },

    /**
     * 更新验证码
     */
    onUpdateCaptcha() {
      if (this.captchaLoading) {
        return;
      }
      this.getCaptcha();
    },

    /**
     * 注册
     */
    onRegisterClick() {
      this.$router.push("/user-center/register");
    },

    /**
     * 微信登录
     */
    onWXLogin() {
      const { origin, pathname } = window.location
      const redirectUri = origin + pathname;
      const callbackUrl = this.$route.fullPath;
      const stateText = `url=${callbackUrl}&target=login`;
      let state = "";
      for (let i = 0; i < stateText.length; i++) {
        state += stateText.charCodeAt(i).toString(16);
      }
      console.log('state-length: ', state.length)
      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
      window.location.href = authUrl;
    },

    /**
     * 提交表单
     */
    onSubmit() {
      const { account, pwd, verificationCode } = this.loginFormData;

      if (this.submitting) {
        return;
      }

      if (!account) {
        this.$toast("请输入用户名");
        return;
      } else if (!pwd) {
        this.$toast("请输入密码");
        return;
      } else if (!verificationCode) {
        this.$toast("请输入验证码");
        return;
      }

      const params = {
        ...this.loginFormData,
        type: Number(this.loginFormData.type),
      };

      this.login(params, (token) => {
        this.updateToken(token);
        requestUserInfo({ token })
          .then((res) => {
            if (res.code === 0) {
              this.updateUserInfo(res.result);
              this.resetForm();
              this.$emit("login");
            } else {
              this.logout();
            }
          })
          .finally(() => {
            this.submitting = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-login {
  display: flex;
  background-image: url("https://www.df1668.com/images/bg-login.jpg");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% auto;
  background-color: #fff;
}

.wm-login-layout-left {
  flex: 0 0 auto;
  padding-top: 340px;
  width: 300px;
  font-size: 24px;
  text-align: center;
  line-height: 40px;
  text-shadow: 0 0 8px #fff, 0 0 8px #fff;
}

.wm-login-number {
  font-size: 40px;
  color: #e00e00;
  font-weight: 600;
}

.wm-login-layout-right {
  flex: 1 0 auto;
  padding: 24px 0;
  box-sizing: border-box;
}

.wm-login-form-item {
  position: relative;
  padding: 6px 0;
}

.wm-login-form-input-icon {
  display: block;
  position: absolute;
  top: 20px;
  left: 12px;
  width: 44px;
  height: 44px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.wm-login-form-item.account .wm-login-form-input-icon {
  background-image: url("https://www.df1668.com/images/icon-login01.png");
}

.wm-login-form-item.password .wm-login-form-input-icon {
  background-image: url("https://www.df1668.com/images/icon-login02.png");
}

.wm-login-form-item.captcha .wm-login-form-input-icon {
  background-image: url("https://www.df1668.com/images/icon-login02.png");
}

.wm-login-form-input {
  padding: 0 12px 0 68px;
  width: 320px;
  height: 72px;
  font-size: 32px;
  color: #888;
  border: 2px solid #ddd;
  background-color: #fff;
  border-radius: 10px;
}

.wm-login-form-item.captcha .wm-login-form-input {
  display: inline-block;
  width: 140px;
  vertical-align: middle;
}

.wm-login-form-captcha {
  margin-left: 12px;
  width: 168px;
  height: 56px;
  vertical-align: middle;
}

.wm-login-form-radio-group-wrapper {
  display: flex;
  align-items: center;
}

.wm-login-form-radio-text {
  font-size: 24px;
  color: #888;
  line-height: 60px;
}

.wm-radio + .wm-radio {
  margin-left: 12px;
}

.wm-login-form-button {
  position: relative;
  display: inline-block;
  margin: 0 auto;
  padding: 0;
  border: 0;
  width: 200px;
  height: 72px;
  border-radius: 20px;
  font-size: 32px;
  font-weight: normal;
  color: #fff;
  line-height: 72px;
  background-color: #c00;
  outline: none;
}

.wm-login-form-button::before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: inherit;
  border-radius: inherit;
  transform: translate(-50%, -50%);
  opacity: 0;
  background-color: #000;
  border-color: #000;
}

.wm-login-form-button:active::before {
  opacity: 0.15;
}

.wm-login-form-button-wechart {
  background-color: #0a0;
}

.wm-login-form-button + .wm-login-form-button {
  margin-left: 8px;
}

.wm-login-form-link {
  position: relative;
  width: 400px;
  height: 70px;
  font-size: 32px;
  text-align: center;
  line-height: 70px;
  color: #e00;
}

.wm-login-form-link::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 2px solid #e00;
  border-radius: 12px;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}
</style>
