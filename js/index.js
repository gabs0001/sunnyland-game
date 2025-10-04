const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1
canvas.width = 1024 * dpr
canvas.height = 576 * dpr

const blockSize = 16

// largura e altura do mapa
const worldWidth = l_New_Layer_8[0].length * blockSize
const worldHeight = l_New_Layer_8.length * blockSize

//camadas
const oceanLayerData = { l_New_Layer_1: l_New_Layer_1 }
const brambleLayerData = { l_New_Layer_2: l_New_Layer_2 }

const layersData = {
  l_New_Layer_8: l_New_Layer_8,
  l_Back_Tiles: l_Back_Tiles,
  l_Decorations: l_Decorations,
  l_Front_Tiles: l_Front_Tiles,
  l_Shrooms: l_Shrooms,
  l_Collisions: l_Collisions,
  l_Grass: l_Grass,
  l_Trees: l_Trees
}

const tilesets = {
  l_New_Layer_1: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
  l_New_Layer_2: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
  l_New_Layer_8: { 
    imageUrl: './images/tileset.png', 
    tileSize: 16 
  },
  l_Back_Tiles: { 
    imageUrl: './images/tileset.png', 
    tileSize: 16 
  },
  l_Decorations: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
  l_Front_Tiles: { 
    imageUrl: './images/tileset.png', 
    tileSize: 16 
  },
  l_Shrooms: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
  l_Collisions: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
  l_Grass: { 
    imageUrl: './images/tileset.png', 
    tileSize: 16 
  },
  l_Trees: { 
    imageUrl: './images/decorations.png', 
    tileSize: 16 
  },
}

//configuração dos blocos
const collisionBlocks = []
const platforms = []

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * blockSize,
            y: y * blockSize
          },
          size: blockSize,
        }),
      )
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          position: {
            x: x * blockSize,
            y: y * blockSize + blockSize
          },
          width: 16,
          height: 4,
        }),
      )
    }
  })
})

//renderizando as camadas
const renderLayer = (tilesData, tilesetImage, tileSize, ctx) => {
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const srcX = ((symbol - 1) % (tilesetImage.width / tileSize)) * tileSize
        const srcY = Math.floor((symbol - 1) / (tilesetImage.width / tileSize)) * tileSize
        ctx.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
        )
      }
    })
  })
}

//renderizando o plano de fundo e renderizando as outras camadas dentro dessa camada estática
const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  
  offscreenCanvas.width = worldWidth
  offscreenCanvas.height = worldHeight

  const offscreenContext = offscreenCanvas.getContext('2d')

  for(const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));
  // platforms.forEach((platform) => platform.draw(offscreenContext))

  return offscreenCanvas
}
// END - Tile setup

//instanciando o player
let player = new Player({
  position: {
    x: 100,
    y: 100
  },
  size: 32,
  velocity: { 
    x: 0, 
    y: 0 
  }
})

let oposums = []
let eagles = []
let sprites = []

let hearts = [
  new Heart({
    position : {
      x: 10, 
      y: 10
    }, 
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropBox : {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6 
    }
  }),
  new Heart({
    position : {
      x: 33, 
      y: 10
    }, 
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropBox : {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6 
    }
  }),
  new Heart({
    position : {
      x: 56, 
      y: 10
    }, 
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropBox : {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6 
    }
  })
]

//teclas
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false }
}

let lastTime = performance.now()
let camera = { x: 0, y: 0 }

const SCROLL_POST_RIGHT = 330
const SCROLL_POST_TOP = 100
const SCROLL_POST_BOTTOM = 220

let oceanBackgroundCanvas = null
let brambleBackgroundCanvas = null

let gems = []

//TALVEZ colocar dentro da função init tbm!!!
let gemUI = new Sprite({
  position: {
    x: 13,
    y: 36
  },
  width: 15,
  height: 13,
  imageSrc: './images/gem.png',
  spriteCropBox: {
    x: 0,
    y: 0,
    width: 15,
    height: 13,
    frames: 5
  }
})

let gemCount = 0

