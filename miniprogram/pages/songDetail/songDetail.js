// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import _request from '../../utils/request'
const appInstance=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    musicId:'',
    musicLink:'',
    currentTime:'00:00', //实时时间
    durationTime:'00:00', //总时长
    currentWidth:0  //实时进度条长度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusicInfo(options.musicId)
    this.setData({
      musicId:options.musicId
    })

    // 判断当前页面是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.musicId){
      //修改当前页面音乐播放状态为true
      this.setData({
        isPlay:true
      })
    }

    // 创建音乐播放
    this.backgroundAudioManager = wx.getBackgroundAudioManager()  
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isPlay:false
      })
      this.changePlayState(true)
      appInstance.globalData.musicId=options.musicId
    })
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay:false
      })
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
      this.changePlayState(false)
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })

    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(()=>{
      // 自动切换下一首。自动播放
      PubSub.publish("switchType","next")
      this.setData({
        currentWidth:0,
        currentTime:'00:00', //实时时间
      })
    }) 
  },
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay=isPlay
  },
  async getMusicInfo(mid){
    const {data:res}=await _request("/song/detail",{ids:mid})
    let durationTime=moment(res.songs[0].dt).format('mm:ss')
    this.setData({
      song:res.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: res.songs[0].name,
    })
  },
  // 点击播放暂停事件
  handleMusicPlay(){
    let isPlay=!this.data.isPlay
    
    let {musicId,musicLink}=this.data
    this.musicControl(isPlay,musicId,musicLink)
  },
  async musicControl(isPlay,musicId,musicLink){
    
    if (isPlay){
      if (!musicLink){
        // 获取音乐播放链接
        let {data:musicLinkData}= await _request("/song/url",{id:musicId})
        musicLink=musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }

      this.backgroundAudioManager.title=this.data.song.name
      this.backgroundAudioManager.src =musicLink
    }else{
      this.backgroundAudioManager.pause()
    }
  },
  
  //点击切歌回调
  handleSwitch(event){
    let type=event.currentTarget.id;
    // 关闭当前播放的音乐
    this.backgroundAudioManager.pause()
    PubSub.subscribe("musicId",(msg,musicId)=>{
      console.log(musicId);
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe("musicId")
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish("switchType",type)
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