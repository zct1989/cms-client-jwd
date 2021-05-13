<template lang="pug">
.post
    .post-content.p-5.content-width.m-auto(
        v-html="post?.content"
    )
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
const post = ref<any>();

function getPostContent(id) {
  const loadingInstance = ElLoading.service({ target: ".post" });
  request(
    gql`
      query($id: ID!) {
        post(id: $id) {
          id
          content
        }
      }
    `,
    {
      id,
    }
  )
    .then((data) => {
      post.value = data.post;
    })
    .finally(() => {
      loadingInstance.close();
    });
}

watch(
  () => route.params,
  () => {
    const { id } = route.params;
    getPostContent(id);
  }
);

onMounted(() => {
  const { id } = route.params;
  getPostContent(id);
});
</script>
<style lang="stylus" scoped>
.post
  min-height 300px
.post-content
    margin-top 80px!important
    padding 18px 80px
    img
        margin 6px
</style>
