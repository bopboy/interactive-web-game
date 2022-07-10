const key = {
    keyDown: {},
    keyValue: {
        37: 'left',
        39: 'right',
        88: 'attack',
        67: 'slide',
        13: 'enter'
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
const stageInfo = {
    stage: [],
    totalScore: 0,
    monster: [
        { defaultMon: greenMon, bossMon: greenMonBoss },
        { defaultMon: yellowMon, bossMon: yellowMonBoss },
        { defaultMon: pinkMon, bossMon: pinkMonBoss },
    ],
    callPosition: [1000, 5000, 9000]
}
const renderGame = () => {
    hero.keyMotion()
    setGameBackground()
    npcOne.crash()

    bulletComProp.arr.forEach((arr, i) => {
        arr.moveBullet()
    })
    allMonterComProp.arr.forEach((arr, i) => {
        arr.moveMonster()
    })
    stageInfo.stage.clearCheck()
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
        if (key.keyDown['enter']) {
            npcOne.talk()
        }
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
let npcOne

const init = () => {
    hero = new Hero('.hero')
    stageInfo.stage = new Stage()
    npcOne = new Npc()
    loadImg()
    windowEvent()
    renderGame()
}
// window.addEventListener('keydown', e => {
//     if (e.which === ) init()
// })
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