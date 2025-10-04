const EAGLE_X_VELOCITY = -20
const EAGLE_JUMP_POWER = 250
const EAGLE_GRAVITY = 580

class Eagle {
  constructor({ 
    position = {
        x: 0, 
        y: 0
    }, 
    width = 0, 
    height = 0, 
    velocity = { 
        x: EAGLE_X_VELOCITY, 
        y: 0 
    }},
    turningDistance = 100
  ){
    this.position = position
    this.width = width
    this.height = height
    this.velocity = velocity
    this.isOnGround = false
    this.isImageLoaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.isImageLoaded = true
    }
    this.image.src = './images/eagle.png'
    this.elapsedTime = 0
    this.currentFrame = 0
    this.sprites = {
      run: {
        x: 0,
        y: 0,
        width: 40,
        height: 41,
        frames: 4,
      },
    }
    this.currentSprite = this.sprites.run
    this.facing = 'right'
    this.hitbox = {
      x: 0,
      y: 0,
      width: 40,
      height: 41,
    }
    this.distanceTraveled = 0
    this.turningDistance = turningDistance
  }

  draw(c) {
    // Red square debug code
    // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    // c.fillRect(this.x, this.y, this.width, this.height)

    // Hitbox
    // c.fillStyle = 'rgba(0, 0, 255, 0.5)'
    // c.fillRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height,
    // )

    if(this.isImageLoaded === true) {
      let xScale = 1
      let posx = this.position.x

      if (this.facing === 'right') {
        xScale = -1
        posx = -this.position.x - this.width
      }

      c.save()
      c.scale(xScale, 1)
      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentSprite.width * this.currentFrame,
        this.currentSprite.y,
        this.currentSprite.width,
        this.currentSprite.height,
        posx,
        this.position.y,
        this.width,
        this.height,
      )
      c.restore()
    }
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    // Updating animation frames
    this.elapsedTime += deltaTime
    const secondsInterval = 0.1
    if (this.elapsedTime > secondsInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames
      this.elapsedTime -= secondsInterval
    }

    // Update hitbox position
    this.hitbox.x = this.position.x
    this.hitbox.y = this.position.y + 9

    //this.applyGravity(deltaTime)

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    // Check for any platform collisions
    this.checkPlatformCollisions(platforms, deltaTime)

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.determineDirection()
  }

  determineDirection() {
    if (this.velocity.x > 0) {
      this.facing = 'right'
    } else if (this.velocity.x < 0) {
      this.facing = 'left'
    }
  }

  jump() {
    this.velocity.y = -EAGLE_JUMP_POWER
    this.isOnGround = false
  }

  updateHorizontalPosition(deltaTime) {
    if(Math.abs(this.distanceTraveled) > this.turningDistance) {
      this.velocity.x = -this.velocity.x
      this.distanceTraveled = 0
    }

    this.position.x += this.velocity.x * deltaTime
    this.hitbox.x += this.velocity.x * deltaTime
    this.distanceTraveled += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.position.y += this.velocity.y * deltaTime
    this.hitbox.y += this.velocity.y * deltaTime
  }

  applyGravity(deltaTime) {
    this.velocity.y += EAGLE_GRAVITY * deltaTime
  }

  handleInput(keys) {
    this.velocity.x = 0

    if (keys.d.pressed) {
      this.velocity.x = EAGLE_X_VELOCITY
    } else if (keys.a.pressed) {
      this.velocity.x = -EAGLE_X_VELOCITY
    }
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.hitbox.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.y <= collisionBlock.position.y + collisionBlock.height
      ){
        // Check collision while player is going left
        if (this.velocity.x < 0) {
          this.hitbox.x = collisionBlock.position.x + collisionBlock.width + buffer
          this.position.x = this.hitbox.x
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.hitbox.x = collisionBlock.position.x - this.hitbox.width - buffer
          this.position.x = this.hitbox.x
          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.hitbox.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if(this.velocity.y < 0) {
          this.velocity.y = 0
          this.hitbox.y = collisionBlock.position.y + collisionBlock.height + buffer
          this.position.y = this.hitbox.y - 9
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.position.y = collisionBlock.position.y - this.height - buffer
          this.hitbox.y = collisionBlock.position.y - this.hitbox.height - buffer
          this.isOnGround = true
          break
        }
      }
    }
  }

  checkPlatformCollisions(platforms, deltaTime) {
    const buffer = 0.0001
    for(let platform of platforms) {
      if(platform.checkCollision(this, deltaTime)) {
        this.velocity.y = 0
        this.position.y = platform.position.y - this.height - buffer
        this.isOnGround = true
        return
      }
    }
    this.isOnGround = false
  }
}