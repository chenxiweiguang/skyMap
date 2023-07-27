<template>
    <div>
      <el-button type="primary" size="mini" @click="handlePrint()">打印二维码</el-button>
      <el-dialog title="打印二维码" width="75%" :visible.sync="innerVisible">
        <div id="print" ref="print" v-loading="!qrcodeCompleted">
          <div v-for="(item, index) in qrcodeCount" style="display: inline-block;text-align: center;margin:10px 10px;">
            <vue-qr :logoSrc="logoSrc" :text="item.value" :size="120" :margin="0"></vue-qr>
          </div>
        </div>
        <el-button type="primary" v-print="'#print'">打印二维码</el-button>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import VueQr from 'vue-qr'
  export default {
    name: 'Index',
    components: { VueQr },
    created() {
    },
    mounted() {
    },
    data(){
      return{
        qrcodeCount: [],
        qrcodeCompleted: false,
        innerVisible: false,
        logoSrc: require('../../assets/img/guaileen.png'),
      }
    },
    methods: {
      handlePrint() {
        this.$prompt('二维码数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^-?[1-9]\d*$/,
          inputErrorMessage: '必须为数字'
        }).then(({ value }) => {
          if (value > 200 && value != null) {
            this.$message.info('一次最多打印200个')
            return
          }
          this.qrcodeCount = []
          this.qrcodeCompleted = true
          this.innerVisible = true
          for (let i = 1; i <= parseInt(value); i++) {
            this.qrcodeCount.push({
              value: "https://www.baidu.com/"
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
  </script>