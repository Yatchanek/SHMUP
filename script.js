const gameWindow = document.getElementById('game')
const ctx = gameWindow.getContext('2d')
const stars = []
const keys = {}
const playerSprite = new Image()
playerSprite.src = 'Ship4.png'
const exhaustSprite = new Image()
exhaustSprite.src = 'exhaust.png'

let gameWidth, gameHeight
let lastFrame = 0
let player, planet

class Exhaust {
    constructor(x, y, sprite) {
        this.x = x
        this.y = y
        this.sprite = sprite
        this.frameCount = 0;
        this.spriteFrame = 0;
    }

    update() {
        if (++this.frameCount % 5 === 0) {
            this.spriteFrame++
        }
    }

    draw() {
        ctx.drawImage(this.sprite, (this.spriteFrame % 4) * 32, 0, 32, 32, this.x, this.y, 32, 32)
    }
}

class Starship {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = 0
        this.vy = 0
        this.ax = 0
        this.ay = 0
    }

    draw() {
        ctx.save()
        ctx.drawImage(this.sprite, this.x, this.y)
        ctx.restore()
    }

    update(delta) {
       // this.vx += this.ax * delta
       // this.vy += this.ay * delta
    
        this.x += this.vx * delta
        this.y += this.vy * delta
        this.exhaust.x += this.vx * delta
        this.exhaust.y += this.vy * delta
    }
}


class Player extends Starship {
    constructor(x, y) {
        super(x, y)
        this.color = 'rgba(255, 0, 0, 1)'
        this.ax = -2
        this.speed = 250
        this.sprite = playerSprite
        this.exhaust = new Exhaust(this.x - 32, this.y + 8, exhaustSprite)
        this.sizeX = this.sprite.width
        this.sizeY = this.sprite.height
    }

    update(delta) {
        super.update(delta)
        if (this.x < 32) {
            this.x = 32
            this.exhaust.x = this.x - 32
            this.vx = 0
        }
        if (this.y < 0) {
            this.y = 0
            this.exhaust.y = this.y + 8
            this.vy = 0
        }
        if (this.x > gameWidth - this.sizeX) {
            this.x = gameWidth - this.sizeX
            this.exhaust.x = this.x - 32
            this.vx = 0
        }
        if (this.y > gameHeight - this.sizeY) {
            this.y = gameHeight - this.sizeY
            this.exhaust.y = this.y + 8
            this.vy = 0
        }
        if(!keys['ArrowLeft'] && !keys['ArrowRight']) this.vx = -50
        if(!keys['ArrowUp'] && !keys['ArrowDown']) this.vy = 0
        this.exhaust.update()
    }

    draw() {
        super.draw()
        this.exhaust.draw()
    }
}

class Star {
    constructor() {
        this.x = random(gameWidth)
        this.y = random(gameHeight)
        this.dist = random(200)
        this.alpha = 1 - this.dist / 400
        this.color = `rgba(${255 - this.dist}, ${255 - this.dist}, ${255 - this.dist},  ${this.alpha})`
        this.speed = 200 - this.dist
        if (this.speed < 20) {
            this.speed = 20 + random(25)
        }
    }

    draw() {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, 4, 4)
        ctx.restore()
    }

    update(delta) {
        this.x -= this.speed * delta
        if (this.x < - 4) {
            this.x = gameWidth
        }
        
    }
}

function random(max, min = 0) {
    return Math.floor(min + Math.random() * (max - min))
}

function setup() {
    gameWidth = gameWindow.width = window.innerWidth
    gameHeight = gameWindow.height = window.innerHeight
    for (let i = 0; i < 200; i++) {
        let s = new Star()
        stars.push(s)
    }
    player = new Player(50, gameHeight / 2)

}

function cls() {
    ctx.save()
    ctx.fillStyle = 'rgba(21, 21, 21, 1)'
    ctx.fillRect(0, 0, gameWidth, gameHeight)
    ctx.restore()
}

function checkKeyInput() {
    if (keys['ArrowRight'] && !keys['ArrowLeft']) {
        player.vx = player.speed
    }
    if (keys['ArrowLeft'] && !keys['ArrowRight'] ) {
        player.vx = -player.speed
    }   
    if (keys['ArrowUp'] && !keys['ArrowDown']) {
        player.vy = -player.speed
    }
    if (keys['ArrowDown'] && !keys['ArrowUp'] ) {
        player.vy = player.speed
    } 
    // if (player.vx != 0 && player.vy != 0) {
    //     player.vx /= 1.4142
    //     player.vy /= 1.4142
    // }
}

function gameLoop(timestamp) {
    let delta = timestamp - lastFrame
    delta /= 1000
    lastFrame = timestamp
    
    cls()
    checkKeyInput()
    stars.forEach(s => {
        s.update(delta)
        s.draw()
    })
    player.update(delta)
    player.draw()
    window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keydown', e => keys[e.code] = true)
window.addEventListener('keyup', e => keys[e.code] = false)

setup()
window.requestAnimationFrame(gameLoop)

