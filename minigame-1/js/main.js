import Player from './player/index'
import Balloon from './npc/balloon'
import Boom from './npc/boom'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'

let ctx = canvas.getContext('2d')
let openDataContext = wx.getOpenDataContext()
let sharedCanvas = openDataContext.canvas
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    this.touchHandler = this.touchEventHandler1.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)


    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 20 === 0) {
      let h = Math.floor(Math.random() * 6 + 1);

      if (h != 1) {
        let enemy = databus.pool.getItemByClass('balloon', Balloon)
        enemy.init(3)
        databus.enemys.push(enemy)
      } else {
        let boom = databus.pool.getItemByClass('boom', Boom)
        boom.init(4)
        databus.booms.push(boom)
      }

    }
  }



  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          // that.music.playExplosion()
          databus.removeBullets(bullet)
          databus.score += 1

          break
        }
      }
      for (let i = 0, il = databus.booms.length; i < il; i++) {
        let enemy = databus.booms[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {

          databus.removeBullets(bullet)
          databus.gameOver = true

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX &&
      x <= area.endX &&
      y >= area.startY &&
      y <= area.endY)
      this.restart()
  }

  touchEventHandler1(e) {
    e.preventDefault();
    this.player.shoot();
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)

    databus.bullets
      .concat(databus.enemys).concat(databus.booms)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
     
      this.gameinfo.renderGameOver(ctx, databus.score)
      ctx.drawImage(sharedCanvas ,0,0);
      if (!this.hasEventBind) {
        this.hasEventBind = true
        wx.getOpenDataContext().postMessage({
          cmd:"save",
          data:databus.score,
          height:window.innerHeight,
          width:window.innerWidth
        });
        canvas.removeEventListener(
          'touchstart',
          this.touchHandler
        )
       
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys).concat(databus.booms)
      .forEach((item) => {
        item.update()
      })
    this.player.update();
    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      // this.player.shoot()
      // this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }


}