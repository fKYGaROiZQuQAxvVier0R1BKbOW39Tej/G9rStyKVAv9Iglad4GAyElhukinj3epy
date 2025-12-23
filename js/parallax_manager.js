class ParallaxManager {
    static _tweener = new Utils.Tweener()
    static _stage = document.getElementById('stage')
    static _lastZIndex = 0
    static _layersContainer = document.getElementById('layers')
    static _layers = []

    static _ready() {
        this._stage.style.aspectRatio = '1.355'
        console.log("Parallax manager loaded")
    }

    static get_tweener() {
        return this._tweener
    }

    static create_layer(imagePath) {
        const wrapper = document.createElement('div')
        wrapper.className = 'layer'
        wrapper.style.zIndex = this._lastZIndex++

        const inner = document.createElement('div')
        inner.className = 'layer-inner'
        wrapper.appendChild(inner)

        const canvases = []
        for (let i = 0; i < 2; i++) {
            const c = document.createElement('canvas')
            inner.appendChild(c)
            canvases.push(c)
        }

        this._layersContainer.appendChild(wrapper)

        const layer = new ParallaxLayer(imagePath, wrapper, inner, canvases)
        this._layers.push(layer)

        return layer
    }

    static stress(duration = 10) {
        const xOffsetLimits = [-300, 300]
        const yOffsetLimits = [-300, 300]
        const colorLimits = [[0, 255], [0, 255], [0, 255]]
        const opacityLimits = [0, 1]
        const speedLimits = [0, 300]

        
        let revolutions = 0
        const run_revolution = () => {
            this._layers.forEach(layer => {
                const randomX = xOffsetLimits[0] + Math.random() * (xOffsetLimits[1] - xOffsetLimits[0])
                const randomY = yOffsetLimits[0] + Math.random() * (yOffsetLimits[1] - yOffsetLimits[0])
                const randomR = Math.floor(colorLimits[0][0] + Math.random() * (colorLimits[0][1] - colorLimits[0][0]))
                const randomG = Math.floor(colorLimits[1][0] + Math.random() * (colorLimits[1][1] - colorLimits[1][0]))
                const randomB = Math.floor(colorLimits[2][0] + Math.random() * (colorLimits[2][1] - colorLimits[2][0]))
                const randomOpacity = opacityLimits[0] + Math.random() * (opacityLimits[1] - opacityLimits[0])
                const randomSpeed = speedLimits[0] + Math.random() * (speedLimits[1] - speedLimits[0])

                layer.set_offset(randomX, randomY, 1)
                layer.set_color(randomR, randomG, randomB, 1)
                layer.set_opacity(randomOpacity, 1)
                layer.set_speed(randomSpeed, 1)
            })  

            revolutions++
            if (revolutions < duration) {
                setTimeout(run_revolution, 1000)
            } else {
                console.log("Stress test finished")
            }
        }

        run_revolution()
        return "Running stress test..."
    }

    static {
        this._ready()
    }
}

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

    export_as(variableName) {
        window[variableName] = this

        return this
    }

    set_offset(x = 0, y = 0, duration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'offsetX', x, duration)
            .tween(this, 'offsetY', y, duration)

        return this
    }

    set_opacity(value, duration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'opacity', Math.max(0, Math.min(1, value)), duration)

        return this
    }

    set_color(r, g, b, duration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'colorR', r, duration)
            .tween(this, 'colorG', g, duration)
            .tween(this, 'colorB', b, duration)

        return this
    }

    set_speed(speed, duration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'speed', speed === null ? 0 : speed, duration)

        return this
    }

    reset_offset(duration = 0) { 
        return this.set_offset(0, 0, duration)
    }

    reset_opacity(duration = 0) { 
        return this.set_opacity(1, duration)
    }

    reset_speed(duration = 0) { 
        return this.set_speed(0, duration)
    }

    reset_color(duration = 0) { 
        return this.set_color(255, 255, 255, duration)
    }

    _ready() {
        ProcessManager.register_process_node(this)
    }

    _process(delta) {
        this.wrapper.style.opacity = this.opacity
        this.inner.style.transform = `translate(0px, ${this.offsetY}px)`
        this.canvases.forEach(canvas => this._process_canvas(delta, canvas))
    }

    _resize(canvas) {
        this.scale = this.wrapper.getBoundingClientRect().height / this.image.naturalHeight
        this.width = this.image.naturalWidth * this.scale
        this.wrapper.style.width = this.width + 'px'
        canvas.style.width = this.width + 'px'
    }

    _process_canvas(delta, canvas) {
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