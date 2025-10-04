const X_VELOCITY = 200
const JUMP_POWER = 250
const GRAVITY = 580

class Player {
  constructor({
     position = {
      x: 0, 
      y: 0
    }, 
    size, 
    velocity = {
       x: 0,
      y: 0 
    }}) 
  {
    this.position = position
    this.width = size
    this.height = size
    this.velocity = velocity
    this.isOnGround = false
    this.isImageLoaded = false
    this.image = new Image()
    this.image.onload = () => this.isImageLoaded = true
    this.image.src = './images/player.png'
    this.elapsedTime = 0 //qtde de tempo que já se passou
    this.currentFrame = 0 //frame atual
    this.sprites = {//sprites da animação
      idle: {
        x: 0,
        y: 0,
        width: 33,
        height: 32,
        frames: 4
      },
      run: {
        x: 0,
        y: 32,
        width: 33,
        height: 32,
        frames: 6
      },
      jump: {
        x: 0,
        y: 32 * 5,
        width: 33,
        height: 32,
        frames: 1
      },
      fall: {
        x: 33,
        y: 32 * 5,
        width: 33,
        height: 32,
        frames: 1
      },
      roll: {
        x: 0,
        y: 32 * 9,
        width: 33,
        height: 32,
        frames: 4
      }
    }
    this.currentSprite = this.sprites.roll
    this.facing = 'right'
    this.hitbox = {
      x: 0,
      y: 0,
      width: 20,
      height: 23
    }
    this.isInvincible = false
    this.isRolling = false
    this.isInAirAfterRolling = false
  }

  setInvincible() {
    this.isInvincible = true
    setTimeout(() => { 
      this.isInvincible = false 
    }, 1500)
  }

