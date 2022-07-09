class Hero {
    constructor(elem) {
        this.element = document.querySelector(elem)
        this.movex = 0
        this.speed = 11
        this.direction = 'right'
        this.attackDamage = 10000
        this.hpProgress = 0
        this.hpValue = 100000
        this.defaultHpValue = this.hpValue
        this.realDamage = 0
        this.slideSpeed = 14
        this.slideTime = 0
        this.slideMaxTime = 30
        this.slideDown = false
        this.level = 1
        this.exp = 0
        this.maxExp = 3000
        this.expProgress = 0
    }
    keyMotion() {
        if (key.keyDown['left']) {
            this.direction = 'left'
            this.element.classList.add('run')
            this.element.classList.add('flip')
            this.movex = this.movex <= 0 ? 0 : this.movex - this.speed
        } else if (key.keyDown['right']) {
            this.direction = 'right'
            this.element.classList.add('run')
            this.element.classList.remove('flip')
            this.movex = this.movex + this.speed
        }
        if (!key.keyDown['left'] && !key.keyDown['right']) {
            this.element.classList.remove('run')
        }
        if (key.keyDown['attack']) {
            if (!bulletComProp.launch) {
                this.element.classList.add('attack')
                bulletComProp.arr.push(new Bullet())
                bulletComProp.launch = true
            }
        }
        if (!key.keyDown['attack']) {
            this.element.classList.remove('attack')
            bulletComProp.launch = false
        }
        if (key.keyDown['slide']) {
            if (!this.slideDown) {
                this.element.classList.add('slide')
                if (this.direction === 'right') {
                    this.movex = this.movex + this.slideSpeed
                } else {
                    this.movex = this.movex - this.slideSpeed
                }
                if (this.slideTime > this.slideMaxTime) {
                    this.element.classList.remove('slide')
                    this.slideDown = true
                }
                this.slideTime += 1
            }
        }
        if (!key.keyDown['slide']) {
            this.element.classList.remove('slide')
            this.slideDown = false
            this.slideTime = 0
        }
        this.element.parentNode.style.transform = `translateX(${this.movex}px)`
    }
    position() {
        return {
            left: this.element.getBoundingClientRect().left,
            right: this.element.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.element.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.element.getBoundingClientRect().top - this.element.getBoundingClientRect().height
        }
    }
    size() {
        return {
            width: this.element.offsetWidth,
            height: this.element.offsetHeight
        }
    }
    updateHp(monsterDamage) {
        this.hpValue = Math.max(0, this.hpValue - monsterDamage)
        this.hpProgress = this.hpValue / this.defaultHpValue * 100
        const heroHpBox = document.querySelector('.state_box .hp span')
        heroHpBox.style.width = this.hpProgress + '%'
        this.crash()
        if (this.hpValue === 0) {
            this.dead()
        }
    }
    crash() {
        this.element.classList.add('crash')
        setTimeout(() => this.element.classList.remove('crash'), 400)
    }
    dead() {
        this.element.classList.add('dead')
        endGame()
    }
    hitDamage() {
        this.realDamage = this.attackDamage - Math.round(this.attackDamage * Math.random() * 0.1)
    }
    heroUpgrade() {
        this.speed += 1.1
        this.attackDamage += 5000
    }
    updateExp(exp) {
        this.exp += exp
        this.expProgress = this.exp / this.maxExp * 100
        document.querySelector('.hero_state .exp span').style.width = this.expProgress + '%'
        if (this.exp >= this.maxExp) {
            this.levelUp()
        }
    }
    levelUp() {
        this.level += 1
        this.exp = 0
        this.maxExp = this.maxExp + this.level * 1000
        document.querySelector('.level_box strong').innerText = this.level
        const levelGuide = document.querySelector('.hero_box .level_up')
        levelGuide.classList.add('active')
        setTimeout(() => levelGuide.classList.remove('active'), 1000)
        this.updateExp(this.exp)
        this.heroUpgrade()
    }
}

