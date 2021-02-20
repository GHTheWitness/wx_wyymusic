// pages/index/index.js
import _request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    hotListIdAndName:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // 获取轮播图
    const {data:bannerListData}=await _request("/banner",{type:1})
    this.setData({
      bannerList:bannerListData.banners
    })

    // 获取推荐歌单
    const {data:recommandListData}=await _request("/personalized",{limit:10})
    this.setData({
      recommendList:recommandListData.result
    })

    // 获取热搜榜名称和ID
    const {data:categoryList}=await _request("/toplist")
    let arr=categoryList.list.slice(0,5)
    let temp=[]
    arr.forEach(item=>{
      temp.push({
        id:item.id,
        name:item.name
      })
    })
    this.setData({
      hotListIdAndName:temp
    })
    
    // 获取排行榜数据
    let index=0
    let resultArr=[]
    while(index < 5){
      const {data:hotList}=await _request("/playlist/detail",{id:this.data.hotListIdAndName[index++]["id"]})
      let topListItem={name:hotList.playlist.name,tracks:hotList.playlist.tracks.splice(0,3)}
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    }
    // this.setData({
    //   topList:resultArr
    // })
  },
  HandleRecommend(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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