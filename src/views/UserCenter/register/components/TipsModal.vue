<template>
  <div class="tips-modal-wrapper" v-if="visible">
    <div class="tips-modal-mask" @click="onClose"></div>
    <div class="tips-modal">
      <form autocomplete="off" @submit.prevent="onSubmit">
        <div class="tips-modal-header">
          <div class="tips-modal-title">验证</div>
        </div>
        <div class="tips-modal-content">
          <div class="captcha-form">
            <div class="captcha-form-label">验证码:</div>
            <div class="captcha-form-value">
              <input
                class="captcha-form-input"
                maxlength="4"
                name="captcha"
                :value="captchaForm.captcha"
                @input="onInput"
              />
              <input
                v-show="false"
                name="checkKey"
                :value="captchaForm.checkKey"
              />
              <img
                class="captcha-form-captcha"
                :src="captchaImage"
                @click="onUpdateCaptcha()"
              />
            </div>
          </div>
        </div>
        <div class="tips-modal-footer">
          <button class="tips-modal-button" type="submit">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { requestCaptcha } from "@/api";

export default {
  name: "TipsModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      captchaImage: "",
      captchaForm: {
        captcha: "",
        checkKey: "",
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.getCaptcha();
      }
    },
  },
  methods: {
    /**
     * 获取验证码
     */
    getCaptcha() {
      this.captchaForm.checkKey = this.mobile;
      this.captchaLoading = true;
      requestCaptcha({ timestamp: this.mobile })
        .then((res) => {
          if (res.code === 0) {
            this.captchaImage = res.result;
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.captchaLoading = false;
        });
    },

    /**
     * 重置
     */
    reset() {
      this.captchaImage = "";
      this.captchaForm = {
        captcha: "",
        checkKey: "",
      };
    },

    /**
     * 关闭
     */
    onClose() {
      this.$emit("close");
      this.reset();
    },

    /**
     * 提交表单
     */
    onSubmit() {
      if (!this.captchaForm.captcha) {
        this.$toast("请输入验证码");
        return;
      }

      this.$emit("submit", this.captchaForm);
    },

    /**
     * 输入事件
     */
    onInput(e) {
      const { name, value } = e.target;
      this.captchaForm[name] = value;
    },

    /**
     * 更新验证码
     */
    onUpdateCaptcha() {
      this.getCaptcha();
    },
  },
};
</script>

<style lang="scss" scoped>
.tips-modal-wrapper {
}

.tips-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.7);
}

.tips-modal {
  position: fixed;
  top: 40%;
  left: 95px;
  z-index: 2000;
  padding: 16px;
  width: 560px;
  border-radius: 12px;
  box-sizing: border-box;
  background-color: #fff;
  transform: translateY(-50%);
}

.tips-modal-header {
}

.tips-modal-title {
  border-radius: 12px;
  font-size: 36px;
  text-align: center;
  line-height: 80px;
  color: #fff;
  background-color: #888;
}

.tips-modal-content {
  padding: 32px 0;
  font-size: 27px;
  text-align: center;
  color: #666;
  line-height: 1.6;
}

.tips-modal-footer {
}

.tips-modal-button {
  display: block;
  margin: 0 auto !important;
  padding: 0;
  border: 0;
  width: 60% !important;
  height: 80px;
  border-radius: 12px;
  font-size: 32px;
  font-weight: normal;
  text-align: center;
  color: #fff;
  line-height: 80px;
  background-color: #d00;
}

.captcha-form {
  display: flex;
  align-items: center;
}

.captcha-form-label {
  flex: 0 0 auto;
  padding: 0 10px 0 0;
  width: 120px;
  font-size: 28px;
  text-align: right;
  box-sizing: border-box;
}

.captcha-form-value {
  flex: 1 0 auto;
}

.captcha-form-input {
  position: relative;
  display: inline-block;
  padding: 0 20px;
  border: 1px solid #ddd;
  width: 230px;
  height: 66px;
  border-radius: 10px;
  text-align: left;
  vertical-align: middle;
  box-sizing: border-box;
}

.captcha-form-input::after {
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

.captcha-form-captcha {
  margin-left: 10px;
  width: 168px;
  height: 56px;
  vertical-align: middle;
}
</style>
