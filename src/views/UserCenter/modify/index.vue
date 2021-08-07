<template>
  <BasicLayout title="会员中心" show-back>
    <div class="container modify">
      <div class="scroll-view" ref="scroll">
        <wm-header>会员资料修改</wm-header>

        <div class="modify-form">
          <form autocomplete="off" @submit.prevent="onSubmit">
            <div class="modify-form-item">
              <div class="modify-form-label">
                <span>用&nbsp;户&nbsp;名:</span>
              </div>
              <div class="modify-form-value">
                <span class="strong-text">{{ userInfo.nickname }}</span>
              </div>
            </div>

            <div class="modify-form-item">
              <div class="modify-form-label">
                <!-- <span class="modify-form-required">*&nbsp;</span> -->
                <span>原密码:</span>
              </div>
              <div class="modify-form-value">
                <input
                  class="modify-form-input"
                  type="password"
                  name="oldPwd"
                  :value="modifyFormData.oldPwd"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="modify-form-item">
              <div class="modify-form-label">
                <!-- <span class="modify-form-required">*&nbsp;</span> -->
                <span>新密码:</span>
              </div>
              <div class="modify-form-value">
                <input
                  class="modify-form-input"
                  type="password"
                  name="newPwd"
                  :value="modifyFormData.newPwd"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="modify-form-item">
              <div class="modify-form-label">
                <!-- <span class="modify-form-required">*&nbsp;</span> -->
                <span>确认新密码:</span>
              </div>
              <div class="modify-form-value">
                <input
                  class="modify-form-input"
                  type="password"
                  name="confirmPwd"
                  :value="modifyFormData.confirmPwd"
                  @input="onFieldInput"
                />
              </div>
            </div>

            <div class="modify-form-item captcha">
              <div class="modify-form-label">
                <span>验&nbsp;证&nbsp;码:</span>
              </div>
              <div class="modify-form-value">
                <input
                  class="modify-form-input"
                  maxlength="4"
                  name="verificationCode"
                  :value="modifyFormData.verificationCode"
                  @input="onFieldInput"
                />
                <input
                  v-show="false"
                  name="verificationKey"
                  :value="modifyFormData.verificationKey"
                />
                <img
                  class="modify-form-captcha"
                  :src="captchaImage"
                  @click="onUpdateCaptcha"
                />
              </div>
            </div>

            <div class="modify-form-item">
              <button class="modify-form-button" type="submit">确定提交</button>
            </div>
          </form>
        </div>

        <div class="divider"></div>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import { requestCaptcha, requestModify } from "@/api";

export default {
  name: "UserCenterModify",
  components: {
    BasicLayout,
    "wm-header": Header,
  },
  data() {
    return {
      submitting: false,

      captchaImage: "",

      modifyFormData: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
        verificationKey: "",
        verificationCode: "",
      },
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),
  },
  methods: {
    /**
     * 获取验证码
     * @param {*} params
     * @param {*} cb
     */
    getCaptcha() {
      const timestamp = Date.now().toString();
      this.captchaLoading = true;
      this.modifyFormData.verificationKey = timestamp;
      requestCaptcha({ timestamp })
        .then((res) => {
          if (res.code === 0) {
            this.captchaImage = res.result;
          }
        })
        .finally(() => {
          this.captchaLoading = false;
        });
    },

    /**
     * 修改会员信息
     * @param {*} params
     * @param {*} cb
     */
    modify(params, cb) {
      this.submitting = true;
      requestModify(params)
        .then((res) => {
          if (res.code === 0) {
            this.$toast("修改成功");
            cb && cb();
          } else {
            this.$toast(res.message);
            this.getCaptcha();
            this.modifyFormData.verificationCode = "";
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
      this.modifyFormData[name] = value;
    },

    /**
     * 更新验证码
     */
    onUpdateCaptcha() {
      this.getCaptcha();
    },

    onSubmit() {
      const {
        oldPwd,
        newPwd,
        confirmPwd,
        verificationCode,
      } = this.modifyFormData;

      if (this.submitting) {
        return;
      }

      if (!oldPwd) {
        this.$toast("请输入原密码");
        return;
      } else if (!newPwd) {
        this.$toast("请输入新密码");
        return;
      } else if (!confirmPwd) {
        this.$toast("请输入确认新密码");
        return;
      } else if (!verificationCode) {
        this.$toast("请输入验证码");
        return;
      }

      const params = {
        ...this.modifyFormData,
        nickname: this.userInfo.nickname,
        channelId: "",
        token: this.token,
      };

      this.modify(params, () => {
        this.$router.push("/tips?type=success&title=修改成功");
      });
    },
  },
  mounted() {
    this.getCaptcha();
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

.modify-form {
  background-color: #fff;
}

.modify-form-item {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  box-sizing: border-box;
}

.modify-form-label {
  flex: 0 0 auto;
  padding: 0 20px 0 0;
  width: 170px;
  font-size: 28px;
  text-align: right;
  box-sizing: border-box;
}

.modify-form-required {
  font-size: 28px;
  color: #f50;
}

.modify-form-value {
  flex: 1 0 auto;
}

.strong-text {
  font-size: 34px;
  line-height: 1.41176471;
  color: #e00;
}

.modify-form-input {
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

.modify-form-input::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 10px;
  border: 1px solid #ddd;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.modify-form-item.captcha .modify-form-input {
  display: inline-block;
  width: 300px;
  vertical-align: middle;
}

.modify-form-captcha {
  margin-left: 10px;
  width: 210px;
  height: 70px;
  vertical-align: middle;
}

.modify-form-text {
  width: 100%;
  padding: 0 30px 12px;
  font-size: 28px;
  text-align: right;
  color: #999;
  box-sizing: border-box;
}

.modify-form-button {
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
</style>
