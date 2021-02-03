<template>
  <BasicLayout title="节目回放">
    <div class="container playback">
      <div
        :class="['scroll-view', { 'show-audio': currentAudio > -1 }]"
        ref="scroll"
      >
        <wm-playback-tabs :activeKey="activeKey" @change="onTabsChange">
          <wm-playback-tab-pane
            :tab="item"
            :value="index"
            v-for="(item, index) in dataSource"
            :key="index"
          >
            <div class="playback-list">
              <div
                class="playback-list-item"
                v-for="(subItem, subIndex) in item.recordList"
                :key="subIndex"
                @click="onClick(index, subIndex)"
              >
                <div class="playback-play">
                  <img
                    class="playback-play-image"
                    :src="assetsURL + '/icon-jt03.png'"
                  />
                </div>

                <span>{{ subItem.recordTime }} {{ item.itemName }}</span>
              </div>
            </div>
          </wm-playback-tab-pane>
        </wm-playback-tabs>
      </div>

      <wm-audio
        :visible="currentAudio > -1"
        :title="currentAudio > -1 ? audioList[currentAudio].title : ''"
        :src="currentAudio > -1 ? audioList[currentAudio].src : ''"
        @change="onAudioChange"
      />
    </div>
  </BasicLayout>
</template>

<script>
import { mapState } from "vuex";
import BasicLayout from "@/layouts/BasicLayout";
import PlaybackTabs from "./components/PlaybackTabs";
import PlaybackTabPane from "./components/PlaybackTabPane";
import Audio from "./components/Audio";
import { assetsURL } from "@/api/config";
import { requestRecordList } from "@/api";
import { formatDate } from "@/utils";

export default {
  name: "Playback",
  components: {
    BasicLayout,
    "wm-playback-tabs": PlaybackTabs,
    "wm-playback-tab-pane": PlaybackTabPane,
    "wm-audio": Audio,
  },
  data() {
    return {
      assetsURL,

      // 数据加载状态
      loading: false,
      // 录音列表
      dataSource: [],
      // 请求参数
      requestParams: {
        queryTime: "",
      },

      // 当前激活 tab 面板的 key
      activeKey: "",

      // 音频列表
      audioList: [],

      // 当前播放音频
      currentAudio: -1,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    // 录音回放列表
    getRecordList(params, cb) {
      this.loading = true;
      requestRecordList(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            console.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 切换 tabs
     * @param {*} e
     */
    onTabsChange(key) {
      this.activeKey = key;
    },

    /**
     * 点击录音列表项
     * @param {*} e
     */
    onClick(x, y) {
      const key = `${x},${y}`;
      const idx = this.audioList.findIndex((item) => item.key === key);
      if (idx > -1) {
        this.currentAudio = idx;
      } else {
        const audio = {
          key,
          title: this.dataSource[x].itemName,
          src: this.dataSource[x].recordList[y].filePath,
        };
        this.currentAudio = this.audioList.length;
        this.audioList.push(audio);
      }
    },

    /**
     * 音频切换
     * @param {*} e
     */
    onAudioChange(target) {
      if (this.audioList.length < 2) {
        return;
      }

      switch (target) {
        case "prev":
          if (this.currentAudio === 0) {
            this.currentAudio = this.audioList.length - 1;
          } else {
            this.currentAudio = this.currentAudio - 1;
          }
          break;
        case "next":
          if (this.currentAudio === this.audioList.length - 1) {
            this.currentAudio = 0;
          } else {
            this.currentAudio = this.currentAudio + 1;
          }
          break;
      }
    },
  },
  mounted() {
    const queryTime = formatDate(new Date(), "YYYY-MM");
    this.getRecordList(
      {
        token: this.token,
        queryTime,
      },
      (res) => {
        this.requestParams.queryTime = queryTime;
        this.activeKey = 0;
        this.dataSource = res;
      }
    );
  },
};
</script>

<style lang="scss" scoped>
.scroll-view.show-audio {
  height: calc(100% - 100px);
}

.playback-list-item {
  position: relative;
  padding: 24px 0 24px 64px;
  font-size: 28px;
  color: #555;
}

.playback-list-item:nth-child(odd) {
  background-color: #fff;
}

.playback-list-item:nth-child(even) {
  background-color: #ebecf1;
}

.playback-play {
  position: absolute;
  top: 50%;
  left: 32px;
  width: 10px;
  height: 17px;
  transform: translateY(-50%);
}

.playback-play-image {
  display: block;
  width: 100%;
  height: 100%;
}

.wm-audio-placeholder {
  width: 100%;
  height: 100px;
}
</style>
