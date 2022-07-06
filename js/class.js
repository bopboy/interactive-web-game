class Hero {
    constructor(elem) {
        this.element = document.querySelector(elem)
        this.movex = 0
        this.speed = 16
    }
    keyMotion() {
        if (key.keyDown['left']) {
            this.element.classList.add('run')
            this.element.classList.add('flip')
            console.log(this.position().right)
            this.movex = this.movex - this.speed
        } else if (key.keyDown['right']) {
            this.element.classList.add('run')
            this.element.classList.remove('flip')
            console.log(this.position().right)
            this.movex = this.movex + this.speed
        }
        if (!key.keyDown['left'] && !key.keyDown['right']) {
            this.element.classList.remove('run')
        }
        if (key.keyDown['attack']) {
            this.element.classList.add('attack')
        }
        if (!key.keyDown['attack']) {
            this.element.classList.remove('attack')
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
}