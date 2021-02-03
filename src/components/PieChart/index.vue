<template>
  <div class="wm-pie-chart">
    <div class="wm-pie-chart-circle"></div>

    <div class="wm-pie-chart-left">
      <div
        :class="['wm-pie-chart-left-circle', isAdd ? 'delay-3' : 'delay-0']"
        :style="{ transform: 'rotate(' + leftAngle + 'deg)' }"
      ></div>
    </div>

    <div class="wm-pie-chart-right">
      <div
        :class="['wm-pie-chart-right-circle', isAdd ? 'delay-0' : 'delay-3']"
        :style="{ transform: 'rotate(' + rightAngle + 'deg)' }"
      ></div>
    </div>

    <div class="wm-pie-chart-percentage">{{ percentage | format }}</div>
  </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";

export default {
  name: "PieChart",
  props: {
    // 只能传百分比
    value: {
      type: Number,
      default: 0,
    },
    // 大小
    size: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      _value: 0,
      isAdd: true,
      leftAngle: 0,
      rightAngle: 0,
      percentage: 0,
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this._value) {
          const result = (360 * val) / 100;
          let leftAngle = 0;
          let rightAngle = 0;
          if (result > 180) {
            rightAngle = 180;
            leftAngle = result - 180;
          } else {
            rightAngle = result;
          }
          this._value = val;
          this.percentage = val;
          this.isAdd = val > this._value;
          this.leftAngle = leftAngle;
          this.rightAngle = rightAngle;
        }
      },
      immediate: true,
    },
  },
  filters: {
    format(val) {
      if (typeof val !== "number" && isEmpty(val)) {
        return 0;
      }
      const str = val + "";
      return str.split(".")[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-pie-chart {
  display: inline-block;
  position: relative;
  width: 168px;
  height: 168px;
}

.wm-pie-chart-circle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  background-color: #c9c9c9;
}

.wm-pie-chart-left,
.wm-pie-chart-right {
  position: relative;
  display: inline-block;
  width: 50%;
  height: 100%;
  vertical-align: middle;
  overflow: hidden;
}

.wm-pie-chart-left-circle,
.wm-pie-chart-right-circle {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-color: #c7000b;
  box-sizing: border-box;
}

.wm-pie-chart-left-circle {
  right: -100%;
  border-width: 62px 62px 62px 0;
  border-radius: 0 84px 84px 0;
  transform-origin: left;
  transform: rotate(0);
}

.wm-pie-chart-right-circle {
  left: -100%;
  border-width: 62px 0 62px 62px;
  border-radius: 84px 0 0 84px;
  transform-origin: right;
  transform: rotate(0);
}

.delay-0 {
  transition: transform 0.3s linear 0s;
}

.delay-3 {
  transition: transform 0.3s linear 0.3s;
}

.wm-pie-chart-percentage {
  position: absolute;
  left: 50%;
  bottom: -36px;
  border: 6px solid #fff;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  font-size: 32px;
  text-align: center;
  line-height: 52px;
  color: #fff;
  transform: translateX(-50%);
  background-color: #c7000b;
}

.wm-pie-chart-percentage::after {
  content: "%";
  position: absolute;
  right: -20px;
  bottom: -16px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}
</style>
