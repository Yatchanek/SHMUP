function random(r1, r2) {
    if (!r2 || r1 === r2) {
        return Math.floor(Math.random() * r1)
    }
    else {
        let min = Math.min(r1, r2)
        let max = Math.max(r1, r2)
        return Math.floor(min + Math.random() * (max - min))
    }
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

    if (keys['Space'] && player.canShoot && !keyPressed) {
        keyPressed = true
        player.shoot()
    }
}

function cls() {
    ctx.save()
    ctx.fillStyle = 'rgba(21, 21, 21, 1)'
    ctx.fillRect(0, 0, gameWidth, gameHeight)
    ctx.restore()
}
