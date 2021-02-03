<template>
  <div class="basic-layout">
    <div class="basic-layout-header" ref="header">
      <wm-navigation-bar
        :title="title"
        :show-back="showBack"
        @car="onCarClick"
        @back="onBackClick"
        @logo="onLogoClick"
      />
    </div>

    <div class="basic-layout-content" :style="{ height: pageHeight + 'px' }">
      <wm-float-button-group @top="onTopClick" @car="onCarClick" />
      <slot></slot>
      <wm-menu
        :visible.sync="menuVisible"
        :path="currentPath"
        @login="$emit('login')"
      />
    </div>

    <div class="basic-layout-footer" ref="footer">
      <wm-tabbar @link="onNavClick" @menu="onShowMenuClick" />
    </div>

    <Modal :visible="modalVisible" @confirm="onModalConfirm" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavigationBar from "@/components/NavigationBar";
import FloatButtonGroup from "@/components/FloatButtonGroup";
import Menu from "@/components/Menu";
import Tabbar from "@/components/Tabbar";
import Modal from "@/components/Modal";

export default {
  name: "BasicLayouts",
  components: {
    "wm-navigation-bar": NavigationBar,
    "wm-float-button-group": FloatButtonGroup,
    "wm-menu": Menu,
    "wm-tabbar": Tabbar,
    Modal,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageHeight: 0,
      currentPath: "",
      menuVisible: false,
    };
  },
  computed: {
    ...mapState(["modalVisible"]),
  },
  watch: {
    modalVisible(val) {
      if (val) {
        this.$emit("logout");
      }
    },
  },
  methods: {
    ...mapActions(["updateModalVisible"]),

    // 返回
    onBackClick() {
      this.$router.back();
    },

    // 点击 logo
    onLogoClick() {
      if (this.currentPath !== "/home") {
        this.$router.push("/home");
      }
    },

    // 点击购物车
    onCarClick() {
      if (this.currentPath !== "/shop-car") {
        this.$router.push("/shop-car");
      }
    },

    // 回到顶部
    onTopClick() {
      if (
        this.$parent.$refs.scroll &&
        this.$parent.$refs.scroll.scrollTop !== 0
      ) {
        this.$parent.$refs.scroll.scrollTop = 0;
      }
    },

    // tabbar 跳转
    onNavClick(url) {
      if (this.currentPath !== url) {
        this.$router.push(url);
      }
    },

    // 打开菜单
    onShowMenuClick() {
      this.menuVisible = !this.menuVisible;
    },

    // 重新登录
    onModalConfirm() {
      this.updateModalVisible(false);
      if (!this.menuVisible) {
        this.menuVisible = true;
      }
    },
  },
  mounted() {
    const { clientHeight } = document.documentElement;
    const navigationBarHeight = this.$refs.header.clientHeight;
    const tabbarHeight = this.$refs.footer.clientHeight;
    this.pageHeight = clientHeight - navigationBarHeight - tabbarHeight;
    this.currentPath = this.$route.fullPath;
  },
};
</script>

<style lang="scss" scoped>
.basic-layout-header {
  height: 80px;
}

.basic-layout-footer {
  height: 86px;
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
