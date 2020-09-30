class Star {
    constructor() {
        this.x = random(gameWidth)
        this.y = random(gameHeight - 4)
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
            this.y = random(gameHeight - 4)
        }
        
    }
}

class Starship {
    constructor(type) {
        this.type = type
        this.x = starshipData[this.type].spawnX
        this.y = starshipData[this.type].spawnY()
        this.collRect = starshipData[this.type].collRect
        this.exhaustPosX = starshipData[this.type].exhaustPosX
        this.exhaustPosY = starshipData[this.type].exhaustPosY
        this.movePattern = starshipData[this.type].movePattern ? starshipData[this.type].movePattern.bind(this) : null
        this.vx = this.baseSpeedX = starshipData[this.type].speed().x
        this.vy = this.baseSpeedY = starshipData[this.type].speed().y
        this.shootInterval = starshipData[this.type].shootInterval
        this.sizeX = 128
        this.sizeY = 128
        this.speed = 200
        this.randFactor = random(30,90)
        this.frameCount = 0
        this.exhaustFrame = 0
        this.canShoot = true
        this.dead = false
    }

    update(delta) {
        this.frameCount++
        if (performance.now() - this.lastShoot > this.shootInterval) {
            this.canShoot = true
        }

        if (this.frameCount % 5 === 0) {
            this.exhaustFrame++
        }

        if(this.movePattern) {
            this.movePattern()
        }

        
        
        this.x += this.vx * delta
        this.y += this.vy * delta
        if (this.type === 0) {
            this.vx = 0
            this.vy = 0
        }
        else {
            if (this.y < 50 || this.y > gameHeight - 100) {
                this.vy *= -1
            }

            if (this.canShoot) {
                this.shoot()
            }
        }
    }

    draw() {
        ctx.save()
        ctx.drawImage(spriteSheet, this.type * 128, 0, 128, 128, this.x, this.y, 128, 128)
        ctx.drawImage(spriteSheet, (this.exhaustFrame % 4) * 32, 128 + this.type * 32, 32, 32, this.x + this.exhaustPosX, this.y + this.exhaustPosY, 32, 32)
        ctx.restore()
    }

    shoot() {
        if (this.type === 0) {
            let b = new Bullet (this.x + this.collRect[2] + 10, this.y + 64, this.speed * 1.5)
            playerBullets.push(b)
        }
        else {
            let bspeed = this.baseSpeedX * 1.5

            let b = new Bullet (this.x + this.collRect[0] - 10, this.y + 64, bspeed)
            bullets.push(b)
        }
        this.canShoot = false
        this.lastShoot = performance.now()
    }
}

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

class Bullet {
    constructor(x, y, speed) {
        this.x = x
        this.y = y
        this.speed = speed
        this.expired = false
    }

    update(delta) {
        this.x += this.speed * delta
        if(this.x < -10 || this.x > gameWidth + 10) {
            this.expired = true
        }
    }

    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = ctx.fillStyle = 'rgb(255,0,0)'
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
    }
}