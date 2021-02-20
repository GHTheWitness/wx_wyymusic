import config from "./config.js"
// 发送ajax请求
export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.baseUrl+url,
      data,
      method,
      header:{
        Cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies'):''
      },
      success:res=>{
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}