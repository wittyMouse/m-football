<template>
  <div class="record-item">
    <div class="record-item-layout-left">
      <wm-checkbox
        :checked="checked"
        :value="recordDetail.id"
        @click="onCheckClick"
      />
    </div>

    <div class="record-item-layout-right">
      <template v-if="target === 'recharge'">
        <div class="record-item-line">订单号：{{ recordDetail.recordId }}</div>
        <div class="record-item-line">产品：{{ recordDetail.amount }} 金币</div>
        <div class="record-item-line inline">状态信息：</div>
        <div class="record-item-line inline">
          状态：<span style="color: #e00;">已付款</span>
        </div>
        <div class="record-item-line">
          时间：{{
            recordDetail.buyTime ? recordDetail.buyTime.split(" ")[0] : ""
          }}
        </div>
      </template>
      <template v-else-if="target === 'journal'">
        <div class="record-item-line">
          内容：{{
            recordDetail.description ? recordDetail.description + " 金币" : ""
          }}
        </div>
        <div class="record-item-line inline">
          备注：{{ typeList[recordDetail.type] }}
        </div>
        <div class="record-item-line inline">
          类型：{{ recordDetail.type !== 0 ? typeList[recordDetail.type] : "" }}
        </div>
        <div class="record-item-line">时间：{{ recordDetail.buyTime }}</div>
        <div class="record-item-line inline">
          交易金额：{{ recordDetail.amount }}
        </div>
        <div class="record-item-line inline">
          余额：{{ recordDetail.afterAmount }}
        </div>
      </template>
      <template v-else-if="target === 'recommend'">
        <div class="record-item-line inline">类型：订阅</div>
        <div class="record-item-line inline">
          服务状态：<span style="color: #e00;" v-if="recordDetail.status > 0"
            >服务中</span
          ><template v-else>服务结束</template>
        </div>
        <div class="record-item-line">
          专家名称：{{ recordDetail.realname }}
        </div>
        <div class="record-item-line inline">
          消费金币：<span style="color: #e00;">{{ recordDetail.amount }}</span>
          金币
        </div>
        <div class="record-item-line inline">
          成绩：<span style="color: #e00;" v-if="recordDetail.score > 0">{{
            recordDetail.score
          }}</span
          ><template v-else>{{ recordDetail.score }}</template>
        </div>
        <div class="record-item-line">服务起止时间：</div>
        <div class="record-item-line">（起）{{ recordDetail.beginTime }}</div>
        <div class="record-item-line" style="color: #e00;">
          （止）{{ recordDetail.endTime }}
        </div>
      </template>
      <template v-else-if="target === 'clue'">
        <div class="record-item-line">ID：{{ recordDetail.id }}</div>
        <div class="record-item-line">
          标题：<span style="color: #02a552;">{{
            recordDetail.articleTitle
          }}</span>
        </div>
        <div class="record-item-line">
          专家名称：{{ recordDetail.realname }}
        </div>
        <div class="record-item-line">
          消费金币：<span style="color: #e00;">{{ recordDetail.amount }}</span>
          金币
        </div>
        <div class="record-item-line">消费时间：{{ recordDetail.buyTime }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import Checkbox from "@/components/Checkbox";
export default {
  name: "RecordCard",
  components: {
    "wm-checkbox": Checkbox,
  },
  props: {
    target: {
      type: String,
      default: "",
    },
    recordDetail: {
      type: Object,
      default() {
        return {};
      },
    },
    typeList: {
      type: Array,
      default() {
        return [];
      },
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onCheckClick(id) {
      this.$emit("check", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.record-item {
  display: flex;
  position: relative;
  padding: 18px 0;
}

.record-item:nth-child(odd) {
  background-color: #fff;
}

.record-item::after {
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

.record-item-layout-left {
  flex: 0 0 10%;
  text-align: center;
  line-height: 0;
}

.record-item-layout-right {
  flex: 0 0 90%;
  line-height: 1.6;
}

.record-item-line {
  font-size: 28px;
}

.record-item-line.inline {
  display: inline-block;
  /* vertical-align: middle; */
}

.record-item-line.inline + .record-item-line.inline {
  margin-left: 32px;
}
</style>
