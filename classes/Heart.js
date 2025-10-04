class Heart {
    constructor({
      position = {
        x: 0, 
        y: 0
      }, 
      width,
      height,
      imageSrc,
      spriteCropBox = { x, y, width, height, frames }
    }){
        this.position = position
        this.width = width
        this.height = height
        this.isImageLoaded = false
        this.image = new Image()
        this.image.onload = () => this.isImageLoaded = true
        this.image.src = imageSrc
        this.currentFrame = 0
        this.currentSprite = spriteCropBox
        this.depleted = false
    }
    
    //desenhando as vidas do player
    draw(c) {
      if(this.isImageLoaded) {
        let xScale = 1
        let posx = this.position.x

        if(this.depleted) this.currentFrame = 1
  
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
}