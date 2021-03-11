<template>
  <BasicLayout
    ref="layout"
    title="贴士专区"
    show-back
    @login="onLogin"
    @logout="onLogout"
  >
    <div class="container latest-clue-detail">
      <div class="scroll-view" ref="scroll">
        <wm-header>{{ dataSource.realname }}</wm-header>

        <div class="latest-clue-detail-article">
          <div class="article-card">
            <div class="article-card-header">
              <div class="article-card-title">
                {{ dataSource.articleTitle }}
              </div>
              <div class="article-card-description">
                <span>时间:{{ dataSource.publicationTime }}&nbsp;</span>
                <span>作者:{{ dataSource.realname }}&nbsp;</span>
                <span>点击:{{ dataSource.clickNum }} 次</span>
              </div>
            </div>

            <div class="article-card-content">
              <template v-if="dataSource.amount > 0">
                <template v-if="!isLogin">
                  <div class="article-card-article">
                    <div class="article-card-article-line-2">
                      <div class="">
                        这篇文档需要
                        <span style="color: #e00;">
                          {{ dataSource.amount }}
                        </span>
                        金币 才能访问
                      </div>
                      <div class="">
                        请先 <span style="color: #e00;">登录</span>
                      </div>
                    </div>
                    <button
                      class="article-card-button"
                      @click="onButtonClick('login')"
                    >
                      登录
                    </button>
                  </div>
                </template>
                <template v-else>
                  <template v-if="!dataSource.isBuy">
                    <template v-if="userInfo.balance >= dataSource.amount">
                      <div class="article-card-article">
                        <div class="article-card-article-line-1">
                          <div>该内容为收费内容</div>
                          <div>欢迎订阅！</div>
                        </div>
                        <div class="article-card-article-line-2">
                          <div class="">
                            这篇文档需要
                            <span style="color: #e00;">{{
                              dataSource.amount
                            }}</span>
                            金币 才能访问
                          </div>
                          <div class="">
                            你目前拥有金币：<span style="color: #e00;">{{
                              userInfo.balance
                            }}</span>
                            个
                          </div>
                        </div>
                        <button
                          class="article-card-button"
                          @click="onButtonClick('buy')"
                        >
                          立即订购
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="article-card-article">
                        <div class="article-card-article-line-2">
                          <div class="">
                            这篇文档需要
                            <span style="color: #e00;">{{
                              dataSource.amount
                            }}</span>
                            金币 才能访问
                          </div>
                          <div class="">
                            你的金币现有 {{ userInfo.balance }}，<span
                              style="color: #e00;"
                              >不足购买，请先充值</span
                            >
                          </div>
                        </div>
                        <button
                          class="article-card-button"
                          @click="onButtonClick('recharge')"
                        >
                          去充值
                        </button>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="ck-content" v-html="dataSource.articleURL || ''"></div>
                  </template>
                </template>
              </template>
              <template v-else>
                <div class="ck-content" v-html="dataSource.articleURL || ''"></div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="tips-modal-wrapper" wx:if="{{showTipsModal}}">
        <div class="tips-modal-mask" @click="bindTipsModalClose"></div>
        <div class="tips-modal">
          <div class="tips-modal-header">
            <div class="tips-modal-title">购买提示</div>
          </div>
          <div class="tips-modal-content">
            <div class="">购买该文章需要 {{ dataSource.amount }} 金币</div>
            <div class="">你目前拥有金币：{{ userInfo.balance }} 个</div>
          </div>
          <div class="tips-modal-footer">
            <div class="tips-modal-button" @click="bindBuyClick"
              >确定购买</div
            >
          </div>
        </div>
      </div> -->

      <TipsModal
        :visible="tipsModalVisible"
        :userInfo="userInfo"
        :dataSource="dataSource"
        @submit="onBuySubmit"
        @close="onTipsModalClose"
      />
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";
import TipsModal from "./components/TipsModal";
import { mapState, mapActions } from "vuex";
import {
  requestUserInfo,
  requestArticleDetail,
  requestBuyArticle,
} from "@/api";

