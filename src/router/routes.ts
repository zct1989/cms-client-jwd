import Home from '../pages/home.vue'
import Page from '../pages/page.vue'
import Post from '../pages/post.vue'
import Posts from '../pages/posts.vue'
import Product from '../pages/product.vue'
import About from '../pages/about.vue'

export const routes = [
    { path: '/', component: Home },
    { name: 'product', path: '/product/:name', component: Product },
    { name: 'page', path: '/page/:name', component: Page },
    { name: 'post', path: '/post/:id', component: Post },
    { name: 'posts', path: '/posts', component: Posts },
    { name: 'about', path: '/about', component: About},
]