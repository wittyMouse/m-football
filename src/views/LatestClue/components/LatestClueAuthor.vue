<template>
  <div class="latest-clue-author">
    <div class="latest-clue-nav-bar">
      <div
        :class="['latest-clue-nav-item', { active: picker }]"
        @click="onPickerClick()"
      >
        王牌贴士
      </div>
    </div>

    <div class="latest-clue-author-list" v-show="picker">
      <div
        class="latest-clue-author-item"
        v-for="item in authorList"
        :key="item.id"
        @click="onClick(item.id)"
      >
        <div class="latest-clue-author-avatar">
          <img class="latest-clue-author-avatar-image" :src="item.avatar" />
        </div>
        <div class="latest-clue-author-name">{{ item.realname }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LatestClueAuthor",
  props: {
    authorList: {
      type: Array,
      default() {
        return [];
      },
    },
    picker: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onPickerClick() {
      this.$emit("picker");
    },

    onClick(id) {
      this.$emit("click", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.latest-clue-author {
}

.latest-clue-nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: #fff;
}

.latest-clue-nav-bar::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ccc;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.latest-clue-nav-item {
  position: relative;
  margin: 0 8px;
  width: calc(100% / 3 - 16px);
  height: 68px;
  border-radius: 12px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  line-height: 68px;
  color: #fff;
  background-color: #e00;
}

.latest-clue-nav-item::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 24px;
  border: 1px solid #e00;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.latest-clue-nav-item.active {
  color: #fff;
  background-color: #900;
}

.latest-clue-nav-item.active::after {
  border: 1px solid #900;
}

.latest-clue-author-list {
  position: relative;
  width: 100%;
  min-height: 200px;
  padding: 24px 0;
  box-sizing: border-box;
  background-color: #fff;
}

.latest-clue-author-list::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ccc;
  transform-origin: center;
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.latest-clue-author-item {
  display: inline-block;
  width: 25%;
  height: 220px;
}

.latest-clue-author-avatar {
  margin: 0 auto;
  width: 120px;
  height: 120px;
}

.latest-clue-author-avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.latest-clue-author-name {
  font-size: 24px;
  text-align: center;
  color: #555;
}
</style>