export default {
  name: "LatestClueDetail",
  components: {
    BasicLayout,
    "wm-header": Header,
    TipsModal,
  },
  data() {
    return {
      tipsModalVisible: false,
      userInfoLoading: false,
      pageLoading: false,
      dataSource: {},

      buyLoading: false,
    };
  },
  computed: {
    ...mapState(["token", "userInfo"]),

    isLogin() {
      return !!this.token;
    },
  },
  methods: {
    ...mapActions(["updateUserInfo"]),

    /**
     * 获取用户信息
     * @param {*} params
     * @param {*} cb
     */
    getUserInfo(params, cb) {
      this.userInfoLoading = true;
      requestUserInfo(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.userInfoLoading = false;
        });
    },

    /**
     * 获取文章详情
     * @param {*} params
     * @param {*} cb
     */
    getArticleDetail(params, cb) {
      this.pageLoading = true;
      requestArticleDetail(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },

    /**
     * 购买文章
     * @param {*} params
     * @param {*} cb
     */
    buyArticle(params, cb) {
      this.buyLoading = true;
      requestBuyArticle(params)
        .then((res) => {
          if (res.code === 0) {
            this.$toast("购买成功");
            cb && cb();
          } else {
            this.$toast(res.message);
          }
        })
        .finally(() => {
          this.buyLoading = false;
        });
    },

    /**
     * 点击立即订购
     * @param {*} e
     */
    onButtonClick(target) {
      switch (target) {
        case "login":
          this.$refs.layout.menuVisible = true;
          break;
        case "buy":
          this.tipsModalVisible = true;
          break;
        case "recharge":
          this.$router.push("/user-center/recharge");
          break;
      }
    },

    /**
     * 确认购买
     */
    onBuySubmit() {
      this.buyArticle({ token: this.token, articleId: this.id }, () => {
        this.onTipsModalClose();

        this.getUserInfo({ token: this.token }, (res) => {
          this.updateUserInfo(res);
        });

        this.getArticleDetail(
          { token: this.token, articleId: this.id },
          (res) => {
            this.dataSource = res;
          }
        );
      });
    },

    /**
     * 关闭确认框
     */
    onTipsModalClose() {
      this.tipsModalVisible = false;
    },

    /**
     * 在当前页面登录
     */
    onLogin() {
      this.getArticleDetail(
        { token: this.token, articleId: this.id },
        (res) => {
          this.dataSource = res;
        }
      );
    },

    /**
     * 在当前页退出
     */
    onLogout() {
      if (this.tipsModalVisible) {
        this.tipsModalVisible = false;
      }
    },
  },
  mounted() {
    const { id } = this.$route.query;
    this.id = id;

    this.getArticleDetail({ token: this.token, articleId: id }, (res) => {
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

.latest-clue-detail-article {
  width: 100%;
  padding: 20px 2%;
  box-sizing: border-box;
}

.article-card {
  border-radius: 12px;
  background-color: #fff;
}

.article-card-header {
  position: relative;
  padding: 40px 2.5% 20px;
  box-sizing: border-box;
}

.article-card-header::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ddd;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.article-card-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  line-height: 40px;
  color: #e00;
}

.article-card-description {
  padding-top: 20px;
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  line-height: 40px;
  color: #aaa;
}

.article-card-content {
  padding: 20px 2.5%;
}

.article-card-article {
  text-align: center;
}

.article-card-article-line-1 {
  height: 140px;
  font-size: 28px;
  line-height: 60px;
  color: #e00;
}

.article-card-article-line-2 {
  height: 120px;
  font-size: 28px;
  line-height: 60px;
}

.article-card-button {
  position: relative;
  margin: 60px 0;
  padding: 0;
  border: 0;
  width: 100% !important;
  height: 84px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: normal;
  text-align: center;
  line-height: 84px;
  color: #fff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: #e00;
}

.article-card-button:after {
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
</style>
