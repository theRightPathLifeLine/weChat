const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 8, 119, 18, screenWidth / 2 - 150, 10, 300, 550)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    // ctx.fillText(
    //   '游戏结束',
    //   screenWidth / 2 - 40,
    //   screenHeight / 2 - 100 + 50
    // )

    // ctx.fillText(
    //   '得分: ' + score,
    //   screenWidth / 2 - 40,
    //   screenHeight / 2 - 100 + 130
    // )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 330,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 355
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 330,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 405
    }
  }
}

