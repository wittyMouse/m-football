<template>
  <div class="submit-bar submit-bar-safe" v-show="visible">
    <div class="submit-bar-item">
      <wm-checkbox
        :checked="checkAll"
        label="全选"
        value="all"
        @click="onCheckAll"
      />
    </div>
    <div class="submit-bar-item">
      <button class="submit-bar-button" @click="onDeleteClick">
        删除
      </button>
    </div>
    <div class="submit-bar-item">
      <div class="submit-bar-price">
        <span
          >共 <span style="color: #e00;">{{ total }}</span> 金币</span
        >
        <span
          >，<span style="color: #e00;">{{ totalPoints }}</span> 积分</span
        >
      </div>
      <button class="submit-bar-pay-button" @click="onPayClick">
        结算
      </button>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/Checkbox";

export default {
  name: "SubmitBar",
  components: {
    "wm-checkbox": Checkbox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    checkAll: {
      type: Boolean,
      default: false,
    },
    total: {
      type: [Number, String],
      default: 0,
    },
    totalPoints: {
      type: [Number, String],
      default: 0,
    },
  },
  methods: {
    onCheckAll() {
      this.$emit("checkAll");
    },

    onDeleteClick() {
      this.$emit("delete");
    },

    onPayClick() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-bar {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 86px;
  width: 100%;
  font-size: 24px;
  background-color: #eee;
  box-sizing: border-box;
}

.submit-bar::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-top: 1px solid #ccc;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.submit-bar-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.submit-bar-item {
  flex: 0 0 auto;
  line-height: 88px;
}

.submit-bar-item:nth-of-type(1) {
  width: 140px;
  text-align: center;
}

.submit-bar-item:nth-of-type(3) {
  flex: 1 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 28px;
}

.wm-checkbox::v-deep {
  .wm-checkbox-inner {
    width: 26px;
    height: 26px;
  }

  .wm-checkbox-text {
    margin-left: 16px;
    font-size: 24px;
    color: #000;
    line-height: inherit;
  }
}

.submit-bar-price {
  padding-right: 18px;
}

.submit-bar-button {
  position: relative;
  display: block;
  margin: 0 auto;
  padding: 0;
  border: 0;
  width: 98px !important;
  height: 52px;
  border-radius: 10px;
  font-size: 28px;
  font-weight: normal;
  color: #fff;
  line-height: 52px;
  background-color: #888;
}

.submit-bar-button::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.submit-bar-pay-button {
  margin: 0;
  padding: 0;
  border: 0;
  width: 120px !important;
  height: 88px;
  border-radius: 0;
  font-size: 32px;
  font-weight: normal;
  text-align: center;
  line-height: 88px;
  color: #fff;
  background-color: #e00;
}
</style>
