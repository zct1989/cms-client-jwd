<template lang="pug">
.about.flex.flex-row.content-width.m-auto
    .category
        .category-item.py-5.cursor-pointer(
            v-for="item in list"
            :key="item.id"
            @click="onActiveItem(item)"
            :class="{ active: node?.title === item.title }"
    ) {{ item.title }}
    .content(v-if="node" v-html="node?.content" id="about-content")
</template>
<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { gql } from "graphql-request";
import { ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useRequest } from "../graphql";
const route = useRoute();
const request = useRequest();
const node = ref<any>();
const list = ref<any[]>([]);
function getPageContent(name) {
  request(
    gql`
      query ($name: String) {
        posts(where: { categoryName: $name }, first: 20) {
          nodes {
            date
            content
            title
          }
        }
      }
    `,
    {
      name,
    }
  ).then((data) => {
    list.value = data?.posts.nodes;
    if (list.value && list.value.length) {
      node.value = list.value[0];
    }
  });
}

function onActiveItem(item) {
  node.value = item;
}

onMounted(() => {
  getPageContent("关于我们");
});
</script>
<style lang="stylus" scoped></style>

<style lang="stylus">
.about
    margin-top 80px!important
    .content
        img
            padding 0
            margin 0
            width 100%
            border none
            max-width 100%
            margin-left 6px
    .category
        top 20px
        left 20px
        flex-basis 200px
        width 200px
        min-width 200px
        max-width 200px
        margin-right 10px
        .category-item
            text-align center
            padding 15px
            background-color #219461
            color #fff
            &.active
                font-weight bold
</style>
