<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title"></view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
      </view>
    </view>
    <view class="uni-container">
      <uni-clientdb ref="udb" :collection="collectionName" :options="options" page-data="replace"
       :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error}">
        <uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe>
          <uni-tr>
            <uni-th align="center">ID</uni-th>
            <uni-th width="200" align="center">站点名称</uni-th>
            <uni-th width="170" align="center">站点标题</uni-th>
            <uni-th width="170" align="center">站点地址</uni-th>
            <uni-th align="center">统计代码</uni-th>
            <uni-th align="center">根目录Id</uni-th>
            <uni-th width="180" align="center">创建时间</uni-th>
            <uni-th width="204" align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item._id}}</uni-td>
            <uni-td align="center">{{item.htmlTitle}}</uni-td>
            <uni-td align="center">{{item.siteHeader}}</uni-td>
            <uni-td align="center">{{item.siteOrigin}}</uni-td>
            <uni-td align="center">{{item.cnzzId}}</uni-td>
            <uni-td align="center">{{item.fileRootId}}</uni-td>
            <uni-td align="center">
                <uni-dateformat :date="item.createOn" :threshold="[0, 0]" />
            </uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count"
           @change="onPageChanged" />
        </view>
      </uni-clientdb>
    </view>
    <!-- #ifndef H5 -->
    <fix-window />
    <!-- #endif -->
  </view>
</template>

<script>
// 表查询配置
const dbCollectionName = 'opendb-netdisk-sites'

// 分页配置
const pageSize = 20
const pageCurrent = 1

export default {
  data () {
    return {
      query: '',
      collectionName: dbCollectionName,
      options: {
        pageSize,
        pageCurrent
      }
    }
  },
  methods: {
    loadData (clear = true) {
      this.$refs.udb.loadData({
        clear
      })
    },
    onPageChanged (e) {
      this.$refs.udb.loadData({
        current: e.current
      })
    },
    navigateTo (url) {
      uni.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData()
          }
        }
      })
    },
    confirmDelete (id) {
      this.$refs.udb.remove(id, {
        callback: (res) => { // 删除成功后的回调
          uni.showToast({
            title: '删除成功'
          })
        }
      })
    }
  }
}
</script>
<style>
  /* #ifndef H5 */
  page {
    padding-top: 85px;
  }
  /* #endif */
</style>
