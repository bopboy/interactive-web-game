class Hero {
    constructor(elem) {
        this.element = document.querySelector(elem)
        this.movex = 0
        this.speed = 11
        this.direction = 'right'
        this.attackDamage = 1000
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
        if (this.position().left > monster.position().left && this.position().right < monster.position().right) {
            for (let i = 0; i < bulletComProp.arr.length; i++) {
                if (bulletComProp.arr[i] === this) {
                    bulletComProp.arr.splice(i, 1)
                    this.element.remove()
                    monster.updateHp()
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
}

class Monster {
    constructor(positionX, hp) {
        this.parentNode = document.querySelector('.game')
        this.element = document.createElement('div')
        this.element.className = 'monster_box'
        this.elChildren = document.createElement('div')
        this.elChildren.className = 'monster'
        this.hpNode = document.createElement('div')
        this.hpNode.className = 'hp'
        this.hpValue = hp
        this.hpTextNode = document.createTextNode(this.hpValue)
        this.positionX = positionX
        this.init()
    }
    init() {
        this.hpNode.append(this.hpTextNode)
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
    updateHp() {
        this.hpValue = Math.max(0, this.hpValue - hero.attackDamage)
        this.element.children[0].innerText = this.hpValue
    }
}