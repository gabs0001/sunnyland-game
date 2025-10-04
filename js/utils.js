const loadImage = src => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

//checagem de colisão entre dois objetos e verificando em que direção estão colidindo
const checkCollisions = (obj1, obj2) => {
  const isColliding = 
    obj1.hitbox.x + obj1.hitbox.width >= obj2.hitbox.x &&
    obj1.hitbox.x <= obj2.hitbox.x + obj2.hitbox.width &&
    obj1.hitbox.y <= obj2.hitbox.y + obj2.hitbox.height &&
    obj1.hitbox.y + obj1.hitbox.height >= obj2.hitbox.y
  
  if(!isColliding) return null

  const xOverlap = Math.min(
    obj1.position.x + obj1.width - obj2.position.x,
    obj2.position.x + obj2.width - obj1.position.x
  )

  const yOverlap = Math.min(
    obj1.position.y + obj1.height - obj2.position.y,
    obj2.position.y + obj2.height - obj1.position.y
  )

  if(xOverlap < yOverlap) { 
    return obj1.position.x < obj2.position.x ? 'right': 'left' 
  } 
  else { 
    return obj1.position.y < obj2.position.y ? 'bottom': 'top' 
  }
}