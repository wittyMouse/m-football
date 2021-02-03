<template>
  <BasicLayout title="王牌推介">
    <div class="container recommend">
      <RecommendNavBar @nav="onNavClick" />
      <div class="recommend-nav-bar-position"></div>

      <div class="scroll-view" ref="scroll">
        <RecommendPanel
          ref="panel1"
          :dataSource="dataSource1"
          :resultClassMap="resultClassMap"
          :resultTextMap="resultTextMap"
          target="1"
          @click="onPanelClick"
        />

        <RecommendPanel
          ref="panel2"
          :dataSource="dataSource2"
          :resultClassMap="resultClassMap"
          :resultTextMap="resultTextMap"
          target="2"
          @click="onPanelClick"
        />

        <RecommendPanel
          ref="panel3"
          :dataSource="dataSource3"
          :resultClassMap="resultClassMap"
          :resultTextMap="resultTextMap"
          target="3"
          @click="onPanelClick"
        />
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import RecommendNavBar from "./components/RecommendNavBar";
import RecommendPanel from "./components/RecommendPanel";
import { requestAuthorInfoList } from "@/api";

const resultClassMap = {
  "-2": 3,
  "-1": 3,
  0: 2,
  1: 1,
  2: 1,
};

const resultTextMap = {
  "-2": "负",
  "-1": "负",
  0: "走",
  1: "胜",
  2: "胜",
};

export default {
  name: "Recommend",
  components: {
    BasicLayout,
    RecommendNavBar,
    RecommendPanel,
  },
  data() {
    return {
      resultClassMap,
      resultTextMap,
      panelTop1: 0,
      panelTop2: 0,
      panelTop3: 0,
      dataSource1: [],
      dataSource2: [],
      dataSource3: [],
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    /**
     * 根据部门 Id 获取用户信息
     */
    // getAuthorInfoList(params, cb) {
    //   requestAuthorInfoList(params).then((res) => {
    //     if (res.code === 0) {
    //       cb && cb(res);
    //     } else {
    //       console.log(res.message);
    //     }
    //   });
    // },

    /**
     * 点击导航栏
     * @param {*} e
     */
    onNavClick(target) {
      this.$refs.scroll.scrollTop = this[`panelTop${target}`] - this.panelTop1;
    },

    /**
     * 点击卡片
     * @param {*} e
     */
    onPanelClick(id) {
      this.$router.push(`/recommend/detail?id=${id}`);
    },
  },
  mounted() {
    const pm1 = requestAuthorInfoList({ token: this.token, departId: 4 });
    const pm2 = requestAuthorInfoList({ token: this.token, departId: 5 });
    const pm3 = requestAuthorInfoList({ token: this.token, departId: 6 });

    Promise.all([pm1, pm2, pm3]).then((res) => {
      if (res[0].code === 0) {
        this.dataSource1 = res[0].result;
      }

      if (res[1].code === 0) {
        this.dataSource2 = res[1].result;
      }

      if (res[2].code === 0) {
        this.dataSource3 = res[2].result;
      }

      this.$nextTick(() => {
        this.panelTop1 = this.$refs.panel1.$el.offsetTop;
        this.panelTop2 = this.$refs.panel2.$el.offsetTop;
        this.panelTop3 = this.$refs.panel3.$el.offsetTop;
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.recommend {
}

.recommend-nav-bar-position {
  width: 100%;
  height: 88px;
}

.scroll-view {
  height: calc(100% - 88px);
}
</style>
