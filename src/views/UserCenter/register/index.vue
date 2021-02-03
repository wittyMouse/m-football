<template>
  <BasicLayout title="会员中心" show-back>
    <div class="container register">
      <div class="scroll-view" ref="scroll">
        <wm-header>会员注册</wm-header>

        <div class="register-form">
          <form autocomplete="off" @submit.prevent="onSubmit">
            <div class="register-form-item">
              <div class="register-form-label">
                <span class="register-form-required">*&nbsp;</span>
                <span>用&nbsp;户&nbsp;名:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  name="account"
                  :value="registerFormData.account"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="register-form-text">
              可以使用中文，但禁止除[@][.]以外的特殊符号
            </div>

            <div class="register-form-item">
              <div class="register-form-label">
                <span class="register-form-required">*&nbsp;</span>
                <span>登录密码:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  type="password"
                  name="pwd"
                  :value="registerFormData.pwd"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="register-form-item">
              <div class="register-form-label">
                <span class="register-form-required">*&nbsp;</span>
                <span>确认密码:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  type="password"
                  name="confirmPwd"
                  :value="registerFormData.confirmPwd"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="register-form-item mobile">
              <div class="register-form-label">
                <span class="register-form-required">*&nbsp;</span>
                <span>手机号码:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  type="number"
                  name="mobile"
                  :value="registerFormData.mobile"
                  @input="onFieldInput"
                />
                <div
                  class="register-form-mobile"
                  hover-class="mobile-button"
                  @click="onGetCaptcha"
                >
                  获取验证码
                </div>
              </div>
            </div>

            <div class="register-form-item captcha">
              <div class="register-form-label">
                <span class="register-form-required">*&nbsp;</span>
                <span>验&nbsp;证&nbsp;码:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  type="number"
                  maxlength="6"
                  name="verificationCode"
                  :value="registerFormData.verificationCode"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="register-form-item">
              <div class="register-form-label">
                <span>渠&nbsp;&nbsp;道:</span>
              </div>
              <div class="register-form-value">
                <input
                  class="register-form-input"
                  name="channelId"
                  readonly
                  :value="channelMap[registerFormData.channelId]"
                  @click="onSelectModalOpen"
                />
              </div>
            </div>

            <div class="register-form-item">
              <button class="register-form-button" type="submit">
                确定提交
              </button>
            </div>
          </form>
        </div>

        <div class="divider"></div>
      </div>

      <TipsModal
        :visible="captchaModalVisible"
        :mobile="registerFormData.mobile"
        @submit="onCaptchaModalSubmit"
        @close="onCaptchaModalClose"
      />

      <SelectModal :visible="selectModalVisible" @close="onSelectModalClose">
        <div class="channel-list">
          <div
            :class="[
              'channel-item',
              { border: index !== channelList.length - 1 },
            ]"
            v-for="(item, index) in channelList"
            :key="item.channelId"
            @click="onSelect(item.channelId)"
          >
            {{ item.channelName }}
          </div>
        </div>
      </SelectModal>
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import TipsModal from "./components/TipsModal";
import SelectModal from "./components/SelectModal";
import { requestChannelList, requestPhoneCode, requestRegister } from "@/api";

