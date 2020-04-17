import Animation from '../base/animation'
import DataBus   from '../databus'

const ENEMY_IMG_SRC = 'images/boo.jpg'
const ENEMY_WIDTH   = 50
const ENEMY_HEIGHT  = 70

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd(){
  let h = Math.floor(Math.random()*4 + 1);
  return h;
}

export default class Boom extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = window.innerWidth
    this.y = rnd() * ENEMY_HEIGHT

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新气球位置
  update() {
    this.x -= this[__.speed]

    // 对象回收
    if ( this.x < -this.width )
      databus.removeBoom(this)
  }
}
