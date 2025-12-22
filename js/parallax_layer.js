class ParallaxLayer {
    constructor(imagePath, wrapper, inner, canvases) {
        this.image = new Image()
        this.image.src = imagePath
        this.wrapper = wrapper
        this.inner = inner
        this.canvases = canvases

        this.offsetX = 0
        this.offsetY = 0
        this.opacity = 1
        this.speed = 0
        this.colorR = 255
        this.colorG = 255
        this.colorB = 255

        this.scrollOffset = 0
        this.scale = 1
        this.width = 0

        this._ready()
    }

    exportAs(variableName) {
        window[variableName] = this

        return this
    }

    setOffset(x = 0, y = 0, duration = 0) {
        ParallaxManager.getTweener().tween(this, 'offsetX', x, duration)
        ParallaxManager.getTweener().tween(this, 'offsetY', y, duration)

        return this
    }

    setOpacity(value, duration = 0) {
        ParallaxManager.getTweener().tween(this, 'opacity', Math.max(0, Math.min(1, value)), duration)

        return this
    }

    setColor(r, g, b, duration = 0) {
        ParallaxManager.getTweener().tween(this, 'colorR', r, duration)
        ParallaxManager.getTweener().tween(this, 'colorG', g, duration)
        ParallaxManager.getTweener().tween(this, 'colorB', b, duration)

        return this
    }

    setSpeed(speed, duration = 0) {
        ParallaxManager.getTweener().tween(this, 'speed', speed === null ? 0 : speed, duration)

        return this
    }

    resetOffset(duration = 0) { 
        return this.setOffset(0, 0, duration)
    }

    resetOpacity(duration = 0) { 
        return this.setOpacity(1, duration)
    }

    resetSpeed(duration = 0) { 
        return this.setSpeed(0, duration)
    }

    resetColor(duration = 0) { 
        return this.setColor(255, 255, 255, duration)
    }

    _ready() {
        ProcessManager.registerProcess(this)
    }

    _process(delta) {
        this.wrapper.style.opacity = this.opacity
        this.inner.style.transform = `translate(0px, ${this.offsetY}px)`
        this.canvases.forEach(canvas => this._processCanvas(delta, canvas))
    }

    _resize(canvas) {
        this.scale = this.wrapper.getBoundingClientRect().height / this.image.naturalHeight
        this.width = this.image.naturalWidth * this.scale
        this.wrapper.style.width = this.width + 'px'
        canvas.style.width = this.width + 'px'
    }

    _processCanvas(delta, canvas) {
        this._resize(canvas)

        const c = canvas.getContext('2d')
        canvas.width = this.image.naturalWidth
        canvas.height = this.image.naturalHeight

        c.clearRect(0, 0, canvas.width, canvas.height)
        c.drawImage(this.image, 0, 0)
        c.globalCompositeOperation = 'multiply'
        c.fillStyle = `rgb(${this.colorR}, ${this.colorG}, ${this.colorB})`
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.globalCompositeOperation = 'destination-in'
        c.drawImage(this.image, 0, 0)
        c.globalCompositeOperation = 'source-over'
        
        if (this.speed !== 0) {
            this.scrollOffset -= this.speed * delta
        }

        const nw = this.image.naturalWidth
        const normalizedOffset = (((this.scrollOffset % nw) + nw) % nw)
        const baseShift = normalizedOffset * this.scale

        const w = this.width
        const shift = ((((baseShift - this.offsetX) % w) + w) % w)

        this.canvases[0].style.width = (w + 1) + 'px'
        this.canvases[1].style.width = (w + 1) + 'px'

        this.canvases[0].style.transform = `translate(${-shift}px)`
        this.canvases[1].style.transform = `translate(${w - shift - 1}px)`
    }
}