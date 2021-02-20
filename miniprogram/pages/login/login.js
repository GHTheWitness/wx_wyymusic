// pages/login/login.js
import _request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:'',
    userInfo:{}
  },
  handleInput(event){
    let type=event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
  async login(){
    let {phone,password}=this.data
    if (!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:"none"
      })
      return;
    }
    let phoneReg=/^1([3-9])\d{9}$/
    if (!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon:"error"
      })
      return;
    }
    if (!password){
      wx.showToast({
        title: '密码不能为空',
        icon:"error"
      })
      return;
    }

    // 后端验证
    let {data:res} = await _request("/login/cellphone",{phone,password})
    if (res.code === 200) {
      wx.setStorageSync('userInfo',JSON.stringify(res.profile))
      wx.setStorage({
        data: res.cookie,
        key: 'cookies',
      })
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
      wx.showToast({
        title: '登录成功',
      })
    }else if (res.code === 400){
      wx.showToast({
        title: '手机号或密码错误',
        icon:"none"
      })
    }else if (res.code === 502){
      wx.showToast({
        title: '手机号或密码错误',
        icon:"none"
      })
    }else{
      wx.showToast({
        title: '登录繁忙,请重新登陆',
        icon:"none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /** 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})