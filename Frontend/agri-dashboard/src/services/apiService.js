// src/services/apiService.js
import axios from 'axios';

// 创建一个 Axios 实例
const apiClient = axios.create({
  baseURL: 'https://672e243b229a881691ef1f97.mockapi.io', // 替换为您的后端 API 基础路径
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 设置请求超时时间
});

// 添加请求拦截器（可选）用于添加授权 token
apiClient.interceptors.request.use(config => {
  // 从本地存储中获取 token 并添加到请求头
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加响应拦截器（可选）用于统一错误处理
apiClient.interceptors.response.use(response => {
  return response;
}, error => {
  // 在这里处理响应错误，比如显示错误提示
  console.log(error)
  return Promise.reject(error);
});

// 定义 API 请求方法
export default {
  // 获取数据
  getOnsaleData(params = {}) {
    return apiClient.get('/onsale', params && Object.keys(params).length > 0 ? { params } : {});
  },  
  getAccountData(params) {
    return apiClient.get('/account', { params }); // 这里的 { params } 将被追加到请求 URL
  },

  // 提交数据
  postAccountData(data) {
    return apiClient.post('/account', data); // 替换为您的 API 端点
  },
  // 更新数据
  updateData(id, data) {
    return apiClient.put(`/data/${id}`, data); // 替换为您的 API 端点
  },
  // 删除数据
  deleteData(id) {
    return apiClient.delete(`/data/${id}`); // 替换为您的 API 端点
  },
};
