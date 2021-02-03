<template>
  <table class="wm-table">
    <tr class="wm-table-tr">
      <th class="wm-table-th" v-for="(item, index) in columns" :key="index">
        {{ item.label }}
      </th>
    </tr>
    <tr class="wm-table-tr" v-for="item in dataSource" :key="item.id">
      <td class="wm-table-td" v-for="(column, index) in columns" :key="index">
        <wm-radio
          :checked="activeKey === item[column.dataIndex]"
          :value="item[column.dataIndex]"
          v-if="column.radio"
          @change="onRadioChange"
        />
        <template v-else>
          <span>{{ item[column.dataIndex] }} </span>
          <span v-if="column.unit">{{ column.unit }}</span>
          <span
            :style="{ fontSize: '12px' }"
            v-if="column.dataIndex === 'donateIntegral'"
            >{{ item.type ? "(金币)" : "(积分)" }}</span
          >
        </template>
      </td>
    </tr>
  </table>
</template>

<script>
import Radio from "@/components/Radio";

export default {
  name: "Table",
  components: {
    "wm-radio": Radio,
  },
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    activeKey: {
      type: String,
      default: "",
    },
  },
  methods: {
    onRadioChange(key) {
      this.$emit("change", key);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-table {
  width: 100%;
  border-collapse: collapse;
  border-bottom: 2px solid #ccc;
}

.wm-table-tr {
}

.wm-table-th {
  font-weight: normal;
  color: #e00;
}

.wm-table-th,
.wm-table-td {
  font-size: 28px;
  text-align: center;
  line-height: 80px;
}

.wm-table-th.radio,
.wm-table-td.radio {
  width: 120px;
}

.wm-table-tr:nth-child(odd) {
  background-color: #fff;
}
</style>
