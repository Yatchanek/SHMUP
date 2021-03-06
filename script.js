const gameWindow = document.getElementById('game')
const ctx = gameWindow.getContext('2d')
const stars = []
let bullets = []
let playerBullets = []
let enemies = []
const keys = {}
const spriteSheet = new Image()
spriteSheet.src = 'assets/spritesheet.png'

let gameWidth, gameHeight
let lastFrame = 0
let player, enemy
let frameCount = 0;
let keyPressed = false

gameWidth = gameWindow.width = window.innerWidth
gameHeight = gameWindow.height = window.innerHeight

const starshipData = {
    0: {
        collRect: [16, 40, 111, 85],
        exhaustPosX: -16,
        exhaustPosY: 48,
        spawnX: 50,
        spawnY: () => gameHeight / 2,
        speed: () => {
            return {
                x: 0,
                y: 0
            }
        },

        shootInterval: 300
    },

    1: {
        collRect: [35, 49, 92, 78],
        exhaustPosX: 92,
        exhaustPosY: 48,
        spawnX: gameWidth,
        spawnY: () => random(40, gameHeight - 90),
        movePattern: null,
        speed: () => {
            return {
                x: random(-110, -90),
                y: 0
            }
        },
        shootInterval: 3000
    },

    2: {
        collRect: [24, 47, 108, 83],
        exhaustPosX: 108,
        exhaustPosY: 48,
        spawnX: gameWidth,
        spawnY: () => random(50, gameHeight - 50),
        movePattern: function() { 
            if(Math.random() < 0.005) { 
                this.vs = random(-180, -120) 
            }

            if(Math.random() < 0.005) { 
                this.vy = random(-150,150) 
            }
        },
        speed: () => {
            return {
                x: random(-180, -120),
                y: 0
            }
        },
        shootInterval: 1500
    },

    3: {
        collRect: [26, 48, 102, 81],
        exhaustPosX: 102,
        exhaustPosY: 48,
        spawnX: gameWidth,
        spawnY: () => random(200, gameHeight - 200),
        movePattern: function() {
            if(this.frameCount % 500 < 150) {
                this.vx = this.baseSpeedX
                this.vy = 0
                this.canShoot = false
            } else {
                this.vx = this.baseSpeedX * Math.sin(this.frameCount / this.randFactor)
                this.vy = this.baseSpeedX * Math.cos(this.frameCount / this.randFactor)
            }
        },
        speed: () => {
            return {
                x: -140,
                y: 0
            }
        },
        shootInterval: 500  
    },

    4: {
        collRect: [11, 40, 125, 87],
        exhaustPosX: 125,
        exhaustPosY: 48,
        spawnX: gameWidth,
        spawnY: () => random(300, gameHeight - 300),
        movePattern: function () {
            this.vx = this.baseSpeedX
            this.vy = this.baseSpeedY * Math.sin(this.frameCount / this.randFactor)
            if (this.y < this.collRect[1] || this.y > gameHeight - this.sizeY) {
                this.vy *= -1
            }
        },
        speed: () => {
            return {
                x: -100,
                y: 200
            }
        },

        shootInterval: 1200
    },

    5: {
        rotation: Math.PI  
    }
}

function setup() {

    for (let i = 0; i < 200; i++) {
        let s = new Star()
        stars.push(s)
    }

    
    player = new Starship(0)
}




function gameLoop(timestamp) {
    let delta = timestamp - lastFrame
    delta /= 1000
    lastFrame = timestamp
    frameCount++

    cls()
    checkKeyInput()
    stars.forEach(s => {
        s.update(delta)
        s.draw()
    })

    if (frameCount % 240 === 0 && enemies.length < 10) {
        enemy = new Starship(random(1,5))
        enemies.push(enemy)
    }

    playerBullets = playerBullets.filter(b => b.expired === false)
    playerBullets.forEach(b => {
        b.update(delta)
        for (e of enemies) {
            if (b.x > e.x + e.collRect[0] && b.x < e.x + e.collRect[2] && b.y > e.y + e.collRect[1] && b.y < e.y + e.collRect[3]) {
                b.expired = true
                e.dead = true
            }
        }
        b.draw()
    })

    bullets = bullets.filter(b => b.expired === false)
    bullets.forEach(b => {
        b.update(delta)
        if (b.x > player.x + player.collRect[0] && b.x < player.x + player.collRect[2] && b.y > player.y + player.collRect[1] && b.y < player.y + player.collRect[3]) {
            b.expired = true
            player = new Starship(0)
        }
        b.draw()
    })

    enemies = enemies.filter(e => e.x > -e.collRect[2] && e.dead === false)
    enemies.forEach(e => {
        e.update(delta)
        e.draw()
    })

     player.update(delta)
     player.draw()

    window.requestAnimationFrame(gameLoop)
}

window.addEventListener('keydown', e =>  { 
    keys[e.code] = true
})
window.addEventListener('keyup', e => {
    keys[e.code] = false
    keyPressed = false
})

setup()
window.requestAnimationFrame(gameLoop)

