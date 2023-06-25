<template>
  <el-container direction="vertical" class="container">
    <el-main style="padding: 20px;">
      <el-card class="common-layout" shadow="never">
        <div class="header-container">
          <el-button type="primary" @click="MyInformation" class="header-button">跳转至个人信息</el-button>
          <!-- <el-button type="primary" @click="Mydispatch" class="header-button">跳转至已审批</el-button> -->
          <h3 class="header-title">我的申请</h3>
        </div>
        <el-card v-for="(dataBlock, index) in dataBlocks" :key="dataBlock.id" class="data-block">
          <el-card-header>{{ dataBlock.title }}</el-card-header>
          <div class="responsive-table-wrapper">
          <div class="header-spacer"></div> <!-- 添加一个空白占位元素 -->
            <el-table :data="[dataBlock]" :row-class-name="getRowClassName" border size="small" class="responsive-table">
              <el-table-column prop="requestid" label="申请号" min-width="100"></el-table-column>
              <el-table-column prop="passengerCount" label="乘客数量" min-width="100"></el-table-column>
            </el-table>
          </div>
          <div class="responsive-table-wrapper">
            <el-table :data="[dataBlock]" :row-class-name="getRowClassName" border size="small" class="responsive-table">
              <el-table-column prop="reason" label="申请原因" min-width="100"></el-table-column>
              <el-table-column prop="vehicleType" label="车辆类型" min-width="100"></el-table-column>
              <el-table-column prop="status" label="状态" min-width="100"></el-table-column>
            </el-table>
          </div>
          <div class="responsive-table-wrapper">
            <el-table :data="[dataBlock]" :row-class-name="getRowClassName" border size="small" class="responsive-table">
              <!-- <el-table-column prop="status" label="状态" min-width="100"></el-table-column> -->
              <el-table-column prop="startTime" label="申请时间" min-width="100"></el-table-column>

            </el-table>
          </div>
          <!-- <el-card class="approval-form">
            <el-form :model="formValues" label-width="80px">
              <el-form-item>
                <el-button type="primary" @click="carsubmit(dataBlock)">撤销</el-button>
              </el-form-item>
            </el-form>
          </el-card> -->
        </el-card>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'ApprovalPage',
  data() {
    return {
      dataBlocks: [],
      Stringdate:'',
      Turndate:'',
      formValues: {}, // 添加一个用于存储表单值的对象
      carRequestData: [],
      token:'',
      userid:'',
    };
  },
  mounted() {
    this.token = this.$store.state.token;
    this.userid = this.$store.state.userid;
    console.log(this.token)
    this.showCarRequestTable();
    window.addEventListener('resize', this.setTableWidth);
    this.setTableWidth();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableWidth);
  },
  methods: {
    setTableWidth() {
      const tableRefs = this.$refs.tableRef;
      if (tableRefs) {
        if (Array.isArray(tableRefs)) {
          tableRefs.forEach((tableRef) => {
            tableRef.doLayout();
          });
        } else {
          tableRefs.doLayout();
        }
      }
    },
    MyInformation() {
      this.$router.push("/UserHome");
    },
    Mydispatch(){
        this.$route.push("/UserResponseDone")
      },
    carsubmit(dataBlock){
      for (const itemId in this.formValues[dataBlock.id]) {
        const selectedValue = this.formValues[dataBlock.id][itemId];
        console.log('Item ID:', itemId); // 输出选项的ID
        console.log('Selected Value:', selectedValue); // 输出选项的值（true或false）
      }

      this.axios.post(`/carrequests/${dataBlock.requestid}/status`, '未审批',{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
        .then(() => {
          // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
          dataBlock.isEditing = false;
          setTimeout(() => {
            location.reload(); // 一秒后刷新页面
          }, 1000);
        })
        .catch(error => {
          // 处理错误
          console.error(error); 
        });
    },
    async showCarRequestTable() {
      this.currentMenu = 'carRequest';

      // 请求用车申请表数据并赋值给carRequestData
      await this.fetchTableData(`http://localhost:8081/carrequests/applicant/${this.userid}`, 'carRequestData',{
        headers: {
            'token': this.token
          }
      });
      console.log(this.carRequestData,this.userid)
      // 根据carRequestData的长度生成相应数量的数据块
      this.dataBlocks = this.carRequestData.map((data, index) => {
        console.log(data.startTime)
        this.Stringdate = data.startTime;
        this.Turndate = this.formatDateTime();
        console.log(data);

          return {
            id: index + 1,
            title: `数据块${index + 1}`,
            form: {},
            items: [
              {
                id: index + 1,
                label: '通过/驳回',
                value: '',
              },
            ],
            requestid: data.requestId,  
            applicantId: data.applicantId,
            passengerCount: data.passengerCount,
            reason: data.reason,
            vehicleType: data.vehicleType,
            startTime: this.Turndate,
            status:data.status,
          };
      }).filter(block => block !== null); // 过滤掉为 null 的数据块
    },
    formatDateTime() {
        // 使用逗号分隔的字符串拆分为数组
        
        const dateTimeArray = Object.values(this.Stringdate);
        // 提取数组中的年、月、日、小时和分钟
        const year = dateTimeArray[0];
        const month = dateTimeArray[1];
        const day = dateTimeArray[2];
        const hour = dateTimeArray[3];
        const minute = dateTimeArray[4];

        // 将月份和日期补零，确保为两位数
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');

        // 将小时和分钟补零，确保为两位数
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMinute = String(minute).padStart(2, '0');

        // 返回格式化后的日期时间字符串
        return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}:00`;

      },
      async fetchTableData(url, dataProp) {
        try {
          const response = await this.axios.get(url, {
            headers: {
              "token": `${this.token}`
            }
          });
          if (response.status >= 200 && response.status < 300) {
            const data = response.data;
            this[dataProp] = data;
          } else {
            console.error('请求出错：', response.status);
          }
        } catch (error) {
          console.error('请求出错：', error);
        }
      },
  },
};
</script>

<style scoped>
.common-layout {
  padding: 20px;
}

.data-block {
  display: flex;
  margin-bottom: 20px;
}

.approval-form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.header-button2 {
  position: absolute;
  top: 40px;
  right: 0;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.data-block {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
}


.responsive-table-wrapper {
  overflow-x: auto;
}

.responsive-table {
  width: 100%;
}
.header-container {
  position: relative;
}

.header-button {
  position: absolute;
  top: 0;
  right: 0;
}
.header-title {
  margin: 0;
}
.header-spacer{
  height: 20px;
}
</style>
