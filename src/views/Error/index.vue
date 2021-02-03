<template>
  <div class="error">
    <div class="weui_msg">
      <div class="weui_icon_area">
        <img class="weui_icon_info" src="../../assets/info.svg" />
      </div>
      <div class="weui_text_area">
        <h4 class="weui_msg_title">请在微信客户端打开链接</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style lang="scss" scoped>
.error {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  line-height: 1.6;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.weui_msg {
  padding-top: 36px;
  text-align: center;
}
.weui_msg .weui_icon_area {
  margin-bottom: 30px;
  line-height: 0;
}
.weui_msg .weui_icon_info {
  width: 104px;
  height: 104px;
}
.weui_msg .weui_text_area {
  margin-bottom: 25px;
  padding: 0 20px;
}
.weui_msg .weui_msg_title {
  margin-bottom: 5px;
  font-weight: 400;
  font-size: 20px;
}
.weui_msg .weui_msg_desc {
  font-size: 14px;
  color: #888;
}
</style>
