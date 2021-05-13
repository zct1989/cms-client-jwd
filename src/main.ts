import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import { createGraphQL } from './graphql'
import { ElCarousel, ElCarouselItem, ElAutocomplete } from 'element-plus';

const app = createApp(App)

dayjs.locale(zhCN)

const graphQL = createGraphQL()

app.use(graphQL)
app.use(router)


app.use(ElCarousel);
app.use(ElCarouselItem);
app.use(ElAutocomplete)

app.mount('#app')

