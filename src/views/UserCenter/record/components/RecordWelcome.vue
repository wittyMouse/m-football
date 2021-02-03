<template>
  <div class="record-welcome">
    <div class="record-welcome-text">
      {{ getCurrentDate() }}好，<span class="text-1">{{
        userInfo.account
      }}</span
      >【身份：注册会员】
    </div>
    <div class="record-welcome-text">
      您拥有金币：<span class="text-1">{{ userInfo.balance }}</span> 个，
      积分：<span class="text-2">{{ userInfo.integral }}</span> 分
    </div>
  </div>
</template>

<script>
export default {
  name: "RecordWelcome",
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    getCurrentDate() {
      var date = new Date();
      var hour = date.getHours();
      if (hour >= 6 && hour < 8) {
        return "早上";
      } else if (hour >= 8 && hour < 11) {
        return "上午";
      } else if (hour >= 11 && hour < 13) {
        return "中午";
      } else if (hour >= 13 && hour < 19) {
        return "下午";
      } else if (hour >= 19 || hour < 6) {
        return "晚上";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.record-welcome {
  padding: 12px 24px;
  background-color: #fff;
}

.record-welcome-text {
  font-size: 28px;
  line-height: 1.6;
}

.record-welcome-text .text-1 {
  font-size: 32px;
  color: #e00;
}

.record-welcome-text .text-2 {
  font-size: 32px;
  color: #093;
}
</style>
