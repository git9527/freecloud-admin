<template>
  <div>
    <ul class="ztree">
      <vTree v-for="(node,index) in treeData"
             :key="index"
             :checkBoxType="checkBoxType"
             :allOpen="allOpen"
             :beforeClick="beforeClick"
             :checkBox="checkBox"
             :nodeTrigger="nodeTrigger"
             :index="index"
             :tree="node"
             :first="index===0"
             :last="treeData.length-1===index"
             :currentArray="treeData"
             :parentTree="node.parentTree"
             :rootData="treeData"
             :checkBoxCallInit="checkBoxCallInit"
             :checkBoxCall="checkBoxCall"
             :clickNode="clickNode"
             :hiddenLine="hiddenLine"
             :async="async"
             :asyncCall="asyncCall"
      />
    </ul>
  </div>
</template>

<script>
import vTree from './tree-core'

export default {
  components: { vTree },
  name: 'tree',
  props: {
    treeNode: {
      type: Array,
      default: function () {
        return []
      },
      required: true
    },
    allOpen: {
      type: Boolean,
      default: null,
      required: false
    },
    nodeTrigger: {
      type: Boolean,
      default: false,
      required: false
    },
    checkBox: {
      type: Boolean,
      default: false,
      required: false
    },
    checkBoxType: {
      type: Boolean,
      default: true,
      required: false
    },
    beforeClick: {
      type: Function,
      default: null
    },
    clickNode: {
      type: Function
    },
    asyncCall: {
      type: Function
    },
    hiddenLine: {
      type: Boolean,
      default: false,
      required: false
    },
    async: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      treeData: [],
      line: '',
      first: true,
      allOpens: this.allOpen,
      checkedBoxCallArr: []
    }
  },
  methods: {
    init () {
      const tempList = JSON.parse(JSON.stringify(this.treeNode))

      const initTree = (tree, parent) => {
        for (let index = 0; index < tree.length; index++) {
          const m = tree[index]
          // tree.forEach((m, index) => {
          if (!Object.prototype.hasOwnProperty.call(m, 'id')) {
            m.id = Object.prototype.hasOwnProperty.call(m, 'id') ? m.id : null
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'open')) {
            m.open = Object.prototype.hasOwnProperty.call(m, 'open') ? m.open : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'checked')) {
            m.checked = Object.prototype.hasOwnProperty.call(m, 'checked') ? m.checked : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'checkBox')) {
            m.checkBox = Object.prototype.hasOwnProperty.call(m, 'checkBox') ? m.checkBox : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'nodeTrigger')) {
            m.nodeTrigger = Object.prototype.hasOwnProperty.call(m, 'nodeTrigger') ? m.nodeTrigger : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'checkBoxType')) {
            m.checkBoxType = this.checkBoxType
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'last')) {
            m.last = Object.prototype.hasOwnProperty.call(m, 'last') ? m.last : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'first')) {
            m.first = Object.prototype.hasOwnProperty.call(m, 'first') ? m.first : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'active')) {
            m.active = Object.prototype.hasOwnProperty.call(m, 'active') ? m.active : false
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'async')) {
            m.async = this.async
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'hiddenLine')) {
            m.hiddenLine = this.hiddenLine
          }
          if (!Object.prototype.hasOwnProperty.call(m, 'parentTree')) {
            m.parentTree = parent || null
          }

          m.children = m.children || []
          if (m.children.length > 0) { initTree(m.children, m) }
          // });
        }
      }
      initTree(tempList, null)

      this.treeData = tempList
      this.line = 'line'
      if (this.first) { this.$emit('call', this.treeData) }
    },
    changeOpenStatus () {
      const changeOpen = (data) => {
        data.forEach(d => {
          d.open = this.allOpen
          if (d.children) changeOpen(d.children)
        })
      }
      changeOpen(this.treeData)
    },
    checkBoxCallInit (arr) {
      arr.forEach(a => {
        this.checkedBoxCallArr.push(a)
      })
    },
    checkBoxCall (arr, isAdd) {
      if (isAdd) {
        arr.forEach(a => {
          this.checkedBoxCallArr.push(a)
        })
      } else {
        arr.forEach(a => {
          if (this.checkBoxCall.length === 0) { return }
          const key = (a.id ? a.id : null) + a.index + a.name

          this.checkedBoxCallArr.forEach((ss, index) => {
            if (((ss.id ? ss.id : null) + ss.index + ss.name) === key) {
              this.checkedBoxCallArr.splice(index, 1)
            }
          })
        })
      }
      this.$emit('checkBoxCall', this.checkedBoxCallArr)
    }
  },
  created () {
    this.init()
  },
  update () {
    // this.init();
  },
  mounted () {
    /* Vue.nextTick(() => {
        this.init();
      }); */
    /* 复选框回调 */
    this.$emit('checkBoxCall', this.checkedBoxCallArr)
  },
  watch: {
    allOpen () {
      this.changeOpenStatus()
    }
  }
}
</script>

<style scoped>
  @import '@/static/v-tree/css/v-tree.css';
</style>