const init = () => {
  gems = []
  gemCount = 0
  l_Gems.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 18) {
        gems.push(
          new Sprite({
            position: {
              x: x * 16,
              y: y * 16
            },
            width: 15,
            height: 13,
            imageSrc: './images/gem.png',
            spriteCropBox: {
              x: 0,
              y: 0,
              width: 15,
              height: 13,
              frames: 5
            },
            hitbox: {
              x: x * 16,
              y: y * 16,
              width: 15,
              height: 13
            }
          })
        )
      }
    })
  })

  player = new Player({
    position: { x: 100, y: 100 },
    size: 32,
    velocity: { x: 0, y: 0 }
  })

  eagles = [
    new Eagle({
      position: { x: 816, y: 172 },
      width: 40,
      height: 41
    })
  ]
  
  oposums = [
    new Oposum({
      position: { x: 650, y: 100 },
      width: 36,
      height: 28
    }),
    new Oposum({
      position: { x: 906, y: 515 },
      width: 36,
      height: 28
    }),
    new Oposum({
      position: { x: 1150, y: 515 },
      width: 36,
      height: 28
    }),
    new Oposum({
      position: { x: 1663, y: 200 },
      width: 36,
      height: 28
    })
  ]

  sprites = []

  hearts = [
    new Heart({
      position : { x: 10, y: 10 }, 
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropBox : { x: 0, y: 0, width: 21, height: 18, frames: 6 }
    }),
    new Heart({
      position : { x: 33, y: 10 }, 
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropBox : { x: 0, y: 0, width: 21, height: 18, frames: 6 }
    }),
    new Heart({
      position : { x: 56, y: 10 }, 
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropBox : { x: 0, y: 0, width: 21, height: 18, frames: 6 }
    })
  ]
  camera = { x: 0, y: 0 }
}

