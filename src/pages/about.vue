<template lang="pug">
.about.relative
    .content(v-if="content" v-html="content?.content" id="about-content")
    .category.absolute
        .category-item.py-5.cursor-pointer(
            v-for="item in list"
            :key="item.id"
            @click="onActiveItem(item.id)"
    ) {{ item.title }}
</template>
<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { gql } from "graphql-request";
import { ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useRequest } from "../graphql";

const route = useRoute();
const request = useRequest();
const content = ref<any>();
const list = ref<any[]>([]);

function getPageContent(name) {
  request(
    gql`
      query($name: String) {
        posts(where: { title: $name }, first: 1) {
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
    content.value = data?.posts.nodes[0];
    nextTick(() => {
      generateTitle();
    });
  });
}

function onActiveItem(id) {
  document.getElementById(id)?.scrollIntoView();
}

function generateTitle() {
  const content = document.getElementById("about-content");
  const spans = content?.querySelectorAll("h1,h2,h3,h4,h5,h6>span");
  const result: any[] = [];
  spans?.forEach((node: any) => {
    node.id = Math.random().toString(32).slice(2);
    result.push({
      title: node.innerText,
      id: node.id,
    });
  });
  list.value = result;
}

onMounted(() => {
  getPageContent("关于我们");
});
</script>
<style lang="stylus" scoped></style>

<style lang="stylus">
.about
    .content
        margin 0 240px
        margin-top 60px!important
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
            background-color #f7f7f7
            &.active
                background rgba(0,0,0,0.2)
                font-weight bold
</style>
