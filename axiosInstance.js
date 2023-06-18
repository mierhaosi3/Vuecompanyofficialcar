import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:8081', // 设置基础URL
  timeout: 5000, // 设置请求超时时间
});

// 设置请求拦截器
instance.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem('token'); // 从本地存储中获取token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 设置请求头中的Authorization字段
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default instance;
