<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import config from '@/admin.config.js'
export default {
  computed: {
    ...mapGetters({
      isTokenValid: 'user/isTokenValid'
    })
  },
  methods: {
    ...mapActions({
      init: 'app/init'
    })
  },
  onPageNotFound (msg) {
    uni.redirectTo({
      url: config.error.url
    })
  },
  onLaunch: function () {
    console.log('App Launch')
    if (!this.isTokenValid) {
      uni.navigateTo({
        url: config.login.url
      })
    } else {
      this.init()
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
  @import '@/common/uni.css';
  @import '@/common/uni-icons.css';
  @import '@/static/iconfont/iconfont.css';
</style>
