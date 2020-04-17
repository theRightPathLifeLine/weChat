let sharedCanvas = wx.getSharedCanvas()
let context = sharedCanvas.getContext('2d')
let height = 500
let width = 500
wx.onMessage(data => {
  height = data.height
  width = data.width
  if (data.cmd == "save") {
    saveData(data.data);
    // wx.removeUserCloudStorage({
    //   keyList:["s"]
    // });
    // getData();
  } else {
    getData();
    // context.fillStyle = 'red';
    // context.fillRect(0, 0, 100, 100);
  }
});



function drawRankList(data) {
  console.log(data)
  context.fillStyle = "#ffffff"
  context.font = "20px Arial"
  data.sort(function (x, y) {
    return y.KVDataList[0].value - x.KVDataList[0].value;
  })
  data.forEach((item, index) => {
    var leftImage = wx.createImage();
    leftImage.src = item.avatarUrl;
    leftImage.onload = function () {
      context.drawImage(leftImage, width / 2 - 100, (index + 1) * 40, 30, 30);
      context.fillText(item.nickname, width / 2 - 30, (index + 1) * 40 + 20);
      context.fillText(item.KVDataList[0].value, width / 2 - 60, (index + 1) * 40 + 20);
    }
  })
}

function saveData(data) {
  wx.getUserCloudStorage({
    keyList: ["s"],
    // complete: res => {
    //   let s = res.KVDataList[0].value;
    //   if(s < data){
    //     wx.setUserCloudStorage({
    //       KVDataList:[{key:"s",value:data+""}]
    //     });
    //   }
    // },
    success: res => {
      if (res.KVDataList[0]) {
        let s = res.KVDataList[0].value;
        if (s < data) {
          wx.setUserCloudStorage({
            KVDataList: [{
              key: "s",
              value: data + ""
            }],
            complete: res => {
              getData();
            }
          });
        }else{
          getData();
        }
      } else {
        wx.setUserCloudStorage({
          KVDataList: [{
            key: "s",
            value: data + ""
          }],
          complete: res => {
            getData();
          }
        });
      }
    }
  });

}

function getData() {
  wx.getFriendCloudStorage({
    keyList: ["s"],
    success: res => {
      let data = res.data
      drawRankList(data);
    },
    fail: res => {
      console.log("fail")
    }
  });
}