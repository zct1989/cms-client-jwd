<template lang="pug">
.loan
    .top-image 
        img.h-width(:src="ProductImage")
    .product-container(v-if="dataSource")
        .product-category.text-center.p-10(v-for="(category,index) in dataSource" :style="{ backgroundColor: index % 2 == 1 ? '#f7f7f7' : '#fff' }")
            .title.primary-color {{ category.label }}
            .subTitle.text-sm {{ category?.connectedNode?.node.description }}
            .children-container.flex.flex-row.justify-center.pt-3
                .left-arrow.flex.flex-col.justify-center(@click="pageIndex[index] -= 1" :style="{ visibility: pageIndex[index] > 0 ? 'visible' : 'hidden' }")
                    img(:src="LeftIcon")
                .content.flex.flex-row
                    .product-item.p-2.cursor-pointer(
                        v-for="product in category?.children?.slice(0+pageIndex[index]*4,4+pageIndex[index]*4)"
                        @click="onEnterPost(product.id)"
                        )
                        img(:src="product?.connectedNode?.node?.featuredImage?.node?.mediaItemUrl")
                        .title.w-48.py-2.m-auto {{ product.label }}
                .right-arrow.flex.flex-col.justify-center(@click="pageIndex[index] += 1" :style="{ visibility: (pageIndex[index] * 4 + 4) < category?.children?.length ? 'visible' : 'hidden' }")
                    img(:src="RightIcon")
</template>
<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { ref } from "vue";
import ProductImage from "../assets/loan/product-image.jpg";
import LeftIcon from "../assets/loan/left.png";
import RightIcon from "../assets/loan/right.png";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const menus = JSON.parse(localStorage.getItem("menus") as string);
let dataSource = ref<any[]>([]);

const pageIndex = ref<any[]>([]);

function onEnterPost(id) {
  router.push({ path: `/post/${id}` });
}

function getContent() {
  const name = route.params.name;
  if (name) {
    dataSource.value = menus.find((x) => x.label === name).children;
    pageIndex.value = Array.from(Array(dataSource.value.length), () => 0);
  }
}

watch(
  () => route.params,
  () => {
    getContent();
  }
);

onMounted(() => {
  getContent();
});
</script>

<style lang="stylus" scoped>
.primary-color
    color #219461
.secord-color
    color #F7B200
.product-container
    .children-container
        .left-arrow,.right-arrow
            img
                height 40px
                margin-bottom 38px
        .content
            width 860px
            min-height 180px
        .product-item
            img
                width 200px
                height 200px
            .title
                word-break: break-all;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
</style>
