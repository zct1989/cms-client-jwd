<template lang="pug">
.page
    .post-content.content-width.m-auto(v-if="content" v-html="content?.content")
</template>
<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { ElLoading } from "element-plus";
import { gql } from "graphql-request";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useRequest } from "../graphql";

const route = useRoute();
const request = useRequest();
const content = ref<any>();

function getPageContent(name) {
  const loadingInstance = ElLoading.service({ target: ".page" });
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
  )
    .then((data) => {
      content.value = data?.posts.nodes[0];
    })
    .finally(() => {
      loadingInstance.close();
    });
}

watch(
  () => route.params,
  () => {
    const { name } = route.params;
    getPageContent(name);
  }
);

onMounted(() => {
  const { name } = route.params;
  getPageContent(name);
});
</script>
<style lang="stylus" scoped></style>

<style lang="stylus">
.page
    .post-content
        margin auto
        margin-top 80px!important
        img
            padding 0
            margin 0
            width 100%
            border none
            max-width 100%
            margin-left 6px
</style>
