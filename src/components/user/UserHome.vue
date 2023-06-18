<template>
  <div class="form-container">
    <el-button type="primary" @click="MyInformation" class="header-button">跳转至个人信息</el-button>
    <el-button type="primary" @click="Mydispatch" class="header-button">跳转至已审批</el-button>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="申请理由" prop="reason">
        <el-select v-model="ruleForm.reason" placeholder="请选择理由">
          <el-option label="会议出行" value="会议出行"></el-option>
          <el-option label="客户接待" value="客户接待"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请车型" prop="vehicletype">
        <el-select v-model="ruleForm.vehicletype" placeholder="请选择车型">
          <el-option label="小型车" value="小型车"></el-option>
          <el-option label="商务车" value="商务车"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" required>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-row>
          <el-col :span="11" class="line">
            <el-form-item prop="date3">
              <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleForm.date3" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="date4">
              <el-time-picker placeholder="选择结束时间" v-model="ruleForm.date4" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form-item>
      <el-form-item label="乘车人数" prop="passengercount">
        <el-input-number v-model="ruleForm.passengercount" :min="1" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
    </el-form>
    <div class="button-container">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button type="danger" @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  data() {
    return {
      userid:'',
      username:'',
      requesid:'',
      fleetid:'',
      Acount:'',
      ruleForm: {
        reason: '',
        vehicletype: '',
        date1: '',
        date2: '',
        date3:'',
        date4:'',
        passengercount: 1,
      },
      rules: {
        reason: [
          {
            required: true,
            message: '请选择申请理由',
            trigger: 'blur',
          },
        ],
        vehicletype: [
          {
            required: true,
            message: '请选择申请车型',
            trigger: 'change',
          },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        date3: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        date4: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        passengercount: [
          {
            required: true,
            message: '请输入乘车人数',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    MyInformation() {
      this.$router.push("/UserInformation");
    },
    Mydispatch(){
        this.$route.push("/UserResponseDone")
      },
    submitForm(formName) {
      this.userid = this.$store.state.userid;
      console.log('this.userid',this.userid)
      this.username=this.$store.state.username;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formattedDate1 = moment(this.ruleForm.date1).format('YYYY-MM-DD');
          const formattedTime1 = moment(this.ruleForm.date2).format('HH:mm:ss');
          const formattedDate2 = moment(this.ruleForm.date3).format('YYYY-MM-DD');
          const formattedTime2 = moment(this.ruleForm.date4).format('HH:mm:ss');

          // 输出所有选择的信息
          console.log('申请理由:', this.ruleForm.reason);
          console.log('申请车型:', this.ruleForm.vehicletype);
          console.log('申请时间:', formattedDate1 + 'T' + formattedTime1);
          console.log('结束时间:', formattedDate2 + 'T' + formattedTime2);
          console.log('乘车人数:', this.ruleForm.passengercount);

            axios
              .get('http://localhost:8081/carrequests/count')
              .then((response) => {
                const requestid = response.data;
                console.log('获取的 requestid:', requestid);
                this.requestid = requestid.count + 1;
                const requestData = {
                  requestId: this.requestid,
                  applicantId: this.userid,
                  reason: this.ruleForm.reason,
                  vehicleType: this.ruleForm.vehicletype,
                  startTime: formattedDate1 + 'T' + formattedTime1,
                  passengerCount: this.ruleForm.passengercount,
                  status: '未审批'
                };
                console.log(requestData)

                axios
                  .post('/carrequests/addCarRequest', requestData)
                  .then((response) => {
                    // 请求成功回调
                    const addedCarRequest = response.data;
                    console.log('添加成功:', addedCarRequest);

                    const requestData1 = {
                        endId:this.requestid,
                        requestId:this.userid,
                        endTime: formattedDate2 + 'T' + formattedTime2,
                      };
                      console.log(requestData1)
                      // 发送 POST 请求
                    axios.post('/carend/add', requestData1)
                      .then((response) => {
                        // 请求成功回调
                        const addedCarend = response.data;
                        console.log('carend 添加成功:', addedCarend);
                      })
                      .catch((error) => {
                        // 请求失败回调
                        console.error('carend 添加失败:', error);
                      });
                  })
                  .catch((error) => {
                    // 请求失败回调
                    console.error('添加失败:', error);
                  });
              })
              .catch((error) => {
                console.error('获取 requestid 失败:', error);
              });

              axios
              .get('http://localhost:8081/statistics/All')
              .then((response) => {
                const fleetid = response.data;
                this.fleetid = fleetid;
              })
              
              console.log('this.fleetid',this.fleetid)
              axios
              .get('http://localhost:8081/approvalrecords/count')
              .then((response) => {
                const Acount = response.data;
                console.log('获取的 Acount:', Acount);
                this.Acount = Acount.count + 1;
                const requestData3 = {
                  statisticsId: this.Acount,
                  fleetId: this.fleetid,
                  driverId: this.userid,
                  month: formattedDate1 + 'T' + formattedTime1,
                  trips: 0,
                };
                console.log('requestData3',requestData3)
                // axios
                //   .post('/statistics/add', requestData3)
                //   .then((response) => {
                //     // 请求成功回调
                //     const addedCarRequest = response.data;
                //     console.log('添加成功:', addedCarRequest);
                //   })
                //   .catch((error) => {
                //     // 请求失败回调
                //     console.error('添加失败:', error);
                //   });
              })
              .catch((error) => {
                console.error('获取 countd 失败:', error);
              });
        // 执行其他提交逻辑
        } else {
          console.log('表单校验未通过');
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.form-container {
  padding: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
