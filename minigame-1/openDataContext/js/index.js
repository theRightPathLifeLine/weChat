wx.onMessage(data => {
  console.log("data"+data.data)
  let a = data.data;
  wx.setUserCloudStorage({
    KVDataList:[{key:"s",value:"a"}]
  });
  
  wx.getFriendCloudStorage({
    success: res => {
      let data = res.data
      console.log(data)
      drawRankList(data)
    },
    fail: res => {
      console.log("fail")
    }
  });
});

let sharedCanvas = wx.getSharedCanvas()
let context = sharedCanvas.getContext('2d')

function drawRankList(data) {
  data.forEach((item, index) => {
    console.log(item);
    console.log(index);

  })
}

wx.setUserCloudStorage({
  KVDataList:[{key:"s",value:"10"}]
});

wx.getFriendCloudStorage({
  success: res => {
    let data = res.data
    console.log(data)
    drawRankList(data)
  },
  fail: res => {
    console.log("fail")
  }
});