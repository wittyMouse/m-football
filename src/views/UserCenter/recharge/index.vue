<template>
  <BasicLayout title="会员中心" show-back>
    <div class="container recharge">
      <div class="scroll-view" ref="scroll">
        <wm-header>会员快速充值</wm-header>

        <wm-table
          :columns="columns"
          :dataSource="dataSource"
          :activeKey="activeKey"
          @change="onOrderChange"
        ></wm-table>

        <button class="recharge-button" @click="onPayClick">立即购买</button>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import Table from "./components/Table";
import { appId } from "@/api/config";
import {
  requestPriceList,
  requestCreateOrder,
  requestJSSDKConfig,
  requestOpenId
} from "@/api";
import columns from "./columns";

export default {
  name: "UserCenterRecharge",
  components: {
    BasicLayout,
    "wm-header": Header,
    "wm-table": Table,
  },
  data() {
    return {
      columns,
      dataSource: [],

      activeKey: "",

      loading: false,
      createOrderLoading: false,
      isAuth: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    /**
     * 获取充值赠送配置列表
     * @param {*} params
     * @param {*} cb
     */
    getPriceList(params, cb) {
      this.loading = true;
      requestPriceList(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 发起支付
     * @param {*} params
     * @param {*} cb
     */
    createOrder(params, cb) {
      this.createOrderLoading = true;
      requestCreateOrder(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.createOrderLoading = false;
        });
    },

    /**
     * 获取 jssdk 授权参数
     */
    getJSSDKConfig(params, cb) {
      requestJSSDKConfig(params).then((res) => {
        if (res.code === 0) {
          cb && cb(res.result);
        }
      });
    },

    /**
     * 切换选中
     * @param {*} e
     */
    onOrderChange(value) {
      if (this.activeKey !== value) {
        this.activeKey = value;
      }
    },

    /**
     * jssdk 授权
     */
    wxConfig(params) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp: params.timestamp, // 必填，生成签名的时间戳
        nonceStr: params.noncestr, // 必填，生成签名的随机串
        signature: params.signature, // 必填，签名
        jsApiList: ["chooseWXPay"], // 必填，需要使用的JS接口列表
      });

      wx.ready(() => {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log("ready");
        if (this.isAuth === "") {
          this.isAuth = "success";
        }
      });

      wx.error((err) => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.error(err);
        this.isAuth = "error";
      });
    },

    /**
     * 调用微信支付
     */
    wxChooseWXPay(params, cb) {
      wx.chooseWXPay({
        timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
        package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: params.paySign, // 支付签名
        success() {
          // 支付成功后的回调函数
          cb && cb();
        },
        fail(err) {
          console.error(err);
        },
      });
    },

    /**
     * 立即购买
     */
    onPayClick() {
      if (this.createOrderLoading) {
        this.$toast("加载中，请稍后");
        return;
      } else if (this.isAuth === "error") {
        this.$toast("无法使用微信支付");
        return;
      } else if (!this.isAuth) {
        this.$toast("正在获取微信支付权限请稍后");
      }

      const openId = window.sessionStorage.getItem("openId");

      const params = {
        token: this.token,
        openId,
        id: this.activeKey,
        env: "official-accounts",
      };

      this.createOrder(params, (res) => {
        this.wxChooseWXPay(res, () => {
          this.$toast("充值成功");
          this.$router.push("/tips?type=success&title=充值成功");
        });
      });
    },
  },
  beforeCreate() {
    const code = window.sessionStorage.getItem('code')
    if (code) {
      requestOpenId({ code, env: "official-accounts" }).then((res) => {
        if (res.code === 0) {
          window.sessionStorage.setItem("openId", res.result);
        }
      }).finally(() => {
          window.sessionStorage.removeItem('code')
      });
    }
  },
  created() {
    const url = location.href.split("#")[0];
    // const url = encodeURIComponent(location.href.split("#")[0]);
    this.getJSSDKConfig({ url }, (res) => {
      this.wxConfig(res);
    });
  },
  mounted() {
    this.getPriceList({ token: this.token }, (res) => {
      this.activeKey = res[0].id;
      this.dataSource = res;
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

.recharge-button {
  display: block;
  margin: 24px auto 0;
  padding: 0;
  border: 0;
  width: 60% !important;
  height: 88px;
  border-radius: 12px;
  font-size: 36px;
  font-weight: normal;
  text-align: center;
  line-height: 88px;
  color: #fff;
  background-color: #e00;
}
</style>
