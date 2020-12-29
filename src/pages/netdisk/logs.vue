<template>
    <view>
        <view class="uni-container">
            <uni-clientdb ref="dataQuery" :collection="collectionName" :options="options" where="actionType in ['create-folder', 'upload-file', 'delete-file', 'rename-folder', 'rename-file', 'move-file', 'delete-folder']" page-data="replace"
                :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
                v-slot:default="{data,pagination,loading,error}">
                <uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe>
                    <uni-tr>
                        <uni-th width="100" align="center">操作人</uni-th>
                        <uni-th width="120" align="center">操作类型</uni-th>
                        <uni-th min-width="170" align="center">操作细节</uni-th>
                        <uni-th width="170" align="center">操作时间</uni-th>
                    </uni-tr>
                    <uni-tr v-for="(item,index) in data" :key="index">
                        <uni-td align="center">{{item.actionBy}}</uni-td>
                        <uni-td align="center">{{item.actionType}}</uni-td>
                        <uni-td align="center">{{item.actionDetail}}</uni-td>
                        <uni-td align="center">
                            <uni-dateformat :date="item.actionOn" :threshold="[0, 0]" />
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
const dbCollectionName = 'opendb-netdisk-logs'
const dbOrderBy = 'actionOn desc'
// 分页配置
const pageSize = 20
const pageCurrent = 1

export default {
  data () {
    return {
      query: '',
      loading: false,
      orderby: dbOrderBy,
      collectionName: dbCollectionName,
      options: {
        pageSize,
        pageCurrent
      }
    }
  },
  methods: {
    loadData (clear = true) {
      this.$refs.dataQuery.loadData({
        clear
      })
    },
    onPageChanged (e) {
      this.$refs.dataQuery.loadData({
        current: e.current
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
