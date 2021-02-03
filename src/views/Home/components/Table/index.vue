<template>
  <div class="wm-table-wrapper">
    <table class="wm-table">
      <thead>
        <tr>
          <th
            class="wm-table-th"
            v-for="column in columns"
            :key="column.dataIndex"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in dataSource"
          :key="item.articleId"
          @click="onClick(index)"
        >
          <td
            class="wm-table-td"
            :style="column.align ? 'text-align: ' + column.align + ';' : ''"
            v-for="column in columns"
            :key="column.dataIndex"
          >
            <div
              :class="['wm-table-text', { flex: column.showNew }]"
              :style="getTableCellWidth(column)"
            >
              <template v-if="column.showNew">
                <div
                  class="article-text van-ellipsis"
                  :style="column.showNew ? getTableCellWidth(column, 82) : ''"
                >
                  {{ item[column.dataIndex]
                  }}{{ column.unit ? column.unit : "" }}
                </div>
                <div class="article-new">
                  <img
                    class="article-new-image"
                    :src="assetsURL + '/icon-new.png'"
                  />
                </div>
              </template>
              <template v-else>
                <div class="article-text van-ellipsis">
                  {{ item[column.dataIndex]
                  }}{{ column.unit ? column.unit : "" }}
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "Table",
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
  },
  data() {
    return {
      assetsURL,
      clientWidth: 0,
    };
  },
  methods: {
    getTableCellWidth(column, size) {
      const style = {};
      if (column.maxWidth) {
        if (size) {
          style.maxWidth =
            ((column.maxWidth - size) / 750) * this.clientWidth + "px";
        } else {
          style.width = (column.maxWidth / 750) * this.clientWidth + "px";
        }
      }
      return style;
    },

    onClick(index) {
      this.$emit("click", this.dataSource[index].articleId);
    },
  },
  created() {
    this.clientWidth = document.body.clientWidth;
  },
};
</script>

<style lang="scss" scoped>
.wm-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.wm-table-th {
  position: relative;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #c00;
  line-height: 72px;
  background-color: #f0f0f0;
}

.wm-table-th::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ddd;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-table-td {
  padding: 0;
  background-color: #fff;
}

.wm-table-text {
  padding: 0 10px;
  box-sizing: border-box;
}

.wm-table-text.flex {
  display: flex;
  align-items: center;
}

.article-text {
  font-size: 24px;
  color: #555;
  line-height: 72px;
}

.wm-table-text.flex .article-text {
  flex: 0 0 auto;
}

.article-new {
  flex: 0 0 auto;
  margin-left: 8px;
  width: 54px;
  height: 24px;
}

.article-new-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
