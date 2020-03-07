<template>
  <div class="home">
    <nav-bar class="home-nav"><div slot="center"></div></nav-bar>
    <swiper>
      <swiper-item v-for="(item, index) in banners" :key=index>
        <a :herf="item.link">
          <img :src="item.image" alt="">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from 'components/common/navbar/NavBar.vue'
import { getHomeMultiData } from 'network/home'
import SwiperItem from 'components/common/swiper/SwiperItem'
import Swiper from 'components/common/swiper/Swiper'
export default {
  name: 'Home',
  data () {
    return {
      banners: [],
      recommends: []
    }
  },
  components: {
    NavBar,
    SwiperItem,
    Swiper
  },
  created () {
    getHomeMultiData().then(res => {
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
      console.log(res.data)
    })
  }
}
</script>

<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    color: white;
  }
</style>
