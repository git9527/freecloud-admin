<template>
  <view class="uni-container">
    <uni-forms ref="form" v-model="formData" @submit="submit">
      <uni-forms-item name="htmlTitle" label="站点名称">
        <input placeholder="请输入站点名称" @input="binddata('htmlTitle', $event.detail.value)" class="uni-input-border" :value="formData.htmlTitle" />
      </uni-forms-item>
      <uni-forms-item name="siteHeader" label="站点标题">
        <input placeholder="请输入站点标题" @input="binddata('siteHeader', $event.detail.value)" class="uni-input-border" :value="formData.siteHeader" />
      </uni-forms-item>
      <uni-forms-item name="siteOrigin" label="站点地址">
        <input placeholder="请输入站点地址" @input="binddata('siteOrigin', $event.detail.value)" class="uni-input-border" :value="formData.siteOrigin" />
      </uni-forms-item>
      <uni-forms-item name="cnzzId" label="统计代码">
        <input placeholder="请输入统计代码" @input="binddata('cnzzId', $event.detail.value)" class="uni-input-border" :value="formData.cnzzId" />
      </uni-forms-item>
      <uni-forms-item name="fileRootId" label="根目录Id">
        <input placeholder="请输入根目录Id" @input="binddata('fileRootId', $event.detail.value)" class="uni-input-border" :value="formData.fileRootId" />
      </uni-forms-item>
      <view class="uni-button-group">
        <button style="width: 100px;" type="primary" class="uni-button" @click="submitForm">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;" class="uni-button">返回</button></navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>

const db = uniCloud.database()

export default {
  data () {
    return {
      formData: {
        htmlTitle: '',
        siteHeader: '',
        siteOrigin: '',
        cnzzId: '',
        fileRootId: '',
        fileRootName: ''
      }
    }
  },
  onLoad () {
  },
  methods: {
    submitForm () {
      this.$refs.form.submit()
    },

    submit (event) {
      const { value } = event.detail
      uni.showLoading({
        title: '提交中...',
        mask: true
      })
      db.collection('opendb-netdisk-sites').add(value).then(res => {
        uni.showToast({
          title: '新增成功'
        })
        this.getOpenerEventChannel().emit('refreshData')
        setTimeout(() => uni.navigateBack(), 500)
      }).catch(err => {
        uni.showModal({
          content: err.message || '请求服务失败',
          showCancel: false
        })
      }).finally(() => {
        uni.hideLoading()
      })
    }
  }
}
</script>
