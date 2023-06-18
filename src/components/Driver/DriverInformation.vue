<template>
    <div class="user-profile">
        <el-button type="primary" @click="redirectToFinishPage" class="header-button">跳转至出车任务</el-button>

      <el-table :data="userProfileData" border>
        <el-table-column prop="attribute" label="属性"></el-table-column>
        <el-table-column label="值">
          <template #default="{ row }">
            <div class="value-cell">
              <template v-if="!row.editable">
                <template v-if="!row.disableEdit">
                  <span>{{ row.value }}</span>
                  <el-button type="primary" size="mini" class="edit-button" @click="editValue(row)" v-if="row.allowEdit" >
                    编辑
                  </el-button>
                </template>
                <template v-else>
                  <span>{{ row.value }}</span>
                </template>
              </template>
              <template v-else>
                <el-input
                  v-model="row.editedValue"
                  type="text"
                  size="mini"
                  :style="{ width: '50%' }"
                ></el-input>
                <div class="buttons-container">
                  <el-button
                    type="success"
                    size="mini"
                    class="save-button"
                    @click="saveValue(row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    type="info"
                    size="mini"
                    class="cancel-button"
                    @click="cancelEdit(row)"
                  >
                    取消
                  </el-button>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        userProfileData: [], // 存储用户信息的数组
        userid: '',      
        token:'',
      };
    },
    mounted() {
      this.token = this.$store.state.token;
      console.log(this.token)
      this.showUserProfileTable(); // 加载用户信息
    },
    methods: {
      async showUserProfileTable() {
        this.currentMenu = 'userProfile';
        // 尝试从本地存储中获取userid
        const storedUserId = localStorage.getItem('userid');
        const storeToken = localStorage.getItem('token')
        if (storedUserId) {
            this.userid = storedUserId;
            this.token = storeToken;
        } else {
            // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
            this.userid = this.$store.state.userid;
            this.token = this.$store.state.token;
            // 将userid存储到本地存储中
            localStorage.setItem('userid', this.userid);
            localStorage.setItem('token',this.token);
        }
        try {
          console.log(this.userid);
          // 请求获取用户信息数据
          const response = await fetch(
            `http://localhost:8081/user/profileUserid?userid=${this.userid}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data);
  
            // 将 data[0] 拆分为数组
            const dataArray = data[0].toString().split(',');
  
            // 对数据进行处理，转换成属性和值的格式
            this.userProfileData = [
              {
                attribute: '用户ID',
                value: dataArray[0],
                editedValue: dataArray[0],
                editable: false,
                disableEdit: true,
                allowEdit: false,
              },
              {
                attribute: '用户名',
                value: dataArray[1],
                editedValue: dataArray[1],
                editable: false,
                disableEdit: false,
                allowEdit: true,
              },
              {
                attribute: '职务',
                value: dataArray[2],
                editedValue: dataArray[2],
                editable: false,
                disableEdit: true,
                allowEdit: false,
              },
              {
                attribute: '详细信息',
                value: dataArray[4],
                editedValue: dataArray[4],
                editable: false,
                disableEdit: false,
                allowEdit: true,
              },
              {
                attribute: '姓名',
                value: dataArray[3],
                editedValue: dataArray[3],
                editable: false,
                disableEdit: false,
                allowEdit: true,
              },
              {
                attribute: '密码',
                value: dataArray[5],
                editedValue: dataArray[5],
                editable: false,
                disableEdit: false,
                allowEdit: true,
              },
            ];
          } else {
            console.error('请求出错：', response.status);
          }
        } catch (error) {
          console.error('请求出错：', error);
        }
      },
      redirectToFinishPage() {
        this.$router.push("/DriverLists");
    },
      editValue(row) {
        row.editable = true;
      },
      saveValue(row) {
        row.editable = false;
        const storedUserId = localStorage.getItem('userid');
        if (storedUserId) {
            this.userid = storedUserId;
        } else {
            // 如果本地存储中没有userid，则使用默认值或其他方式获取userid
            this.userid = this.$store.state.userid;
            // 将userid存储到本地存储中
            localStorage.setItem('userid', this.userid);
        }
        // 执行保存属性值的逻辑
        // 可以在这里向后端发送请求来保存修改后的值
        console.log('保存属性值:', row.editedValue);
        if (row.attribute === '姓名') {
            const encodedName = encodeURIComponent(row.editedValue).replace(/%3D/g, '%20'); // 将等号编码为空格
            const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
            axios.post(`/user/${this.userid}/name`, decodedName,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
            .then(() => {
                // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
                row.isEditing = false;
                setTimeout(() => {
                    location.reload(); // 一秒后刷新页面
                }, 1000);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        }else if(row.attribute === '详细信息'){
            const encodedName = encodeURIComponent(row.editedValue).replace(/%3D/g, '%20'); // 将等号编码为空格
            const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
            axios.post(`/user/${this.userid}/avatar`, decodedName,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
            .then(() => {
                // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
                row.isEditing = false;
                setTimeout(() => {
                    location.reload(); // 一秒后刷新页面
                }, 1000);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        }else if(row.attribute === '用户名'){
            const encodedName = encodeURIComponent(row.editedValue).replace(/%3D/g, '%20'); // 将等号编码为空格
            const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
            axios.post(`/user/${this.userid}/username`, decodedName,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
            .then(() => {
                // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
                row.isEditing = false;
                setTimeout(() => {
                    location.reload(); // 一秒后刷新页面
                }, 1000);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        }else if(row.attribute === '密码'){
            const encodedName = encodeURIComponent(row.editedValue).replace(/%3D/g, '%20'); // 将等号编码为空格
            const decodedName = decodeURIComponent(encodedName).trim(); // 解码并修剪字符串
            axios.post(`/user/${this.userid}/password`, decodedName,{
            headers:{
            "token": `${this.token}` // 在请求头中携带 token
            }
          })
            .then(() => {
                // 保存成功后，将 isEditing 属性设为 false，切换回非编辑状态
                row.isEditing = false;
                setTimeout(() => {
                    location.reload(); // 一秒后刷新页面
                }, 1000);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
        }
      },
      cancelEdit(row) {
        row.editable = false;
        // 取消编辑时恢复原始值
        row.editedValue = row.value;
      },
    },
  };
  </script>
  
  <style scoped>
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .value-cell {
    display: flex;
    align-items: center;
  }
  
  .buttons-container {
    margin-left: 5px;
  }
  
  .header-button2 {
    position: absolute;
    top: 40px;
    right: 0;
  }
    .edit-button {
    margin-left: auto;
    margin-right: 5px;
  }
  
  .save-button {
    margin-right: 5px;
  }
  
  .cancel-button {
    margin-right: 5px;
  }
  .header-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  </style>
  