<template>
    <el-container class="layout-container-demo" style="height: 900px; margin-top: -3.5%">
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '2', '3', '4', '5']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon><message /></el-icon>用户组
              </template>
              <el-menu-item index="1-1" @click="showUserProfileTable">个人信息表</el-menu-item>
              <!-- 其他个人信息表菜单项 -->
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><icon-menu /></el-icon>车队组
              </template>
              <el-menu-item index="2-1" @click="showFleetTable">车队表</el-menu-item>
              <el-menu-item index="2-2" @click="showVehicleTable">车辆表</el-menu-item>
              <el-menu-item index="2-3" @click="showDriverTable">司机表</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><icon-menu /></el-icon>申请组
              </template>
              <el-menu-item index="3-1" @click="showCarRequestTable">用车申请表</el-menu-item>
              <!-- 其他用车申请表菜单项 -->
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><icon-menu /></el-icon>派车组
              </template>
              <el-menu-item index="4-1" @click="showDispatchProcessTable">派车流程表</el-menu-item>
              <!-- 其他派车流程表菜单项 -->
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title>
                <el-icon><icon-menu /></el-icon>审核组
              </template>
              <el-menu-item index="5-1" @click="showApprovalRecordTable">审核记录表</el-menu-item>
              <el-menu-item index="5-2" @click="showCarEndTable">用车结束表</el-menu-item>
              <el-menu-item index="5-3" @click="showStatisticsTable">统计数据表</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
  
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px"><setting /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
          </div>
        </el-header>
  
        <el-main>
          <el-scrollbar>
            <!-- 根据当前选中的菜单项显示对应的内容 -->
            <template v-if="currentMenu === 'userProfile'">
              <h3>个人信息表</h3>
              <el-button type="primary" size="small" class="table-header" @click="handleAdd">新增</el-button>

              <el-form ref="userProfileForm" :model="editForm" label-width="80px" v-if="currentMenu === 'userProfile'">
                <el-table :data="userProfileData" stripe>
                  <el-table-column prop="userid" label="用户ID"></el-table-column>
                  <el-table-column prop="username" label="用户名">
                    <template #default="{ row }">
                      <span v-if="!row.isEditing">{{ row.username }}</span>
                      <el-input v-model="row.username" v-else></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column prop="usertype" label="职务"></el-table-column>
                  <el-table-column prop="name" label="详细信息">
                    <template #default="{ row }">
                      <span v-if="!row.isEditing">{{ row.name }}</span>
                      <el-input v-model="row.name" v-else></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="avatar" label="姓名">
                    <template #default="{ row }">
                      <span v-if="!row.isEditing">{{ row.avatar }}</span>
                      <el-input v-model="row.avatar" v-else></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button type="primary" size="small" @click="handleEdit(row)" v-if="!row.isEditing">编辑</el-button>
                      <el-button type="danger" size="small" @click="handleRemove(row)">删除</el-button>
                      <el-button type="success" size="small" @click="handleSave(row)" v-if="row.isEditing">保存</el-button>
                      <el-button type="info" size="small" @click="handleCancel(row)" v-if="row.isEditing">取消</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </template>            
            <template v-else-if="currentMenu === 'fleet'">
              <h3>车队表</h3>
              <el-table :data="fleetData" stripe>
                <el-table-column prop="fleetid" label="车队ID"></el-table-column>
                <el-table-column prop="fleetname" label="车队名称">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.fleetname }}</span>
                    <el-input v-model="row.fleetname" v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="captainid" label="队长ID"></el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="FleethandleEdit(row)" v-if="!row.isEditing">编辑</el-button>
                    <el-button type="danger" size="small" @click="FleethandleRemove(row)">删除</el-button>
                    <el-button type="success" size="small" @click="FleethandleSave(row)" v-if="row.isEditing">保存</el-button>
                    <el-button type="info" size="small" @click="FleethandleCancel(row)" v-if="row.isEditing">取消</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'vehicle'">
              <h3>车辆表</h3>
              <el-table :data="vehicleData" stripe>
                <el-table-column prop="vehicleid" label="车辆ID"></el-table-column>
                <el-table-column prop="vehicletype" label="车辆类型">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.vehicletype }}</span>
                    <el-input v-model="row.vehicletype" v-else></el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="fleetid" label="所属车队ID">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.fleetid }}</span>
                    <el-input v-model="row.fleetid" v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="captainid" label="队长名称"></el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="VehiclehandleEdit(row)" v-if="!row.isEditing">编辑</el-button>
                    <el-button type="danger" size="small" @click="VehiclehandleRemove(row)">删除</el-button>
                    <el-button type="success" size="small" @click="VehiclehandleSave(row)" v-if="row.isEditing">保存</el-button>
                    <el-button type="info" size="small" @click="VehiclehandleCancel(row)" v-if="row.isEditing">取消</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </template>
            <template v-else-if="currentMenu === 'driver'">
              <h3>司机表</h3>
              <el-table :data="driverData" stripe>
                <el-table-column prop="driverid" label="司机ID"></el-table-column>
                <el-table-column prop="name" label="姓名">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.name }}</span>
                    <el-input v-model="row.name" v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="fleetid" label="所属车队ID">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.fleetid }}</span>
                    <el-input v-model="row.fleetid" v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="DriverhandleEdit(row)" v-if="!row.isEditing">编辑</el-button>
                    <el-button type="danger" size="small" @click="DriverhandleRemove(row)">删除</el-button>
                    <el-button type="success" size="small" @click="DriverhandleSave(row)" v-if="row.isEditing">保存</el-button>
                    <el-button type="info" size="small" @click="DriverhandleCancel(row)" v-if="row.isEditing">取消</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'carRequest'">
              <h3>用车申请表</h3>
              <el-table :data="carRequestData" stripe>
                <el-table-column prop="requestid" label="申请ID"></el-table-column>
                <el-table-column prop="applicantid" label="申请人ID"></el-table-column>
                <el-table-column prop="reason" label="申请原因"></el-table-column>
                <el-table-column prop="passengercount" label="乘客数量"></el-table-column>
                <el-table-column prop="vehicletype" label="车辆类型"></el-table-column>
                <el-table-column prop="starttime" label="开始时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <span v-if="!row.isEditing">{{ row.status }}</span>
                    <el-input v-model="row.status" v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" size="small" @click="CarRequesthandleEdit(row)" v-if="!row.isEditing">编辑</el-button>
                    <el-button type="danger" size="small" @click="CarRequesthandleRemove(row)">删除</el-button>
                    <el-button type="success" size="small" @click="CarRequesthandleSave(row)" v-if="row.isEditing">保存</el-button>
                    <el-button type="info" size="small" @click="CarRequesthandleCancel(row)" v-if="row.isEditing">取消</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'dispatchProcess'">
              <h3>派车流程表</h3>
              <el-table :data="dispatchProcessData" stripe>
                <el-table-column prop="processid" label="流程ID"></el-table-column>
                <el-table-column prop="requestid" label="申请ID"></el-table-column>
                <el-table-column prop="captainid" label="队长ID"></el-table-column>
                <el-table-column prop="driverid" label="司机ID"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'approvalRecord'">
              <h3>审核记录表</h3>
              <el-table :data="approvalRecordData" stripe>
                <el-table-column prop="recordid" label="记录ID"></el-table-column>
                <el-table-column prop="requestid" label="申请ID"></el-table-column>
                <el-table-column prop="approverid" label="审核人ID"></el-table-column>
                <el-table-column prop="approvaltime" label="审核时间"></el-table-column>
                <el-table-column prop="result" label="结果"></el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'carEnd'">
              <h3>用车结束表</h3>
              <el-table :data="carEndData" stripe>
                <el-table-column prop="endid" label="结束ID"></el-table-column>
                <el-table-column prop="requestid" label="申请ID"></el-table-column>
                <el-table-column prop="endtime" label="结束时间"></el-table-column>
              </el-table>
            </template>
            <template v-else-if="currentMenu === 'statistics'">
              <h3>统计数据表</h3>
              <el-table :data="statisticsData" stripe>
                <el-table-column prop="statisticsid" label="统计ID"></el-table-column>
                <el-table-column prop="fleetid" label="车队ID"></el-table-column>
                <el-table-column prop="driverid" label="司机ID"></el-table-column>
                <el-table-column prop="month" label="月份"></el-table-column>
                <el-table-column prop="trips" label="行程数"></el-table-column>
              </el-table>
            </template>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import qs from 'qs';

  export default {
    data() {
      return {
        currentMenu: '',
        jsondata:[],

        userProfileData: [], // 个人信息表数据
        jsonuserProfileData:[],
        fleetData: [], // 车队表数据
        jsonfleetData:[],
        vehicleData: [], // 车辆表数据
        jsonvehicleData:[],
        driverData: [], // 司机表数据
        jsondriverData:[],
        carRequestData: [], // 用车申请表数据
        jsoncarRequestData:[],
        dispatchProcessData: [], // 派车流程表数据
        jsondispatchProcessData:[],
        approvalRecordData: [], // 审核记录表数据
        jsonapprovalRecordData:[],
        carEndData: [], // 用车结束表数据
        jsoncarEndData:[],
        statisticsData: [], // 统计数据表数据
        jsonstatisticsData:[],
        Stringdate:'',
      };
    },
    methods: {
      async fetchTableData(url, targetData) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          this.jsonuserProfileData = data;
          this.jsondata = data;

          this[targetData] = data;
        } catch (error) {
          console.error(error);
        }
      },

      // 用户信息表==================================================================================================================
      async showUserProfileTable() {
        this.currentMenu = 'userProfile';
        await this.fetchTableData('http://localhost:8081/user/profile', 'userProfileData');
        this.userProfileData=this.jsonuserProfileData;
        for(var i=0;i<this.jsonuserProfileData.length;i++){
          this.userProfileData[i]={userid:this.jsonuserProfileData[i][0],username:this.jsonuserProfileData[i][1],usertype:this.jsonuserProfileData[i][2],avatar:this.jsonuserProfileData[i][3],name:this.jsonuserProfileData[i][4]}
        }
        this.jsondata=[];
      },
      handleAdd() {
      // 执行新增操作
      // 发送请求到后端，将新增的数据添加到数据库中
      // 成功后，将新增的数据添加到 userProfileData 数组中
      // 示例代码（需要根据实际情况进行调整）：
      const newData = {
        userid: 1,
        username: 'newuser',
        usertype: 'admin',
        name: 'New User',
        avatar: 'new-avatar.jpg',
        isEditing: false // 添加 isEditing 属性，用于记录编辑状态
      };
      this.$axios.post('/approvalrecords', newData)
        .then(response => {
          // 添加成功后，将新增的数据添加到 userProfileData 数组中
          this.userProfileData.push(response.data);
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });
      },
      handleEdit(row) {
        // 点击编辑按钮时，将对应行的 isEditing 属性设为 true，切换为可编辑状态
        row.isEditing = true;
        console.log('row',row)
      },
      handleRemove(row) {
        // 执行删除操作
        // 发送请求到后端，删除对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        this.$axios.delete(`/user/${row.userid}`)
          .then(() => {
            // 删除成功后，从 userProfileData 数组中移除对应的行数据
            const index = this.userProfileData.findIndex(item => item.userid === row.userid);
            if (index !== -1) {
              this.userProfileData.splice(index, 1);
            }
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      handleSave(row) {
        // 执行保存操作
        // 发送请求到后端，更新对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        console.log(row)
        const encodedName = encodeURIComponent(row.name).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
        this.axios.post(`/user/${row.userid}/avatar`, decodedName)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });

        const encodedName2 = encodeURIComponent(row.username).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName2 = decodeURIComponent(encodedName2).trim(); // 解码并修剪字符串
        this.axios.post(`/user/${row.userid}/username`, decodedName2)
        .then(() => {
          // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
          row.isEditing = false;
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });

        const encodedName3 = encodeURIComponent(row.avatar).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName3 = decodeURIComponent(encodedName3).trim(); // 解码并修剪字符串
        this.axios.post(`/user/${row.userid}/name`, decodedName3)
        .then(() => {
          // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
          row.isEditing = false;
        })
        .catch(error => {
          // 处理错误
          console.error(error);
        });
      },
      handleCancel(row) {
        // 取消编辑，将对应行的 isEditing 属性设为 false，恢复原始数据
        row.isEditing = false;
      },


      async showFleetTable() {
        this.currentMenu = 'fleet';
        // 请求车队表数据并赋值给fleetData
        // 示例代码，实际需要发送请求获取数据
        this.fleetData = [
          { fleetid: 1, fleetname: 'Fleet 1', captainid: 1 },
          { fleetid: 2, fleetname: 'Fleet 2', captainid: 2 },
          // 其他车队数据
        ];
        await this.fetchTableData('http://localhost:8081/fleet/Allprofile', 'fleetData');
        this.fleetData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          this.fleetData[i]={fleetname:this.jsonuserProfileData[i][0],fleetid:this.jsonuserProfileData[i][1],captainid:this.jsonuserProfileData[i][2]}
        }
        this.jsondata=[];
      },
      FleethandleEdit(row) {
        // 点击编辑按钮时，将对应行的 isEditing 属性设为 true，切换为可编辑状态
        row.isEditing = true;
        console.log('row',row)
      },
      FleethandleRemove(row) {
        // 执行删除操作
        // 发送请求到后端，删除对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        this.axios.delete(`/fleet/${row.userid}`)
          .then(() => {
            // 删除成功后，从 userProfileData 数组中移除对应的行数据
            const index = this.userProfileData.findIndex(item => item.userid === row.userid);
            if (index !== -1) {
              this.userProfileData.splice(index, 1);
            }
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      FleethandleSave(row) {
        // 执行保存操作
        // 发送请求到后端，更新对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        const encodedName2 = encodeURIComponent(row.fleetname).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName2 = decodeURIComponent(encodedName2).trim(); // 解码并修剪字符串
        this.axios.post(`/fleet/${row.fleetid}/fleetname`, decodedName2)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      FleethandleCancel(row) {
        // 取消编辑，将对应行的 isEditing 属性设为 false，恢复原始数据
        row.isEditing = false;
      },



      async showVehicleTable() {
        this.currentMenu = 'vehicle';
        // 请求车辆表数据并赋值给vehicleData

        await this.fetchTableData('http://localhost:8081/vehicles/Allprofile', 'vehicleData');
        this.vehicleData=this.jsondata;
        console.log(this.vehicleData,this.vehicleData[0][0].vehicleid)
        for(var i=0;i<this.jsondata.length;i++){
          this.vehicleData[i]={vehicleid:this.vehicleData[i][0].vehicleid,vehicletype:this.vehicleData[i][0].vehicletype,fleetid:this.vehicleData[i][0].fleetid,captainid:this.vehicleData[i][2]}
        }
        this.jsondata=[];
      },
      VehiclehandleEdit(row) {
        // 点击编辑按钮时，将对应行的 isEditing 属性设为 true，切换为可编辑状态
        row.isEditing = true;
        console.log('row',row)
      },
      VehiclehandleRemove(row) {
        // 执行删除操作
        // 发送请求到后端，删除对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        this.axios.delete(`/fleet/${row.userid}`)
          .then(() => {
            // 删除成功后，从 userProfileData 数组中移除对应的行数据
            const index = this.userProfileData.findIndex(item => item.userid === row.userid);
            if (index !== -1) {
              this.userProfileData.splice(index, 1);
            }
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      VehiclehandleSave(row) {
        // 执行保存操作
        // 发送请求到后端，更新对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        const encodedName = encodeURIComponent(row.vehicletype).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
        console.log('vehicletype',decodedName)
        this.axios.post(`/vehicles/${row.vehicleid}/VehicleType`, decodedName)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error); 
          });

          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          this.axios.post(`/vehicles/${row.vehicleid}/fleetid`, qs.stringify({ fleetid: row.fleetid }),config)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error); 
          });
      },
      VehiclehandleCancel(row) {
        // 取消编辑，将对应行的 isEditing 属性设为 false，恢复原始数据
        row.isEditing = false;
      },




      async showDriverTable() {
        this.currentMenu = 'driver';
        // 请求司机表数据并赋值给driverData
        // 示例代码，实际需要发送请求获取数据
        this.driverData = [
          { driverid: 1, name: 'Driver 1', fleetid: 1 },
          { driverid: 2, name: 'Driver 2', fleetid: 2 },
          // 其他司机数据
        ];
        await this.fetchTableData('http://localhost:8081/drivers/All', 'driverData');
        this.driverData=this.jsondata;
        console.log(this.driverData,this.jsondata)
        for(var i=0;i<this.jsondata.length;i++){
          this.driverData[i]={driverid:this.driverData[i].driverId,name:this.driverData[i].name,fleetid:this.driverData[i].fleetId}
        }
        this.jsondata=[];
      },
      DriverhandleEdit(row) {
        // 点击编辑按钮时，将对应行的 isEditing 属性设为 true，切换为可编辑状态
        row.isEditing = true;
        console.log('row',row)
      },
      DriverhandleRemove(row) {
        // 执行删除操作
        // 发送请求到后端，删除对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        this.axios.delete(`/fleet/${row.userid}`)
          .then(() => {
            // 删除成功后，从 userProfileData 数组中移除对应的行数据
            const index = this.userProfileData.findIndex(item => item.userid === row.userid);
            if (index !== -1) {
              this.userProfileData.splice(index, 1);
            }
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      DriverhandleSave(row) {
        // 执行保存操作
        // 发送请求到后端，更新对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        const encodedName = encodeURIComponent(row.name).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
        console.log('name',decodedName)
        this.axios.post(`/drivers/${row.driverid}/name`, decodedName)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error); 
          });

          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          this.axios.post(`/vehicles/${row.driverid}/fleetid`, qs.stringify({ fleetid: row.fleetid }),config)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error); 
          });
      },
      DriverhandleCancel(row) {
        // 取消编辑，将对应行的 isEditing 属性设为 false，恢复原始数据
        row.isEditing = false;
      },




      formatDateTime() {
        // 使用逗号分隔的字符串拆分为数组
        const dateTimeArray = this.Stringdate.split(',');

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
      async showCarRequestTable() {
        this.currentMenu = 'carRequest';
        // 请求用车申请表数据并赋值给carRequestData
        // 示例代码，实际需要发送请求获取数据
        this.carRequestData = [
          {
            requestid: 1,
            applicantid: 1,
            reason: 'Business trip',
            passengercount: 3,
            vehicletype: 'Car',
            starttime: '2023-06-10 09:00:00',
            status: 'Pending',
          },
          // 其他用车申请数据
        ];
        await this.fetchTableData('http://localhost:8081/carrequests/Allprofile', 'carRequestData');
        this.carRequestData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          console.log(this.carRequestData[i][0].startTime,this.jsondata.length)
          var date = this.carRequestData[i][0].startTime.join(',');
          this.Stringdate = date
          date = this.formatDateTime()
          this.carRequestData[i]={requestid:this.carRequestData[i][0].requestId,applicantid:this.carRequestData[i][1],reason:this.carRequestData[i][0].reason,
                                  passengercount:this.carRequestData[i][0].passengerCount,vehicletype:this.carRequestData[i][0].vehicleType,starttime:date,
                                  status:this.carRequestData[i][0].status}
        }
        this.Stringdate='';
        this.jsondata=[];
      },


      CarRequesthandleEdit(row) {
        // 点击编辑按钮时，将对应行的 isEditing 属性设为 true，切换为可编辑状态
        row.isEditing = true;
        console.log('row',row)
      },
      CarRequesthandleRemove(row) {
        // 执行删除操作
        // 发送请求到后端，删除对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        this.axios.delete(`/fleet/${row.userid}`)
          .then(() => {
            // 删除成功后，从 userProfileData 数组中移除对应的行数据
            const index = this.userProfileData.findIndex(item => item.userid === row.userid);
            if (index !== -1) {
              this.userProfileData.splice(index, 1);
            }
          })
          .catch(error => {
            // 处理错误
            console.error(error);
          });
      },
      CarRequesthandleSave(row) {
        // 执行保存操作
        // 发送请求到后端，更新对应行数据
        // 示例代码（需要根据实际情况进行调整）：
        const encodedName = encodeURIComponent(row.status).replace(/%3D/g, '%20'); // 将等号编码为空格
        const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
        console.log('status',decodedName)
        this.axios.post(`/carrequests/${row.requestid}/status`, decodedName)
          .then(() => {
            // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
            row.isEditing = false;
          })
          .catch(error => {
            // 处理错误
            console.error(error); 
          });
      },
      CarRequesthandleCancel(row) {
        // 取消编辑，将对应行的 isEditing 属性设为 false，恢复原始数据
        row.isEditing = false;
      },

      async showDispatchProcessTable() {
        this.currentMenu = 'dispatchProcess';
        // 请求派车流程表数据并赋值给dispatchProcessData
        // 示例代码，实际需要发送请求获取数据
        this.dispatchProcessData = [
          {
            processid: 1,
            requestid: 1,
            captainid: 1,
            driverid: 1,
            status: 'Dispatched',
          },
          // 其他派车流程数据
        ];
        await this.fetchTableData('http://localhost:8081/dispatchprocess/Allprofile', 'dispatchProcessData');
        this.dispatchProcessData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          this.dispatchProcessData[i]={processid:this.dispatchProcessData[i][0].processId,requestid:this.dispatchProcessData[i][0].requestId,captainid:this.dispatchProcessData[i][1],
                                  driverid:this.dispatchProcessData[i][2],status:this.dispatchProcessData[i][0].status}
                                }
                                this.jsondata=[];
      },
      async showApprovalRecordTable() {
        this.currentMenu = 'approvalRecord';
        // 请求审核记录表数据并赋值给approvalRecordData
        // 示例代码，实际需要发送请求获取数据
        this.approvalRecordData = [
          {
            recordid: 1,
            requestid: 1,
            approverid: 2,
            approvaltime: '2023-06-10 10:00:00',
            result: 'Approved',
          },
          // 其他审核记录数据
        ];
        await this.fetchTableData('http://localhost:8081/approvalrecords/Allprofile', 'approvalRecordData');
        this.approvalRecordData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          console.log(this.approvalRecordData[i][0])
          var date = this.approvalRecordData[i][0].approvalTime.join(',');
          this.Stringdate = date
          date = this.formatDateTime()
          this.approvalRecordData[i]={recordid:this.approvalRecordData[i][0].recordId,requestid:this.approvalRecordData[i][0].requestId,approverid:this.approvalRecordData[i][2],
                            approvaltime:date,result:this.approvalRecordData[i][0].result}
        }
        this.Stringdate='';
        this.jsondata=[];
      },
      async showCarEndTable() {
        this.currentMenu = 'carEnd';
        // 请求用车结束表数据并赋值给carEndData
        // 示例代码，实际需要发送请求获取数据
        this.carEndData = [
          {
            endid: 1,
            requestid: 1,
            endtime: '2023-06-10 18:00:00',
          },
          // 其他用车结束数据
        ];
        await this.fetchTableData('http://localhost:8081/carend/Allprofile', 'carEndData');
        this.carEndData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          console.log(this.carEndData[i][0].endTime,this.jsondata.length)
          var date = this.carEndData[i][0].endTime.join(',');
          this.Stringdate = date
          date = this.formatDateTime()
          this.carEndData[i]={endid:this.carEndData[i][0].endId,requestid:this.carEndData[i][1],endtime:date}
        }
        this.Stringdate='';
        this.jsondata=[];
      },
      async showStatisticsTable() {
        this.currentMenu = 'statistics';
        // 请求统计数据表数据并赋值给statisticsData
        // 示例代码，实际需要发送请求获取数据
        this.statisticsData = [
          {
            statisticsid: 1,
            fleetid: 1,
            driverid: 1,
            month: 6,
            trips: 10,
          },
          // 其他统计数据
        ];
        await this.fetchTableData('http://localhost:8081/statistics/Allprofile', 'statisticsData');
        this.statisticsData=this.jsondata;
        for(var i=0;i<this.jsondata.length;i++){
          this.statisticsData[i]={statisticsid:this.statisticsData[i][0],fleetid:this.statisticsData[i][1],driverid:this.statisticsData[i][2],
                                  month:this.statisticsData[i][3],trips:this.statisticsData[i][4]}
                                }
                                this.jsondata=[];
      },
    },
  };
  </script>
  
  <style scoped>
  .layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-dark-3);
  }
  .layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    height: 100%;
  }
  .layout-container-demo .toolbar .el-icon {
    font-size: 16px;
    cursor: pointer;
    color: var(--el-text-color-primary);
  }
  .layout-container-demo .toolbar span {
    margin-right: 20px;
    font-size: 12px;
    font-weight: 500;
  }
    .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  </style>
  