//loop da animação
const animate = (backgroundCanvas) => {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  //atualizando a posição do player
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  //atualizando a posição do inimigo
  for(let i = oposums.length - 1; i >= 0; i--) {
    const oposum = oposums[i]
    oposum.update(deltaTime, collisionBlocks)

    //checando colisão do player com o inimigo e adicionando a animação de explosão
    const collisionDirection = checkCollisions(player, oposum)
    if(collisionDirection) {
      if(collisionDirection === 'bottom' && !player.isOnGround) {
        player.velocity.y = -200
        sprites.push(
          new Sprite({
            position: {
              x: oposum.position.x,
              y: oposum.position.y
            },
            width: 32,
            height: 32,
            imageSrc: './images/enemy-death.png',
            spriteCropBox: {
              x: 0,
              y: 0,
              width: 40,
              height: 41,
              frames: 6
            }
          })
        )
        oposums.splice(i, 1)
      } 
      else if(collisionDirection === 'left' || collisionDirection === 'right') {
        const fullHearts = hearts.filter(heart => { 
          return !heart.depleted 
        })

        if(!player.isInvincible && fullHearts.length > 0) {
          fullHearts[fullHearts.length - 1].depleted = true
        }
        else if(fullHearts.length === 0) init()
        
        player.setInvincible()
      }
    }
  }

  //atualizando a posição da águia
  for(let i = eagles.length - 1; i >= 0; i--) {
    const eagle = eagles[i]
    eagle.update(deltaTime, collisionBlocks)

    //pulando no inimigo
    const collisionDirection = checkCollisions(player, eagle)
    if(collisionDirection) {
      if(collisionDirection === 'bottom' && !player.isOnGround) {
        player.velocity.y = -200
        sprites.push(
          new Sprite({
            position: {
              x: eagle.position.x,
              y: eagle.position.y
            },
            width: 32,
            height: 32,
            imageSrc: './images/enemy-death.png',
            spriteCropbox: {
              x: 0,
              y: 0,
              width: 40,
              height: 41,
              frames: 6
            }
          })
        )
        eagles.splice(i, 1)
      }
      else if(
        collisionDirection === 'left' ||
        collisionDirection === 'right' ||
        collisionDirection === 'top'
      ){
        const fullHearts = hearts.filter(heart => {
          return !heart.depleted
        })

        if (!player.isInvincible && fullHearts.length > 0) {
          fullHearts[fullHearts.length - 1].depleted = true
        } 
        else if (fullHearts.length === 0) init()
        player.setInvincible()
      }
    }
  }

  //atualizando a posição dos sprites
  for(let i = sprites.length - 1; i >= 0; i--) {
    const sprite =  sprites[i]
    sprite.update(deltaTime)

    if(sprite.iteration === 1) sprites.splice(i, 1)
  }

  //coletando as gemas
  for(let i = gems.length - 1; i >= 0; i--) {
    const gem =  gems[i]
    gem.update(deltaTime)

    //checando colisão do player com as gemas
    const collisionDirection = checkCollisions(player, gem)
    if(collisionDirection) {
      //criando uma animação de gema coletada pelo player
      sprites.push(
        new Sprite({
          position: {
            x: gem.position.x - 8,
            y: gem.position.y - 8
          },
          width: 32,
          height: 32,
          imageSrc: './images/item-feedback.png',
          spriteCropBox: {
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            frames: 5
          }
        })
      )

      //removendo uma gema do jogo
      gems.splice(i, 1)
      gemCount++

      if(gems.length === 0) console.log('You Win!')
    }
  }

  //obtendo a distância do player para o ponto de transição da tela e movendo a câmera
  if(player.position.x > SCROLL_POST_RIGHT && player.position.x < 1680) {
    const scrollPostDistance = player.position.x - SCROLL_POST_RIGHT
    camera.x = scrollPostDistance
  }

  const MAP_WIDTH = worldWidth - canvas.width
  if(camera.x < 0) camera.x = 0
  if(camera.x > MAP_WIDTH) camera.x = MAP_WIDTH

  if(player.position.y < SCROLL_POST_TOP && camera.y > 0) {
    const scrollPostDistance = SCROLL_POST_TOP - player.position.y
    camera.y = scrollPostDistance
  }

  if(player.position.y > SCROLL_POST_BOTTOM) {
    const scrollPostDistance = player.position.y - SCROLL_POST_BOTTOM
    camera.y = -scrollPostDistance
  }

  //Renderizando toda a cena
  c.clearRect(0, 0, canvas.width, canvas.height)

  c.save()
  // c.scale(dpr + .5, dpr + .5)
  c.translate(-camera.x, camera.y)
  
  c.drawImage(oceanBackgroundCanvas, camera.x * 0.32, 0)
  c.drawImage(brambleBackgroundCanvas, camera.x * 0.16, 0)
  c.drawImage(backgroundCanvas, 0, 0)

  //desenha o player
  player.draw(c)

  //desenha o inimigo
  for(let i = oposums.length - 1; i >= 0; i--) {
    const oposum = oposums[i]
    oposum.draw(c)
  }

  //desenha a águia
  for (let i = eagles.length - 1; i >= 0; i--) {
    const eagle = eagles[i]
    eagle.draw(c)
  }

  //desenha o sprite de explosão
  for(let i = sprites.length - 1; i >= 0; i--) {
    const sprite =  sprites[i]
    sprite.draw(c)
  }

  //desenha as gemas
  for(let i = gems.length - 1; i >= 0; i--) {
    const gem =  gems[i]
    gem.draw(c)
  }

  // c.fillRect(SCROLL_POST_RIGHT, 100, 10, 100)
  // c.fillRect(300, SCROLL_POST_TOP, 100, 10)
  // c.fillRect(300, SCROLL_POST_BOTTOM, 100, 10)

  c.restore()

  c.save()
  c.scale(dpr + 1, dpr + 1)
  //desenha a vida do player
  for(let i = hearts.length - 1; i >= 0; i--) {
    const heart =  hearts[i]
    heart.draw(c)
  }
  gemUI.draw(c)
  c.fillText(gemCount,33,46)
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

//iniciando a renderização dos elementos
const startRendering = async () => {
  try {
    oceanBackgroundCanvas = await renderStaticLayers(oceanLayerData)
    brambleBackgroundCanvas = await renderStaticLayers(brambleLayerData)
    const backgroundCanvas = await renderStaticLayers(layersData)
    if(!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }
    animate(backgroundCanvas)
  } 
  catch (e) {
    console.error('Error during rendering:', e)
  }
}

init()
startRendering()