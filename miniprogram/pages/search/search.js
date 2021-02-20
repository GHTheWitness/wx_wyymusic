// pages/search/search.js
import request from '../../utils/request'
let isSend=false //函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'', // 默认内容
    hotList:[],
    searchContent:'',//用户输入表单项数据
    searchList:[], //关键字模糊匹配数据
    historyList:[], //搜索记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    
    this.getSearchHistory()
  },
  // 获取初始化数据
  async getInitData(){
    let {data:placeholderData}=await request('/search/default')
    let {data:hotData}=await request('/search/hot/detail')
    this.setData({
      placeholderContent:placeholderData.data.showKeyword,
      hotList:hotData.data
    })
  },
  // 获取本地历史记录的功能函数
  getSearchHistory(){
    let historyList=wx.getStorageSync('searchHistory')
    if (historyList){
      this.setData({
        historyList
      })
    }
  },
  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value.trim()
    })
    if (isSend) return;
    isSend=true
    this.getSearchList()
    // 防抖/节流
    setTimeout(()=>{
      isSend=false
    },300)

  },
  // 获取搜索数据的功能函数
  async getSearchList(){
    if (!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    let {searchContent,historyList}=this.data
    let {data:searchListData}=await request("/search",{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs?searchListData.result.songs:[]
    })

    // 如果搜索的内容在当前数组存在，则删除，再重新放到前面
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },
  clearSearchContent(){
    this.setData({
      searchContent:"",
      searchList:[]
    })
  },
  deleteSearchHistory(){
    wx.showModal({
      content:"确认删除吗？",
      success:(res)=>{
        if(res.confirm){
          // 清空data中history
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('searchHistory')
        }
      }
      // cancelColor: 'cancelColor',
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