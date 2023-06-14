<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" @click="showMyInformation">我的信息</el-menu-item>
      <el-menu-item index="2" @click="showMyApplication">我的申请</el-menu-item>
      <el-menu-item index="3" @click="showApply">我要申请</el-menu-item>
    </el-menu>

    <el-main>
      <el-scrollbar>
        <template v-if="currentMenu === 'showMyInformation'">
          <el-descriptions title="" direction="horizontal" :column="1" border>
            <el-descriptions-item label="用户号">user2</el-descriptions-item>
            <el-descriptions-item label="用户类型">管理员</el-descriptions-item>
            <el-descriptions-item label="姓名">李四</el-descriptions-item>
          </el-descriptions>
        </template>
        <template v-else-if="currentMenu === 'showMyApplication'">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed="left" prop="date" label="申请日期" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
            </el-table-column>
            <el-table-column prop="reason" label="申请理由" width="100">
            </el-table-column>
            <el-table-column prop="vehicletype" label="申请车型" width="100">
            </el-table-column>
            <el-table-column prop="passengercount" label="乘车人数" width="60">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <el-button @click="handleClick(scope.row)" type="danger" size="small">撤销</el-button>
            </el-table-column>
          </el-table>
        </template>
        <template v-else-if="currentMenu === 'showApply'">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" id="form1"
            name="form1">
            <el-form-item label="申请理由" prop="reason">
              <el-select v-model="ruleForm.reason" placeholder="请选择理由">
                <el-option label="会议出行" value="会议出行"></el-option>
                <el-option label="客户接待" value="客户接待"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请车型" prop="vehicletype">
              <el-select v-model="ruleForm.vehicletype" placeholder="请选择车型">
                <el-option label="小型车" value="shanghai"></el-option>
                <el-option label="商务车" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间" required>
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                    style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="乘车人数" prop="passengercount">
              <el-input-number v-model="ruleForm.passengercount" @change="handleChange" :min="1" :max="10"
                label="描述文字"></el-input-number>
            </el-form-item>
          </el-form>
          <el-row>
            <el-button type="primary" @click="submitForm('form1')">提交</el-button>
            <el-button type="danger" @click="resetForm('form1')">重置</el-button>
          </el-row>
        </template>
      </el-scrollbar>
    </el-main>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        currentMenu: '',
        size: '',
        user: {
          uname: "",
          uid: null,
        },
        tableData: [{
          date: '2016-05-02',
          reason: '会议出行',
          vehicletype: '小型车',
          passengercount: '5',
          status: '待审核',
        }, {
          date: '2016-05-02',
          reason: '会议出行',
          vehicletype: '小型车',
          passengercount: '5',
          status: '待审核',
        }, {
          date: '2016-05-02',
          reason: '会议出行',
          vehicletype: '小型车',
          passengercount: '5',
          status: '待审核',
        }, {
          date: '2016-05-02',
          reason: '会议出行',
          vehicletype: '小型车',
          passengercount: '5',
          status: '待审核',
        }],
        ruleForm: {
          reason: '',
          vehicletype: '',
          date1: '',
          date2: '',
          passengercount: 1,
        },
        rules: {
          reason: [{
            required: true,
            message: '请选择申请理由',
            trigger: 'blur'
          }],
          vehicletype: [{
            required: true,
            message: '请选择申请车型',
            trigger: 'change'
          }],
          date1: [{
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          date2: [{
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }],
          passengercount: [{
            required: true,
          }]
        }
      };
    },
    methods: {
      logout() {
        // 移除本地用户登录信息
        sessionStorage.removeItem('userInfo');
        // 跳转页面到登录页
        this.$router.push('/login');
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      async showMyInformation() {
        this.currentMenu = 'showMyInformation';
      },
      async showMyApplication() {
        this.currentMenu = 'showMyApplication';
      },
      async showApply() {
        this.currentMenu = 'showApply';
      },
      handleClick(row) {
        console.log(row);
      },
      handleChange(value) {
        console.log(value);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      if (sessionStorage.getItem('userInfo')) {
        // 将用户信息存储到sessionStorage中
        this.user = JSON.parse(sessionStorage.getItem('userInfo'));
      }
    },
  };
</script>

<style scoped>

</style>