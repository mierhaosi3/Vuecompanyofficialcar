
<template>
  <el-container direction="vertical" class="container">
    <el-main style="padding: 20px;">
      <el-card class="common-layout" shadow="never">
        <el-button type="primary" @click="MyInformation" class="header-button">跳转至个人信息</el-button>


        <div class="header-container">
          <h3 class="header-title">出车任务</h3>
        </div>
        <el-card v-for="(dataBlock, index) in dataBlocks" :key="dataBlock.id" class="data-block">
          <el-card-header>{{ dataBlock.title }}</el-card-header>
          <div class="responsive-table-wrapper"> 
          <div class="header-spacer"></div> <!-- 添加一个空白占位元素 -->
            <el-table :data="[dataBlock]" :row-class-name="getRowClassName" border size="small" class="responsive-table">
              <el-table-column prop="requestid" label="出车任务号" min-width="100"></el-table-column>
              <el-table-column prop="applicantName" label="申请人名称" min-width="100"></el-table-column>
              <el-table-column prop="captainName" label="车队队长" min-width="100"></el-table-column>
            </el-table>
          </div>
          <div class="responsive-table-wrapper">
            <el-table :data="[dataBlock]" :row-class-name="getRowClassName" border size="small" class="responsive-table">
              <el-table-column prop="driverid" label="出车司机" min-width="100"></el-table-column>
              <el-table-column prop="vehicleid" label="车辆号" min-width="100"></el-table-column>
            </el-table>
          </div>

        </el-card>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'ApprovalPage',
  data() {
    return {
      dataBlocks: [],
      Stringdate:'',
      Turndate:'',
      formValues: {}, // 添加一个用于存储表单值的对象
      drivers: [], 
      formValues: {} ,
      userid:'',
      cars: [], // 用于存储车辆数据的数组
      token:'',
      username:''
    };
  },
  mounted() {
    this.token = this.$store.state.token;
    localStorage.setItem('token', this.token); // 保存 token 到本地存储中
    console.log(this.token)
    this.showDispatchTable();
    this.fetchDrivers();
    this.fetchCars();
    window.addEventListener('resize', this.setTableWidth);
    this.setTableWidth();
    this.resgister();

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
        this.$router.push("/DriverInformation");
      },
    async fetchDrivers() {
      const storedUserId = localStorage.getItem('userid');
        if (storedUserId) {
            this.userid = storedUserId;
        } else {
            // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
            this.userid = this.$store.state.userid;
            // 将userid存储到本地存储中
            localStorage.setItem('userid', this.userid);
        }
      try {
        const response = await axios.get(`http://localhost:8081/drivers/AllDrivers/${this.userid}`,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          });
        this.drivers = response.data; 
        console.log(this.drivers)
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCars() {
      const storedUserId = localStorage.getItem('userid');
        if (storedUserId) {
            this.userid = storedUserId;
        } else {
            // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
            this.userid = this.$store.state.userid;
            // 将userid存储到本地存储中
            localStorage.setItem('userid', this.userid);
        }
      try {
        const response = await axios.get(`http://localhost:8081/drivers/AllCaptionCar/${this.userid}`,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          });
        this.cars = response.data; 
        console.log(this.cars)
      } catch (error) {
        console.error(error);
      }
    },
    async resgister(){
      const storedUserId = localStorage.getItem('userid');
      this.username = this.$store.state.username
      if (storedUserId) {
        this.userid = storedUserId;
      } else {
        // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
        this.userid = this.$store.state.userid;
        // 将userid存储到本地存储中
        localStorage.setItem('userid', this.userid);
      }
      
      try {
        const response = await axios.get(`http://localhost:8081/drivers/count/${this.userid}`, {
          headers: {
            "token": this.token // 在请求头中携带 token
          }
        });
          if (response.data.length === 0) {
            // 如果返回的数据为空值，调用添加司机接口
            await axios.post(`http://localhost:8081/drivers/addDriver`, {
              name: this.username,
              driverid: this.userid
            }, {
              headers: {
                "token": this.token
              }
            });
            // 再次调用获取驾驶员接口
            const updatedResponse = await axios.get(`http://localhost:8081/drivers/count/${this.userid}`, {
              headers: {
                "token": this.token
              }
            });
            this.cars = updatedResponse.data;
          } else {
            this.cars = response.data;
          }
            console.log(this.cars);
          } catch (error) {
            console.error(error);
          }
    },
    carsubmit(dataBlock) {
      // 获取选择的值
      const selectedDriver = this.formValues[dataBlock.id + '_driver'];
      const selectedCar = this.formValues[dataBlock.id + '_car'];

      // 构造要发送给后端的数据
      const requestData = {
        driver: selectedDriver,
        car: selectedCar
      };

      console.log(dataBlock.requestid,selectedDriver,selectedCar);
      var driverid = selectedDriver;
      var vehicleid = selectedCar

      const formData = new FormData();
      formData.append('driverid', driverid);

      const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      this.axios.post(`/dispatchprocess/${dataBlock.requestid}/vehicleid`, qs.stringify({ vehicleid: vehicleid }), config,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
        .then(async () => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            dataBlock.isEditing = false;
            setTimeout(async () => {
            // 先清空之前的数据
            this.dataBlocks = [];
            // 发送异步请求获取最新的数据
            await this.showDispatchTable();
        }, 1000);
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });


        this.axios.post(`/dispatchprocess/${dataBlock.requestid}/driverid`, qs.stringify({ driverid: driverid }), config,{
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
        
        

      // 发送POST请求给后端
      this.axios.post(`/dispatchprocess/${dataBlock.requestid}/status`, '已派车',{
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

    async showDispatchTable() {
      // 发送请求获取表格数据
      const storedUserId = localStorage.getItem('userid');
      const storedToken = localStorage.getItem('token');
      this.token = storedToken;
      console.log(this.token)
      // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
      this.userid = this.$store.state.userid;
      const response = await axios.get(`http://localhost:8081/dispatchprocess/drivers/${this.userid}`,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          });
      const responseData = response.data;
      
      console.log('responseData',responseData);
      // 处理后端返回的数据
      this.dataBlocks = responseData.map((data, index) => {
        const process = data[0];
        const captainName = data[1];
        const driverName = data[2];
        const username = data[3];
        const driverid = data[2]
        const vehicleid = data[0].vehicleid

        return {
          id: index + 1,
          title: `出车任务${index + 1}`,
          form: {},
          items: [
            {
              id: index + 1,
              value: '',
            },
          ],
          requestid: process.requestId,
          applicantName: username,
          captainName: captainName,
          driverName: driverName,
          driverid:driverid,
          vehicleid:vehicleid
        };
      });
    },

    async fetchTableData(url, dataProp) {
      // 从数据库获取数据的异步请求
      try {
        const storedToken = localStorage.getItem('token');
        const response = await fetch(url,{
            headers: {
              "token": storedToken // 使用从本地存储中恢复的 token 值
            }
          });
        if (response.ok) {
          const data = await response.json();
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
.header-button2 {
  position: absolute;
  top: 40px;
  right: 0;
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
