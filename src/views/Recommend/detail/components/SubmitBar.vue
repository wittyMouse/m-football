<template>
  <div class="submit-bar">
    <div class="submit-bar-list">
      <div
        :class="['submit-bar-item', { active: currentType === item.type }]"
        v-for="item in orderTypeList"
        :key="item.type"
        @click="onChange(item.type)"
      >
        <div class="submit-bar-label">{{ item.label }}</div>
        <div class="submit-bar-value">{{ getValue(item) }}{{ item.unit }}</div>
      </div>
    </div>
    <div class="submit-bar-button-group">
      <button class="submit-bar-button" @click="onClick('buy')">
        立即订购
      </button>
      <button class="submit-bar-button" @click="onClick('car')">
        加入购物车
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubmitBar",
  props: {
    authorInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    currentType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      orderTypeList: [
        {
          type: 0,
          label: "单日",
          value: "dayAmount",
          unit: "币",
        },
        {
          type: 1,
          label: "包周",
          value: "weekAmount",
          unit: "币",
        },
        {
          type: 3,
          label: "单日积分",
          value: "dayAmount",
          unit: "积分",
        },
      ],
    };
  },
  methods: {
    getValue(item) {
      if (item.type === 3) {
        return this.authorInfo[item.value]
          ? this.authorInfo[item.value] * 10
          : 0;
      } else {
        return this.authorInfo[item.value] || 0;
      }
    },

    // 切换订单类型
    onChange(type) {
      if (this.currentType !== type) {
        this.$emit("update:currentType", type);
      }
    },

    // 点击按钮
    onClick(target) {
      this.$emit(target);
    },
  },
};
</script>

<style lang="scss" scoped>
.submit-bar {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 86px;
  z-index: 10;
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  height: 100px;
  border-top: 2px solid #ddd;
  font-size: 24px;
  line-height: 1.6;
  background-color: #555;
}

.submit-bar-list {
  display: flex;
  flex: 1 0 auto;
}

.submit-bar-item {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding-right: 10px;
  width: 140px;
  height: 100px;
  text-align: center;
  line-height: 1.41176471;
  box-sizing: border-box;
}

.submit-bar-item:not(:last-child) {
  border-right: 2px solid #666;
}

.submit-bar-item.active::after {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background-image: url("https://www.df1668.com/images/check02.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

.submit-bar-label {
  font-size: 24px;
  color: #fff;
}

.submit-bar-value {
  font-size: 26px;
  color: #ffee00;
}

.submit-bar-button-group {
  flex: 0 0 auto;
  display: flex;
  width: 330px;
  height: 100%;
}

.submit-bar-button {
  position: relative;
  margin: 0;
  padding: 0;
  border: 0;
  width: 50%;
  height: 100%;
  border-radius: 0;
  font-size: 28px;
  font-weight: normal;
  line-height: 100px;
  color: #fff;
  background-color: #f50;
}

.submit-bar-button:first-child {
  background-color: #e00;
}
</style>
