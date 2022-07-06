class Hero {
    constructor(elem) {
        this.element = document.querySelector(elem)
        this.movex = 0
        this.speed = 16
        this.direction = 'right'
    }
    keyMotion() {
        if (key.keyDown['left']) {
            this.direction = 'left'
            this.element.classList.add('run')
            this.element.classList.add('flip')
            this.movex = this.movex - this.speed
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
        this.x = hero.position().left + hero.size().width / 2
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
        if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
            this.element.remove()
        }
    }
}