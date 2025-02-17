<template lang="pug">
.menu.absolute.inset-x-0
  .menu-container.flex.flex-row.content-width.m-auto.justify-between.items-center
    .menu-wrapper.flex.flex-row
      .menu-item.font-bold.py-5.px-5(
        v-for="item in menus"
        :key="item.id"
        @click="onEnterPage(item)"
        @mouseenter="onEnterMenu(item)"
        @mouseleave="onLeaveMenu(item)"
      ) {{ item.label }}
    el-autocomplete.w-48(
      size="small"
      width="100px"
      v-model="searchInput" 
      :fetch-suggestions="onSearchPost" 
      placeholder="  请输入内容"
      align="center"  
      :hide-loading="true"
      @select="onOpenPost")
  .menu-children-panel.absolute.w-full.flex.flex-row.py-5.px-72(
    v-if="menuChildren && menuChildren.length"
    @mouseenter="onEnterSubMenu()"
    @mouseleave="onLeaveSubMenu()"
  )
    .menu-children-node.px-5(
      v-for="item in menuChildren"
      :key="item.id"
    )
      .title.font-bold {{ item.label }}
      .sub-title.text-sm
        span |  
        span.pl-2 {{ item.connectedNode?.node?.description }}
      ul.node-list.pt-3
        li.node-item.text-xs.pb-1.pr-10.cursor-pointer.text-left(
          v-for="node in item.children"
          :key="node.id"
          @click="onEnterPost(node.connectedNode?.node?.id)"
        )  
          span.font-bold.pr-2 ·
          span {{ node.label }}
</template>
<script setup lang="ts">
import { onMounted, ref } from "@vue/runtime-core";
import { gql } from "graphql-request";
import { useRouter } from "vue-router";
import { useRequest } from "../../graphql";
import { convertToTree } from "../../shared/utils/common.util";

const localStorageMenus = localStorage.getItem("menus");
const menus = ref<any[]>(
  localStorageMenus ? JSON.parse(localStorageMenus) : []
);
const menuChildren = ref<any[]>();
const request = useRequest();
const router = useRouter();
const reading = ref(false);
const searchInput = ref("");
/**
 * 获取菜单项目
 */
function getMenuItems() {
  request(gql`
    query {
      menuItems(first: 500) {
        nodes {
          label
          parentId
          id
          menuItemId
          order
          connectedNode {
            node {
              ... on Post {
                id
                featuredImage {
                  node {
                    mediaItemUrl
                  }
                }
              }
              ... on Category {
                description
              }
            }
          }
        }
      }
    }
  `).then((data) => {
    menus.value = convertToTree(data.menuItems.nodes, {
      key: "id",
      parentKey: "parentId",
    });
    localStorage.setItem("menus", JSON.stringify(menus.value));
  });
}

function onEnterPage(item) {
  switch (item.label) {
    case "首页":
      window.location.href = "/";
      break;
    case "活动资讯":
      router.push({ name: "posts" });
      break;
    case "关于我们":
      router.push({ path: `/about` });
      break;
    default:
      router.push({ path: `/product/${item.label}` });
      break;
  }
}

function onEnterPost(id) {
  if (!id) return;

  router.push({ path: `/post/${id}` });
  menuChildren.value = [];
}

function onEnterMenu(item) {
  if (item.children) {
    menuChildren.value = item.children;
  }
}

function onEnterSubMenu() {
  reading.value = true;
}

function onLeaveSubMenu() {
  reading.value = false;
  menuChildren.value = [];
}

function onLeaveMenu(item) {
  setTimeout(() => {
    if (menuChildren.value === item.children && !reading.value) {
      menuChildren.value = [];
    }
  }, 300);
}

function onSearchPost(value: string, callback) {
  if (!value.trim()) {
    return callback([]);
  }

  request(
    gql`
      query($value: String!) {
        posts(first: 10, where: { search: $value }) {
          nodes {
            title
            id
          }
        }
      }
    `,
    {
      value,
    }
  ).then(({ posts }) => {
    callback(
      posts.nodes.map((x) => ({
        value: x.title,
        id: x.id,
      }))
    );
  });
}

function onOpenPost({ id }) {
  onEnterPost(id);
}

onMounted(() => {
  getMenuItems();
});
</script>
<style lang="stylus" scoped>
.menu
  z-index 100
  top 128px
  background-color rgba(11,130,77,0.86)
  .menu-item
    color #fff
    cursor pointer
    &:hover
      color #F7B200

.menu-children-panel
  height 350px
  background-color rgba(255,255,255,0.9)
  z-index 100
  .menu-children-node
    .title
      font-size 18px
      color #349C6E
    .node-list
      writing-mode vertical-lr
      height 280px
      .node-item
        writing-mode horizontal-tb
        display inline-block
        vertical-align bottom
</style>
