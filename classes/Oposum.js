const OPOSUM_X_VELOCITY = -20
const OPOSUM_JUMP_POWER = 250
const OPOSUM_GRAVITY = 580

class Oposum {
  constructor({
    position = {
      x: 0, 
      y: 0
    }, 
    width,
    height, 
    velocity = {
      x: OPOSUM_X_VELOCITY,
      y: 0 
    },
    turningDistance = 100
  }){
      this.position = position
      this.width = width
      this.height = height
      this.velocity = velocity
      this.isOnGround = false
      this.isImageLoaded = false
      this.image = new Image()
      this.image.onload = () => this.isImageLoaded = true
      this.image.src = './images/oposum.png'
      this.elapsedTime = 0 //qtde de tempo que já se passou
      this.currentFrame = 0 //frame atual
      this.sprites = {//sprites da animação
        run: {
          x: 0,
          y: 0,
          width: 36,
          height: 28,
          frames: 6
        }
      }
      this.currentSprite = this.sprites.run
      this.facing = 'right'
      this.hitbox = {
        x: 0,
        y: 0,
        width: 30,
        height: 19
      }
      this.distanceTraveled = 0 //distância percorrida
      this.turningDistance = turningDistance //distância em que o inimigo troca o lado em que está andando
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

      if(this.facing === 'right') {
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

    //atualizando a posição da hitbox de acordo com a posição do player
    this.hitbox.x = this.position.x
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

    //determina a direção que está o inimigo
    this.determineDirection()
  }

  //determinando em que direção o player está indo
  determineDirection() {
    if(this.velocity.x > 0) this.facing = 'right'
    else if(this.velocity.x < 0) this.facing = 'left'
  }

  //player pula
  jump() {
    this.velocity.y = -OPOSUM_JUMP_POWER
    this.isOnGround = false
  }

  //atualizar posição horizontal
  updateHorizontalPosition(deltaTime) {
    if(Math.abs(this.distanceTraveled) > this.turningDistance) {
        this.velocity.x = -this.velocity.x
        this.distanceTraveled = 0
    }
    this.position.x += this.velocity.x * deltaTime
    this.hitbox.x += this.velocity.x * deltaTime
    this.distanceTraveled += this.velocity.x * deltaTime
  }

  //atualizar posição vertical
  updateVerticalPosition(deltaTime) {
    this.position.y += this.velocity.y * deltaTime
    this.hitbox.y += this.velocity.y * deltaTime
  }

  //aplicar gravidade
  applyGravity(deltaTime) {
    this.velocity.y += OPOSUM_GRAVITY * deltaTime
  }

  //atribuindo uma velocidade positiva ou negativa para o player de acordo com a tecla pressionada
  handleInput(keys) {
    this.velocity.x = 0

    if (keys.d.pressed) {
      this.velocity.x = OPOSUM_X_VELOCITY
    } else if (keys.a.pressed) {
      this.velocity.x = -OPOSUM_X_VELOCITY
    }
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
          this.position.x = this.hitbox.x
          break
        }
        //checando colisão quando o player vai para a direita
        if (this.velocity.x > 0) {
          this.hitbox.x = collisionBlock.position.x - this.hitbox.width - buffer
          this.position.x = this.hitbox.x
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