<template lang="pug">
.home
    .header-image
      el-carousel(autoplay trigger="click" :height="imageHeight")
        el-carousel-item
          img.w-full(:src="topImage1")
        el-carousel-item
          img.w-full(:src="topImage2")
        el-carousel-item
          img.w-full(:src="topImage3")
    .notify.py-2.text-sm.text-white
      .content-width.m-auto.flex.justify-between
        .post.flex.space-x-5.cursor-pointer(@click="onEnterPost(recent.id)" v-if='recent')
            .catalog 【{{ recent.categories.nodes[0].name }}】
            .title.flex-auto {{ recent.title }}
            .date 【{{ dateFormat(recent.date, 'YYYY.M.DD') }}】
        .more(@click="onEnterPosts")  阅读更多 >

    .load-service.flex.flex-row.content-width.m-auto
        .card-item.flex(v-for="(product,index) in productItems" :key="index" :class="{ 'open': productIndex === index, 'close': productIndex !== index }")
            .cover.relative(v-show="productIndex !== index" @click="productIndex = index")
                img.background.absolute.inset-0.z-1(:src="product.bgImage")
                .front.absolute.inset-0.z-10.flex.flex-col.items-center.justify-center.text-white
                    img.py-5(:src="product.icon")
                    .title.font-bold {{ product.title }}
                    .sub-title.text-sm {{ product.subTitle }}
            .content.p-5.w-full(v-show="productIndex === index")
                .title.space-x-2.font-bold
                    span.primary-color.text-lg {{ product.title }}
                    span.secord-color |
                    span.secord-color {{ product.subTitle }}
                .product-content.flex.flex-wrap.h-full
                    .product-content-item.flex.flex-col.justify-center.items-center(class="w-2/4 h-2/4" v-for="(item,index) in product.children")
                        img.w-20.m-2(:src="item.icon")
                        .title.cursor-pointer {{ item.title }}
                        .sub-title.text-xs.cursor-pointer {{ item.subTitle }}
    .page-container.flex.flex-row.p-10.space-x-5.content-width.m-auto
        .recent-post.flex-1
            .title.py-5.space-x-2
                span.primary-color.font-bold.text-lg 近期要问
                span.secord-color.font-bold.text-lg |
                span.secord-color.font-bold.text-lg Recent news
            .card.relative(
                v-if="recent"
                :style="{ backgroundImage: `url(${recent?.featuredImage?.node?.mediaItemUrl})` }"
            )
                .card-panel.absolute
                    .post.flex.flex-row.p-5.cursor-pointer(
                        @click="onEnterPost(recent.id)"
                    )
                        .catalog.primary-color.font-bold 【{{ recent.categories.nodes[0].name }}】
                        .title.flex-auto.primary-color.font-bold {{ recent.title }}
                        .date 【{{ dateFormat(recent.date, 'YYYY.M.DD') }}】
                    .more.space-x-1.absolute.right-0.bottom-0.p-5
                        .text.cursor-pointer.text-sm.space-x-2(@click="onEnterPosts")
                            span 阅读更多
                            span |
                            span more
                            span >


        .catalog-post.flex-1
            .catalog-header.flex.flex-row.items-center.space-x-4
                .catalog-header-item.py-5.cursor-pointer(
                    v-for="item in categories"
                    :key="item.id"
                    :class="{ active: currentCategory.id === item.id }"
                    @click="onChangeCategory(item)"
                ) {{ item.name }}
            .post-list.relative
                .post(
                    v-for="(post,index) in posts"
                    :key="post.id"
                    @click="onEnterPost(post.id)"
                )
                    .flex.flex-row.p-5.cursor-pointer(v-if="index === 0")
                        img.image(:src="post.featuredImage.node.mediaItemUrl")
                        .content.pl-5.flex.flex-col.flex-auto
                            .title
                                span.catalog.primary-color.font-bold 【{{ post.categories.nodes[0].name }}】
                                span.title.primary-color.font-bold {{ post.title }}
                            .excerpt.flex-auto(v-html="post.excerpt") 
                            .date.text-right 【{{ dateFormat(post.date, 'YYYY.M.DD') }}】
                    .flex.flex-row.p-5.cursor-pointer.no-first(v-else) 
                        .catalog.primary-color.font-bold 【{{ post.categories.nodes[0].name }}】
                        .title.flex-auto.primary-color.font-bold {{ post.title }}
                        .date.text-right 【{{ dateFormat(post.date, 'YYYY.M.DD') }}】
                .more.space-x-1.absolute.right-0.bottom-0.p-5
                    .text.cursor-pointer.text-sm.space-x-2(@click="onEnterPosts")
                        span 阅读更多
                        span |
                        span more
                        span >
</template>
<script setup lang="ts">
import { onMounted, ref } from "@vue/runtime-core";
import { gql } from "graphql-request";
import { useRouter } from "vue-router";
import topImage1 from "../assets/home/top-image-1.jpg";
import topImage2 from "../assets/home/top-image-2.jpg";
import topImage3 from "../assets/home/top-image-3.jpg";
import { useRequest } from "../graphql";
import { dateFormat } from "../shared/utils/common.util";
import LoadCover from "../assets/home/load-cover.png";
import SaveCover from "../assets/home/save-cover.png";
import BankCover from "../assets/home/bank-cover.png";
import CardCover from "../assets/home/card-cover.png";
import LoadItem1 from "../assets/home/load-1.png";
import LoadItem2 from "../assets/home/load-2.png";
import LoadItem3 from "../assets/home/load-3.png";
import LoadItem4 from "../assets/home/load-4.png";
import SaveItem1 from "../assets/home/save-1.png";
import BankItem1 from "../assets/home/bank-1.png";
import CardItem1 from "../assets/home/card-1.png";
import productBg1 from "../assets/home/product-bg-1.jpg";
import productBg2 from "../assets/home/product-bg-2.jpg";
import productBg3 from "../assets/home/product-bg-3.jpg";
import productBg4 from "../assets/home/product-bg-4.jpg";
const request = useRequest();

