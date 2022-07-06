const key = {
    keyDown: {},
    keyValue: {
        37: 'left',
        39: 'right',
        88: 'attack'
    }
}
const gameProp = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
}
const bulletComProp = {
    launch: false,
    arr: []
}
const renderGame = () => {
    hero.keyMotion()
    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullet()
    })
    window.requestAnimationFrame(renderGame)
}

const windowEvent = () => {
    window.addEventListener('keydown', e => {
        key.keyDown[key.keyValue[e.which]] = true
    })
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false
    })
}
let hero
const init = () => {
    hero = new Hero('.hero')
    loadImg()
    windowEvent()
    renderGame()
    console.log(hero.position())
}

window.onload = () => {
    init()
}

const loadImg = () => {
    const preLoadImgSrc = ['./lib/images/ninja_attack.png', './lib/images/ninja_run.png']
    preLoadImgSrc.forEach(arr => {
        const img = new Image()
        img.src = arr
    })
}