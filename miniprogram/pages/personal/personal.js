// pages/personal/personal.js
import _request from '../../utils/request.js'
// 手指变量
let startY=0
let moveY=0
let moveDistance=0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    recentPlayList:[]
  },
  handleTouchStart(event){
    this.setData({
      coverTransition:0
    })
    startY=event.touches[0].clientY
  },
  handleTouchMove(event){
    moveY=event.touches[0].clientY
    moveDistance=moveY - startY
    if (moveDistance<=0){
      return;
    }
    if (moveDistance>=120){
      moveDistance=120
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition:`transform 1.1s linear`
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo')
    if (userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },

  // 获取用户播放记录
  async getUserRecentPlayList(userId){
    let {data:res}=await _request("/user/record",{uid:userId,type:0})
    let index=0
    let recentPlayList=res.allData.splice(0,10).map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      recentPlayList
    })
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