const categories = ref<any[]>([]);
const currentCategory = ref<any>();
const recent = ref<any>();
const posts = ref<any[]>([]);
const router = useRouter();

const productIndex = ref(0);
const imageHeight = ref("700px");

const productItems = ref<any[]>([
  {
    title: "贷款业务",
    subTitle: "Load service",
    icon: LoadCover,
    bgImage: productBg1,
    children: [
      {
        title: "个人类贷款",
        subTitle: "Personal class",
        icon: LoadItem1,
      },
      {
        title: "公司类贷款",
        subTitle: "Company class",
        icon: LoadItem2,
      },
      {
        title: "特色类贷款",
        subTitle: "Featured class",
        icon: LoadItem3,
      },
      {
        title: "综合类贷款",
        subTitle: "Integrated class",
        icon: LoadItem4,
      },
    ],
  },
  {
    title: "存款业务",
    subTitle: "Deposit service",
    icon: SaveCover,
    bgImage: productBg2,
    children: [
      {
        title: "存款业务",
        subTitle: "Deposit service",
        icon: SaveItem1,
      },
    ],
  },
  {
    title: "电子银行",
    subTitle: "Elctronic Banking Products",
    icon: BankCover,
    bgImage: productBg3,
    children: [
      {
        title: "电子银行",
        subTitle: "Elctronic Banking Products",
        icon: BankItem1,
      },
    ],
  },
  {
    title: "银行卡",
    subTitle: "Bank card products",
    icon: CardCover,
    bgImage: productBg4,
    children: [
      {
        title: "银行卡",
        subTitle: "Bank card products",
        icon: CardItem1,
      },
    ],
  },
]);

function getPostCatalog() {
  request(gql`
    query {
      categories(where: { name: "资讯文章" }) {
        nodes {
          children {
            nodes {
              id
              name
              categoryId
            }
          }
        }
      }
    }
  `).then((data) => {
    const [catalog] = data.categories.nodes;
    const nodes = catalog.children.nodes;
    categories.value = nodes;
    currentCategory.value = nodes[0];
    getPostByCategory(currentCategory.value.name);
    getLastPost(nodes.map((x) => x.categoryId));
  });
}

function getLastPost(categories) {
  request(
    gql`
      query($categories: [ID]!) {
        posts(first: 1, where: { categoryIn: $categories }) {
          nodes {
            id
            date
            title
            excerpt
            featuredImage {
              node {
                mediaItemUrl
              }
            }
            categories {
              nodes {
                name
              }
            }
          }
        }
      }
    `,
    {
      categories,
    }
  ).then((data) => {
    const nodes = data.posts.nodes;
    if (nodes.length) {
      recent.value = nodes[0];
    }
  });
}

function getPostByCategory(category) {
  request(
    gql`
      query($category: String!) {
        posts(first: 5, where: { categoryName: $category }) {
          nodes {
            id
            date
            title
            excerpt
            featuredImage {
              node {
                mediaItemUrl
              }
            }
            categories {
              nodes {
                name
              }
            }
          }
        }
      }
    `,
    {
      category,
    }
  ).then((data) => {
    if (currentCategory.value.name === category) {
      posts.value = data.posts.nodes;
    }
  });
}

function onChangeCategory(category) {
  currentCategory.value = category;
  getPostByCategory(category.name);
}

function onEnterPosts() {
  router.push({ name: "posts" });
}

function onEnterPost(id) {
  if (!id) return;

  router.push({ path: `/post/${id}` });
}

function onEnterPage(name) {
  if (!name) return;
  router.push({ path: `/page/${name}` });
}

function updateImageHeight() {
  imageHeight.value = `${document.body.clientWidth / 2.5}px`;
}

onMounted(() => {
  getPostCatalog();
  updateImageHeight();
  window.addEventListener("resize", updateImageHeight);
});
</script>
<style lang="stylus">
.home
    .primary-color
        color #219461
    .secord-color
        color #F7B200

    .notify
        background-color #219461
        .title
            min-width 400px

    @keyframes fade
        0%
            opacity 0
        100%
            opacity 1

    .load-service
        background-color #f7f7f7
        &,.cover,.content,.front
            height 424px
        .card-item
            overflow  hidden
            &.close
                width 20%
            &.open
                width 40%
                opacity 1

        .open
            transition 0.5s ease
        .close
            transition 0.5s ease

        .cover
            width 100%
            background-size 100% 100%
            background-repeat no-repeat
            background-origin 0.5 0.5
            .background
                filter blur(0.5px)
            .front
                background-color rgba(0,0,0,0.5)

        .content
            min-width 400px
            animation-name fade
            animation-duration 1s
        .active
            transition opacity 1s ease
        .product-content
            padding 10px

    .recent-post
        max-width 50%
        .card
            background-size 100% 100%
            height 400px
            .card-panel
                bottom 0
                left 0
                right 0
                height 150px
                background-color rgba(255,255,255,0.7)
                .catalog
                    min-width 100px

    .catalog-post
        max-width 50%
        .catalog-header
            .catalog-header-item
                &.active
                    color #219461
                    font-weight bold
                    font-size 20px
        .post-list
            height 400px
            background-color #F7F7F7
            .post
                .catalog
                    min-width 100px
                border-bottom dashed 1px #e0e0e0
                .image
                    width   150px
                    height 96px
                .excerpt
                    color #B6B7B7
                .no-first
                    .title
                        word-break: break-all;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
</style>
