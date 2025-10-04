class CollisionBlock {
  constructor({
      position = { 
        x: 0, 
        y: 0
      }, 
      size 
      }) 
  {
    this.position = position
    this.width = size
    this.height = size
  }

  draw(c) {
    // Optional: Draw collision blocks for debugging
    c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}