  draw(c) {
    //desenhando o quadrado vermelho
    // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    // c.fillRect(
    //   this.position.x, 
    //   this.position.y, 
    //   this.width,
    //   this.height
    // )

    //desenhando a hitbox
    // c.fillStyle = 'rgba(0, 0, 255, 0.5)'
    // c.fillRect(
    //   this.hitbox.x, 
    //   this.hitbox.y, 
    //   this.hitbox.width,
    //   this.hitbox.height
    // )

    //desenhando o sprite na tela
    if(this.isImageLoaded === true) {
      let xScale = 1
      let posx = this.position.x

      if(this.facing === 'left') {
        xScale = -1
        posx = -this.position.x - this.width
      }

      c.save()
      if(this.isInvincible) c.globalAlpha = 0.5
      else c.globalAlpha = 1
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
        this.height
      )
      c.restore()
    }
  }

  //atualizando o posicionamento do player
  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    //atualizando animação dos frames
    this.elapsedTime += deltaTime
    const secondsInterval = 0.1
    if(this.elapsedTime > secondsInterval) {
      //1 % 4 = 1
      //2 % 4 = 2
      //3 % 4 = 3
      //4 % 4 = 0
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames
      this.elapsedTime -= secondsInterval
    }

    if(this.isRolling && this.currentFrame === 3) this.isRolling = false
    
    //atualizando a posição da hitbox de acordo com a posição do player
    this.hitbox.x = this.position.x + 4
    this.hitbox.y = this.position.y + 9

    this.applyGravity(deltaTime)

    //Update posição horizontal e checando colisão horizontal
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    //checando as colisões com as plataformas
    this.checkPlatformCollisions(platforms, deltaTime)

    //Update posição vertical e checando colisão vertical
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    //determina a direção que está o player e realiza a troca de sprites
    this.determineDirection()
    this.switchSprites()
  }

  //player rola na tela
  roll() {
    if(this.isOnGround) {
      this.currentSprite = this.sprites.roll
      this.currentFrame = 0
      this.isRolling = true
      this.isInAirAfterRolling = true
      this.velocity.x = this.facing === 'right' ? 300 : -300
    }
  }

  //determinando em que direção o player está indo
  determineDirection() {
    if(this.velocity.x > 0) this.facing = 'right'
    else if(this.velocity.x < 0) this.facing = 'left'
  }

  //troca de sprites
  switchSprites() {
    if(this.isRolling) return

    if(//parado
      this.isOnGround && 
      this.velocity.x === 0 &&
      this.currentSprite !== this.sprites.idle
    ){
      this.currentFrame = 0
      this.currentSprite = this.sprites.idle
    }
    else if(//correndo
      this.isOnGround && 
      this.velocity.x !== 0 && 
      this.currentSprite !== this.sprites.run
    ){
      this.currentFrame = 0
      this.currentSprite = this.sprites.run
    }
    else if(//pulando
      !this.isOnGround &&
      this.velocity.y < 0 &&
      this.currentSprite !== this.sprites.jump
    ){
      this.currentFrame = 0
      this.currentSprite = this.sprites.jump
    }
    else if(//caindo
      !this.isOnGround &&
      this.velocity.y > 0 &&
      this.currentSprite !== this.sprites.fall
    ){
      this.currentFrame = 0
      this.currentSprite = this.sprites.fall
    }
  } 

  //player pula
  jump() {
    this.velocity.y = -JUMP_POWER
    this.isOnGround = false
  }

  //atualizar posição horizontal
  updateHorizontalPosition(deltaTime) {
    this.position.x += this.velocity.x * deltaTime
    this.hitbox.x += this.velocity.x * deltaTime
  }

  //atualizar posição vertical
  updateVerticalPosition(deltaTime) {
    this.position.y += this.velocity.y * deltaTime
    this.hitbox.y += this.velocity.y * deltaTime
  }

  //aplicar gravidade
  applyGravity(deltaTime) {
    this.velocity.y += GRAVITY * deltaTime
  }

  //atribuindo uma velocidade positiva ou negativa para o player de acordo com a tecla pressionada
  handleInput(keys) {
    if(this.isRolling || this.isInAirAfterRolling) return

    this.velocity.x = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
    }
  }

  //parando a rolagem do player
  stopRoll() {
    this.velocity.x = 0
    this.isRolling = false
    this.isInAirAfterRolling = false
  }

  //checar colisões horizontais
  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      //checando se existe alguma colisão
      if(
        this.hitbox.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.y <= collisionBlock.position.y + collisionBlock.height
      ){
        //checando colisão quando o player vai para a esquerda
        if (this.velocity.x < 0) {
          this.hitbox.x = collisionBlock.position.x + collisionBlock.width + buffer
          this.position.x = this.hitbox.x - 4
          this.stopRoll()
          break
        }
        //checando colisão quando o player vai para a direita
        if (this.velocity.x > 0) {
          this.hitbox.x = collisionBlock.position.x - this.hitbox.width - buffer
          this.position.x = this.hitbox.x - 4
          this.stopRoll()
          break
        }


      }
    }
  }

  //checar colisões verticais
  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      //checando se existe alguma colisão
      if (
        this.hitbox.x <= collisionBlock.position.x + collisionBlock.width && //direita
        this.hitbox.x + this.hitbox.width >= collisionBlock.position.x && //esquerda
        this.hitbox.y + this.hitbox.height >= collisionBlock.position.y && //baixo
        this.hitbox.y <= collisionBlock.position.y + collisionBlock.height //cima
      ){
        //checando a colisão quando o player está indo para cima
        if(this.velocity.y < 0) {
          this.velocity.y = 0
          this.hitbox.y = collisionBlock.position.y + collisionBlock.height + buffer
          this.position.y = this.hitbox.y - 9
          break
        }
        //checando a colisão quando o player está indo para baixo
        if(this.velocity.y > 0) {
          this.velocity.y = 0
          this.position.y = collisionBlock.position.y - this.height - buffer
          this.hitbox.y = collisionBlock.position.y - this.hitbox.height - buffer
          this.isOnGround = true

          if(!this.isRolling) this.isInAirAfterRolling = false
          break
        }
      }
    }
  }

  //checar colisões com a plataforma
  checkPlatformCollisions(platforms, deltaTime) {
    const buffer = 0.0001
    for (let platform of platforms) {
      if (platform.checkCollision(this, deltaTime)) {
        this.velocity.y = 0
        this.position.y = platform.position.y - this.height - buffer
        this.isOnGround = true
        return
      }
    }
    this.isOnGround = false
  }
}