class Bullet {
    constructor() {
        this.parentNode = document.querySelector('.game')
        this.element = document.createElement('div')
        this.element.className = 'hero_bullet'
        this.x = 0
        this.y = 0
        this.speed = 30
        this.distance = 0
        this.bulletDirection = 'right'
        this.init()
    }
    init() {
        this.bulletDirection = hero.direction
        this.x = this.bulletDirection === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2
        this.y = hero.position().bottom - hero.size().height / 2
        this.distance = this.x
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
        this.parentNode.append(this.element)
    }
    moveBullet() {
        let setRotate = ''
        if (this.bulletDirection === 'left') {
            this.distance -= this.speed
            setRotate = 'rotate(180deg)'
        } else {
            this.distance += this.speed
        }
        this.element.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`
        this.crashBullet()
    }
    position() {
        return {
            left: this.element.getBoundingClientRect().left,
            right: this.element.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.element.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.element.getBoundingClientRect().top - this.element.getBoundingClientRect().height
        }
    }
    crashBullet() {
        for (let j = 0; j < allMonterComProp.arr.length; j++) {
            if (this.position().left > allMonterComProp.arr[j].position().left && this.position().right < allMonterComProp.arr[j].position().right) {
                for (let i = 0; i < bulletComProp.arr.length; i++) {
                    if (bulletComProp.arr[i] === this) {
                        hero.hitDamage()
                        bulletComProp.arr.splice(i, 1)
                        this.element.remove()
                        this.damageView(allMonterComProp.arr[j])
                        allMonterComProp.arr[j].updateHp(j)
                    }
                }
            }
        }
        if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
            for (let i = 0; i < bulletComProp.arr.length; i++) {
                if (bulletComProp.arr[i] === this) {
                    bulletComProp.arr.splice(i, 1)
                    this.element.remove()
                }
            }
        }
    }
    damageView(monster) {
        this.parentNode = document.querySelector('.game_app')
        this.textDamageNode = document.createElement('div')
        this.textDamageNode.className = 'text_damage'
        this.textDamage = document.createTextNode(hero.realDamage)
        this.textDamageNode.append(this.textDamage)
        this.parentNode.append(this.textDamageNode)
        let textPosition = Math.random() * -100
        let damagex = monster.position().left + textPosition
        let damagey = monster.position().top
        this.textDamageNode.style.transform = `translate(${damagex}px, ${-damagey}px)`
        setTimeout(() => this.textDamageNode.remove(), 500)
    }
}

class Monster {
    constructor(property, positionX) {
        this.parentNode = document.querySelector('.game')
        this.element = document.createElement('div')
        this.element.className = 'monster_box ' + property.name
        this.elChildren = document.createElement('div')
        this.elChildren.className = 'monster'
        this.hpNode = document.createElement('div')
        this.hpNode.className = 'hp'
        this.hpValue = property.hpValue
        this.defaultHpValue = property.hpValue
        this.hpInner = document.createElement('span')
        this.progress = 0
        this.positionX = positionX
        this.movex = 0
        this.speed = property.speed
        this.crashDamage = property.crashDamage
        this.score = property.score
        this.exp = property.exp
        this.init()
    }
    init() {
        this.hpNode.append(this.hpInner)
        this.element.append(this.hpNode)
        this.element.append(this.elChildren)
        this.parentNode.append(this.element)
        this.element.style.left = this.positionX + 'px'
    }
    position() {
        return {
            left: this.element.getBoundingClientRect().left,
            right: this.element.getBoundingClientRect().right,
            top: gameProp.screenHeight - this.element.getBoundingClientRect().top,
            bottom: gameProp.screenHeight - this.element.getBoundingClientRect().top - this.element.getBoundingClientRect().height
        }
    }
    dead(index) {
        this.element.classList.add('remove')
        setTimeout(() => this.element.remove(), 200)
        allMonterComProp.arr.splice(index, 1)
        this.setScore()
        this.setExp()
    }
    updateHp(index) {
        this.hpValue = Math.max(0, this.hpValue - hero.realDamage)
        this.progress = this.hpValue / this.defaultHpValue * 100
        this.element.children[0].children[0].style.width = this.progress + '%'

        if (this.hpValue === 0) {
            this.dead(index)
        }
    }
    moveMonster() {
        if (this.movex + this.positionX + this.element.offsetWidth + hero.position().left - hero.movex <= 0) {
            this.movex = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left
        } else {
            this.movex -= this.speed
        }
        this.element.style.transform = `translateX(${this.movex}px)`
        this.crash()
    }
    crash() {
        let rightDiff = 30
        let leftDiff = 90
        if (hero.position().right - rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right) {
            hero.updateHp(this.crashDamage)
        }
    }
    setScore() {
        stageInfo.totalScore += this.score
        document.querySelector('.score_box').innerText = stageInfo.totalScore
    }
    setExp() {
        hero.updateExp(this.exp)
    }
}

class Stage {
    constructor() {
        this.level = 0
        this.isStart = false
        this.stageStart()
    }
    stageStart() {
        setTimeout(() => {
            this.isStart = true
            this.stageGuide(`START LEVEL ${this.level + 1}`)
        }, 2000)
        this.callMonster()
    }
    stageGuide(text) {
        this.parentNode = document.querySelector('.game_app')
        this.textBox = document.createElement('div')
        this.textBox.className = 'stage_box'
        this.textNode = document.createTextNode(text)
        this.textBox.append(this.textNode)
        this.parentNode.append(this.textBox)

        setTimeout(() => this.textBox.remove(), 1500)
    }
    callMonster() {
        for (let i = 0; i <= 10; i++) {
            if (i === 10) {
                allMonterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.movex + gameProp.screenWidth + 600 * i)
            } else {
                allMonterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.movex + gameProp.screenWidth + 700 * i)
            }
        }
    }
    clearCheck() {
        if (allMonterComProp.arr.length === 0 && this.isStart) {
            this.isStart = false
            this.level++
            if (this.level < stageInfo.monster.length) {
                this.stageGuide('CLEAR!')
                this.stageStart()
                hero.heroUpgrade()
            } else {
                this.stageGuide('All CLEAR!! WOW')
            }
        }
    }
}