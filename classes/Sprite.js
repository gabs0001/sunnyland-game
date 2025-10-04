class Sprite {
  constructor({
    position = {
      x: 0, 
      y: 0
    }, 
    width,
    height,
    imageSrc,
    spriteCropBox = { x, y, width, height, frames },
    hitbox = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }){
      this.position = position
      this.width = width
      this.height = height
      this.isImageLoaded = false
      this.image = new Image()
      this.image.onload = () => this.isImageLoaded = true
      this.image.src = imageSrc
      this.elapsedTime = 0
      this.currentFrame = 0
      this.currentSprite = spriteCropBox
      this.iteration = 0
      this.hitbox = hitbox
  }

  draw(c) {
    //desenhando o sprite na tela
    if(this.isImageLoaded === true) {
      let xScale = 1
      let posx = this.position.x

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

  //atualizando o posicionamento do sprite
  update(deltaTime) {
    if (!deltaTime) return
    
    this.elapsedTime += deltaTime
    const secondsInterval = 0.1
    if(this.elapsedTime > secondsInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames
      this.elapsedTime -= secondsInterval
      if(this.currentFrame === 0) this.iteration++
    }
  }
}