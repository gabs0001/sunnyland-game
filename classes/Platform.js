class Platform {
  constructor({
      position = { 
        x : 0, 
        y: 0
      }, 
      width = 16, 
      height = 4 
    })
  {
    this.position = position
    this.width = width
    this.height = height
  }

  draw(c) {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  checkCollision(player, deltaTime) {
    //colisão do jogador com as plataformas
    return (
      player.position.y + player.height <= this.position.y && //topo da plataforma
      player.position.y + player.height + player.velocity.y * deltaTime >= this.position.y && //embaixo da plataforma
      player.position.x + player.width > this.position.x && //esquerda da plataforma
      player.position.x < this.position.x + this.width //direita da plataforma
    )
  }
}