export default {
  name: "UserCenterRegister",
  components: {
    BasicLayout,
    "wm-header": Header,
    TipsModal,
    SelectModal,
  },
  data() {
    return {
      submitting: false,

      registerFormData: {
        account: "",
        pwd: "",
        confirmPwd: "",
        mobile: "",
        verificationCode: "",
        channelId: "",
      },

      captchaModalVisible: false,

      phoneCodeLoading: false,

      channelListLoading: false,
      channelList: [],

      selectModalVisible: false,
    };
  },
  computed: {
    channelMap() {
      const channelMap = {};
      this.channelList.forEach((item) => {
        channelMap[item.channelId] = item.channelName;
      });
      return channelMap;
    },
  },
  methods: {
    /**
     * 获取渠道列表
     */
    getChannelList(cb) {
      this.channelListLoading = true;
      requestChannelList()
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          }
        })
        .finally(() => {
          this.channelListLoading = false;
        });
    },

    /**
     * 发送短信验证码
     * @param {*} params
     * @param {*} cb
     */
    getPhoneCode(params, cb) {
      this.phoneCodeLoading = true;
      requestPhoneCode(params)
        .then((res) => {
          if (res.code === 0) {
            this.$toast("验证码已发送");
            cb && cb();
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.phoneCodeLoading = false;
        });
    },

    /**
     * 注册
     * @param {*} params
     * @param {*} cb
     */
    register(params, cb) {
      this.submitting = true;
      requestRegister(params)
        .then((res) => {
          if (res.code === 0) {
            this.$toast("注册成功");
            cb && cb();
          } else {
            this.$toast(res.message);
            this.registerFormData.verificationCode = "";
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },

    /**
     * 输入事件
     */
    onFieldInput(e) {
      const { name, value } = e.target;
      this.registerFormData[name] = value;
    },

    /**
     * 获取验证码
     */
    onGetCaptcha() {
      if (!this.registerFormData.mobile) {
        this.$toast("请先输入手机号");
        return;
      }
      this.captchaModalVisible = true;
    },

    /**
     * 关闭弹窗
     */
    onCaptchaModalClose() {
      this.captchaModalVisible = false;
    },

    /**
     * 弹窗提交
     */
    onCaptchaModalSubmit(values) {
      this.getPhoneCode(values, () => {
        this.onCaptchaModalClose();
      });
    },

    /**
     * 打开选择框
     */
    onSelectModalOpen() {
      this.selectModalVisible = true;
    },

    /**
     * 关闭选择框
     */
    onSelectModalClose() {
      this.selectModalVisible = false;
    },

    /**
     * 渠道选择
     */
    onSelect(channelId) {
      if (channelId !== this.registerFormData.channelId) {
        this.registerFormData.channelId = channelId;
      }
      this.onSelectModalClose();
    },

    /**
     * 提交表单
     */
    onSubmit() {
      const {
        account,
        pwd,
        confirmPwd,
        mobile,
        verificationCode,
      } = this.registerFormData;

      if (this.submitting) {
        return;
      }

      if (!account) {
        this.$toast("请输入用户名");
        return;
      } else if (!pwd) {
        this.$toast("请输入登录密码");
        return;
      } else if (!confirmPwd) {
        this.$toast("请输入确认密码");
        return;
      } else if (!mobile) {
        this.$toast("请输入手机号码");
        return;
      } else if (!verificationCode) {
        this.$toast("请输入手机验证码");
        return;
      }

      const params = {
        ...this.registerFormData,
        nickname: this.registerFormData.account,
        verificationKey: this.registerFormData.mobile,
      };

      this.register(params, () => {
        this.$router.push("/tips?type=success&title=注册成功");
      });
    },
  },
  mounted() {
    this.getChannelList((res) => {
      this.channelList = res;
    });
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

.register-form {
  background-color: #fff;
}

.register-form-item {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  box-sizing: border-box;
}

.register-form-label {
  flex: 0 0 auto;
  padding: 0 20px 0 0;
  width: 170px;
  font-size: 28px;
  text-align: right;
  box-sizing: border-box;
}

.register-form-required {
  font-size: 28px;
  color: #f50;
}

.register-form-value {
  flex: 1 0 auto;
}

.register-form-input {
  position: relative;
  padding: 0 20px;
  border: 1px solid #ddd;
  width: 520px;
  height: 80px;
  border-radius: 10px;
  font-size: 28px;
  color: #555;
  box-sizing: border-box;
}

.register-form-input::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 10px;
  border: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.register-form-item.mobile .register-form-input {
  display: inline-block;
  width: 300px;
  vertical-align: middle;
}

.register-form-mobile {
  display: inline-block;
  margin-left: 10px;
  width: 210px;
  height: 70px;
  border-radius: 10px;
  vertical-align: middle;
  font-size: 28px;
  text-align: center;
  line-height: 70px;
  color: #fff;
  background-color: #e00;
}

.mobile-button {
  background-color: #900;
}

/* .register-form-item.captcha .register-form-input {
  display: inline-block;
  width: 300px;
  vertical-align: middle;
}

.register-form-captcha {
  margin-left: 10px;
  width: 210px;
  height: 70px;
  vertical-align: middle;
} */

.register-form-text {
  width: 100%;
  padding: 0 30px 12px;
  font-size: 28px;
  text-align: right;
  color: #999;
  box-sizing: border-box;
}

.register-form-button {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  width: 100% !important;
  height: 92px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: normal;
  text-decoration: none;
  color: #fff;
  line-height: 92px;
  background-color: #ee0000;
}

.channel-list {
  background-color: #fff;
}

.channel-item {
  position: relative;
  padding: 48px 64px;
}

.channel-item::before {
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

.channel-item:active::before {
  opacity: 0.15;
}

.channel-item::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 0;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.channel-item.border::after {
  border-bottom: 1px solid #ddd;
}
</style>
