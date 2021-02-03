<template>
  <div class="wm-audio wm-audio-safe" v-show="visible">
    <audio
      ref="audio"
      autoplay
      @canplay="handleAudioCanPlay"
      @play="handleAudioPlay"
      @pause="handleAudioPause"
      @timeupdate="handleAudioTimeUpdate"
    />

    <div class="wm-audio-slider" ref="slider">
      <div class="wm-audio-slider-rail"></div>
      <div
        class="wm-audio-slider-track"
        :style="{ width: trackWidth + 'px' }"
        @click="handleSliderClick"
      ></div>
      <div class="wm-audio-slider-step" @click="handleSliderClick"></div>
      <div
        class="wm-audio-slider-handle"
        :style="{ left: trackWidth + 'px' }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></div>
    </div>

    <div class="wm-audio-title">{{ title }}</div>

    <div class="wm-audio-control">
      <div class="wm-audio-control-prev">
        <img
          class="wm-audio-control-image"
          :src="assetsURL + '/prev.png'"
          @click="bindControlClick('prev')"
        />
      </div>
      <div class="wm-audio-control-play">
        <img
          class="wm-audio-control-image"
          :src="assetsURL + '/play.png'"
          @click="bindControlClick('play')"
          v-show="paused"
        />
        <img
          class="wm-audio-control-image"
          :src="assetsURL + '/pause.png'"
          @click="bindControlClick('pause')"
          v-show="!paused"
        />
      </div>
      <div class="wm-audio-control-next">
        <img
          class="wm-audio-control-image"
          :src="assetsURL + '/next.png'"
          @click="bindControlClick('next')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";
import throttle from "lodash/throttle";

export default {
  name: "Audio",
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false,
    },
    // 音频标题
    title: {
      type: String,
      default: "",
    },
    // 音频资源的地址
    src: {
      type: String,
      default: "",
    },
  },
  data() {
    this.onTimeUpdate = throttle(this.onTimeUpdate, 500);

    return {
      assetsURL,

      // 开始滑动
      touchstart: false,

      // 记录鼠标位置
      page: {
        x: 0,
        y: 0,
      },

      // 当前是否暂停或停止
      paused: true,

      // 进度条总长度
      sliderWidth: 0,

      // 进度条位置
      trackWidth: 0,

      // 音频总长度
      duration: 0,

      // 当前音频的播放位置
      currentTime: 0,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.sliderWidth = this.$refs.slider.clientWidth;
        });
      }
    },
    src(val) {
      if (val) {
        if (!this.$refs.audio.canPlayType(`audio/${this.getSuffix(val)}`)) {
          this.$toast("不支持播放该音频类型");
        } else {
          this.$refs.audio.src = val;
        }
      }
    },
  },
  methods: {
    /**
     * 获取后缀
     */
    getSuffix(url) {
      const idx = url.lastIndexOf(".");
      if (idx > -1) {
        return url.slice(idx + 1);
      }
      return "";
    },

    /**
     * 音频控制器点击事件
     * @param {*} e
     */
    bindControlClick(target) {
      switch (target) {
        case "prev":
          // 上一首
          this.$emit("change", "prev");
          break;
        case "play":
          // 播放
          this.$refs.audio.play();
          break;
        case "pause":
          // 暂停
          this.$refs.audio.pause();
          break;
        case "next":
          // 下一首
          this.$emit("change", "next");
          break;
      }
    },

    /**
     * 点击进度条
     * @param {*} e
     */
    handleSliderClick(e) {
      // console.log(e);
      const currentTime = (this.duration * e.clientX) / this.sliderWidth;
      this.$refs.audio.currentTime = currentTime;
      this.trackWidth = e.clientX;
      this.currentTime = currentTime;
    },

    /**
     * 进度控制器滑动开始
     * @param {*} e
     */
    handleTouchStart(e) {
      // console.log(e);
      const { clientX } = e.touches[0];
      this.touchstart = true;
      this.page.x = clientX;
    },

    /**
     * 进度控制器滑动
     * @param {*} e
     */
    handleTouchMove(e) {
      // console.log(e);
      if (!this.touchstart) {
        return;
      }

      const { clientX } = e.touches[0];
      const touchWidth = clientX - this.page.x;
      // console.log(touchWidth);
      let _trackWidth = this.trackWidth + touchWidth;
      if (_trackWidth < 0) {
        _trackWidth = 0;
      } else if (_trackWidth > this.sliderWidth) {
        _trackWidth = this.sliderWidth;
      }
      this.page.x = clientX;
      this.trackWidth = _trackWidth;
    },

    /**
     * 进度控制器滑动结束
     */
    handleTouchEnd() {
      const currentTime = this.duration * (this.page.x / this.sliderWidth);
      this.$refs.audio.currentTime = currentTime;
      this.currentTime = currentTime;
      this.touchstart = false;
    },

    /**
     * 音频可以播放事件
     */
    handleAudioCanPlay(e) {
      console.log("canPlay", e);
      this.duration = e.target.duration;
      // e.target.play();
    },

    /**
     * 音频播放事件
     */
    handleAudioPlay(e) {
      console.log("play", e);
      if (this.paused) {
        this.paused = false;
      }
    },

    /**
     * 音频暂停事件
     */
    handleAudioPause(e) {
      console.log("pause", e);
      if (!this.paused) {
        this.paused = true;
      }
    },

    /**
     * 音频停止事件
     */
    // handleAudioEnded(e) {
    //   console.log("ended", e);
    //   if (!this.paused) {
    //     this.paused = true;
    //   }
    // },

    /**
     * 当目前的播放位置已更改时
     */
    handleAudioTimeUpdate(e) {
      this.onTimeUpdate(e);
    },

    onTimeUpdate(e) {
      // console.log("timeUpdate", e);
      const _currentTime = e.target.currentTime;
      if (_currentTime - this.currentTime > 1) {
        const trackWidth = (this.sliderWidth * _currentTime) / this.duration;
        this.currentTime = Math.floor(_currentTime);
        if (!this.touchstart) {
          this.trackWidth = trackWidth;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-audio {
  position: fixed;
  left: 0;
  bottom: 88px;
  z-index: 10;
  width: 100%;
  height: 100px;
  background-color: #000;
}

.wm-audio-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.wm-audio-slider {
  position: relative;
  width: 100%;
  height: 12px;
}

.wm-audio-slider-rail,
.wm-audio-slider-track,
.wm-audio-slider-step {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
}

.wm-audio-slider-rail {
  z-index: 1;
  width: 100%;
  background-color: #333;
}

.wm-audio-slider-track {
  z-index: 3;
  width: 0;
  background-color: #c70c0c;
}

.wm-audio-slider-step {
  z-index: 2;
  width: 100%;
  background-color: #535353;
}

.wm-audio-slider-handle {
  position: absolute;
  top: -4px;
  left: 0;
  z-index: 4;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #c70c0c;
  transform: translateX(-50%);
}

.wm-audio-title {
  padding: 0 20px;
  font-size: 24px;
  line-height: 64px;
  color: #fff;
}

.wm-audio-control {
  position: absolute;
  top: 0;
  right: 0;
  width: 288px;
  height: 100px;
}

.wm-audio-control-prev,
.wm-audio-control-play,
.wm-audio-control-next {
  display: inline-block;
  margin: 12px 8px 8px;
  padding: 20px;
  width: 80px;
  height: 80px;
  box-sizing: border-box;
}

.wm-audio-control-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
