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
    screenHeight: window.innerHeight,
    gameOver: false
}
const allMonterComProp = {
    arr: []
}
const bulletComProp = {
    launch: false,
    arr: []
}
const gameBackground = {
    gameBox: document.querySelector('.game')
}
const renderGame = () => {
    hero.keyMotion()
    setGameBackground()
    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullet()
    })
    allMonterComProp.arr.forEach((arr, i) => {
        arr.moveMonster()
    })
    window.requestAnimationFrame(renderGame)
}

const endGame = () => {
    gameProp.gameOver = true
    key.keyDown.left = false
    key.keyDown.right = false
    document.querySelector('.game_over').classList.add('active')
}
const windowEvent = () => {
    window.addEventListener('keydown', e => {
        if (!gameProp.gameOver) key.keyDown[key.keyValue[e.which]] = true
    })
    window.addEventListener('keyup', e => {
        key.keyDown[key.keyValue[e.which]] = false
    })
    window.addEventListener('resize', e => {
        gameProp.screenWidth = window.innerWidth
        gameProp.screenHeight = window.innerHeight
    })
}
const setGameBackground = () => {
    let parallelaxValue = Math.min(0, (hero.movex - gameProp.screenWidth / 3) * -1)
    gameBackground.gameBox.style.transform = `translatex(${parallelaxValue}px)`
}

let hero
const init = () => {
    hero = new Hero('.hero')
    // allMonterComProp.arr[0] = new Monster(greenMonBoss, gameProp.screenWidth + 700)
    // allMonterComProp.arr[1] = new Monster(yellowMonBoss, gameProp.screenWidth + 1400)
    // allMonterComProp.arr[2] = new Monster(pinkMonBoss, gameProp.screenWidth + 2100)
    for (let i = 0; i <= 10; i++) {
        if (i === 10) {
            allMonterComProp.arr[i] = new Monster(greenMonBoss, gameProp.screenWidth + 600 * i)
        } else {
            allMonterComProp.arr[i] = new Monster(greenMon, gameProp.screenWidth + 700 * i)
        }
    }
    loadImg()
    windowEvent()
    renderGame()
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