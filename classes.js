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
        this.speed = 250
        this.randFactor = random(30,90)
        this.frameCount = 0
        this.exhaustFrame = 0
        this.canShoot = true
        this.dead = false
        this.lastShoot = performance.now()
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
            if (this.x < 32) {
                this.x = 32
            } else if(this.x > gameWidth - this.collRect[2]) {
                this.x = gameWidth - this.collRect[2]
            } else if (this.y < -this.collRect[1]) {
                this.y = -this.collRect[1]
            } else if (this.y > gameHeight - this.collRect[3]) {
                this.y = gameHeight - this.collRect[3]
            }
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
            let b = new Bullet (this.x + this.collRect[2] + 10, this.y + 56, this.speed * 1.5, this.type)
            playerBullets.push(b)
        }
        else {
            let bspeed = this.baseSpeedX * 1.5

            let b = new Bullet (this.x + this.collRect[0] - 10, this.y + 56, bspeed, this.type)
            bullets.push(b)
        }
        this.canShoot = false
        this.lastShoot = performance.now()
    }
}

class Bullet {
    constructor(x, y, speed, type) {
        this.x = x
        this.y = y
        this.speed = speed
        this.expired = false
        this.type = type
        this.frameCount = 0
        this.animSprite = 0
    }

    update(delta) {
        this.frameCount++
        if (this.frameCount % 5 === 0) {
            this.animSprite++
        }
        this.x += this.speed * delta
        if(this.x < -15 || this.x > gameWidth + 15) {
            this.expired = true
        }
    }

    draw() {
        ctx.save()
        ctx.beginPath()
        if (this.type === 0) {
            ctx.drawImage(spriteSheet, 128 + (this.animSprite % 2) * 15, 128, 15, 15, this.x, this.y, 20, 20)
        } else {
            ctx.drawImage(spriteSheet, 128 + (this.animSprite % 2) * 15, 143, 15, 15, this.x, this.y, 20, 20)
        }      
        ctx.restore()
    }
}