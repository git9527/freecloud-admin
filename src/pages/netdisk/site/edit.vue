<template>
  <view class="uni-container">
    <uni-forms ref="form" v-model="formData" @submit="submit">
      <uni-forms-item label="Id">
        <input disabled v-model="formData._id" class="uni-input-border uni-disabled"/>
      </uni-forms-item>
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
const dbCollectionName = 'opendb-netdisk-sites'

export default {
  data () {
    return {
      formData: {
        _id: '',
        htmlTitle: '',
        siteHeader: '',
        siteOrigin: '',
        cnzzId: '',
        fileRootId: '',
        fileRootName: ''
      }
    }
  },
  onLoad (e) {
    const id = e.id
    this.formDataId = id
    this.getDetail(id)
  },
  methods: {
    submitForm (form) {
      this.$refs.form.submit()
    },

    /**
       * 表单提交
       * @param {Object} event 回调参数 Function(callback:{value,errors})
       */
    submit (event) {
      const { value } = event.detail
      uni.showLoading({
        title: '修改中...',
        mask: true
      })
      // 使用 uni-clientDB 提交数据
      db.collection(dbCollectionName).where({
        _id: this.formDataId
      }).update(value).then((res) => {
        uni.showToast({
          title: '修改成功'
        })
        this.getOpenerEventChannel().emit('refreshData')
        setTimeout(() => uni.navigateBack(), 500)
      }).catch((err) => {
        uni.showModal({
          content: err.message || '请求服务失败',
          showCancel: false
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },

    /**
       * 获取表单数据
       * @param {Object} id
       */
    getDetail (id) {
      uni.showLoading({
        mask: true
      })
      db.collection(dbCollectionName)
        .doc(id)
        .get()
        .then((res) => {
          this.formData = res.result.data[0]
        }).catch((err) => {
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
