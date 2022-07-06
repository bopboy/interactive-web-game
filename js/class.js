class Hero {
    constructor(elem) {
        this.element = document.querySelector(elem)
        console.log(elem)
    }
    keyMotion() {
        if (key.keyDown['left']) {
            this.element.classList.add('run')
            this.element.classList.add('flip')
        } else if (key.keyDown['right']) {
            this.element.classList.add('run')
            this.element.classList.remove('flip')
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
    }
}