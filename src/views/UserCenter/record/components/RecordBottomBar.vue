<template>
  <div
    class="record-bottom-bar record-bottom-bar-safe"
    v-show="dataSource.length > 0"
  >
    <div class="record-bottom-bar-item">
      <wm-checkbox
        :checked="checkAll"
        label="全选"
        value="all"
        @click="onCheckAll"
      />
    </div>
    <div class="record-bottom-bar-item">
      <button class="record-bottom-bar-button" @click="onDeleteClick">
        删除
      </button>
    </div>
    <div class="record-bottom-bar-item">
      <span style="color: #999;">
        共 {{ pagination.pages }} 页/{{ pagination.total }}条记录
      </span>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/Checkbox";

export default {
  name: "RecordBottomBar",
  components: {
    "wm-checkbox": Checkbox,
  },
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    checkAll: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    /**
     * 全选/取消全选
     */
    onCheckAll() {
      this.$emit("checkAll");
    },
    /**
     * 删除
     */
    onDeleteClick() {
      this.$emit("delete");
    },
  },
};
</script>

<style lang="scss" scoped>
.record-bottom-bar {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 86px;
  width: 100%;
  font-size: 24px;
  background-color: #eee;
  box-sizing: border-box;
}

.record-bottom-bar::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-top: 1px solid #ccc;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.record-bottom-bar-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.record-bottom-bar-item {
  flex: 0 0 auto;
  line-height: 88px;
}

.record-bottom-bar-item:nth-of-type(1) {
  width: 140px;
  font-size: 0;
  text-align: center;
}

.record-bottom-bar-item:nth-of-type(3) {
  flex: 1 0 auto;
  padding-right: 20px;
  text-align: right;
}

.wm-checkbox::v-deep {
  .wm-checkbox-inner {
    width: 26px;
    height: 26px;
  }

  .wm-checkbox-text {
    margin-left: 16px;
    font-size: 24px;
    color: #000;
    line-height: inherit;
  }
}

.record-bottom-bar-button {
  position: relative;
  display: block;
  margin: 0 auto;
  padding: 0;
  border: 0;
  width: 98px !important;
  height: 52px;
  border-radius: 10px;
  font-size: 28px;
  font-weight: normal;
  color: #fff;
  line-height: 52px;
  background-color: #888;
}

.record-bottom-bar-button::after {
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
