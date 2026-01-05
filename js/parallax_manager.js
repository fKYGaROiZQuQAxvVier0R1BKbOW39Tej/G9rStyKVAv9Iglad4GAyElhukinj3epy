class ParallaxManager {
    // VARIABLES
    static #tweener = new Utils.Tweener()
    static #stage = document.getElementById('stage')
    static #layersContainer = document.getElementById('layers')
    static #layers = []

    
    // PUBLIC
    static create_layer(imagePath) {
        const wrapper = document.createElement('div')
        wrapper.className = 'layer'

        const inner = document.createElement('div')
        inner.className = 'layer-inner'
        
        wrapper.appendChild(inner)

        const tileCanvases = []
        Utils.Math.range(2).forEach(i => {
            const canvas = document.createElement('canvas')
            inner.appendChild(canvas)
            tileCanvases.push(canvas)
        })

        this.#layersContainer.appendChild(wrapper)

        const layer = new ParallaxLayer(imagePath, wrapper, inner, tileCanvases)
        this.#layers.push(layer)

        return layer
    }

    static get_layer(variableName) {
        return window[variableName]
    }
    
    static get_tweener() {
        return this.#tweener
    }


    // PRIVATE
    static #ready() {
        this.#stage.style.aspectRatio = '1.355'
        console.log("Parallax manager loaded")
    }
    

    // INIT
    static {
        this.#ready()
    }
}

class ParallaxLayer extends AbstractScrollLayer {
    // VARIABLES
    #image
    #wrapper
    #inner
    #tileCanvases
    #scrollOffset = 0
    #scale = 1
    #width = 0


    // PUBLIC
    constructor(imagePath, wrapper, inner, tileCanvases) {
        super()
        
        this.#image = new Image()
        this.#image.src = imagePath
        this.#wrapper = wrapper
        this.#inner = inner
        this.#tileCanvases = tileCanvases

        this.#ready()
    }


    // PRIVATE
    #ready() {
        ProcessManager.register_process_node(this)
    }

    _process(delta) {
        this.#tileCanvases.forEach(canvas => {
            this.#resize(canvas)
        })

        this.#apply_offset()
        this.#apply_opacity()
        this.#apply_scroll(delta)

        this.#tileCanvases.forEach(canvas => {
            this.#draw(canvas)
        })
    }

    #resize(canvas) {
        const h = this.#image.naturalHeight
        const w = this.#image.naturalWidth

        if (this.vertical) {
            this.#wrapper.style.width = '100%'
            const rect = this.#wrapper.getBoundingClientRect()
            this.#scale = rect.width / w
            this.#width = rect.width
            const height = h * this.#scale
            this.#wrapper.style.height = height + 'px'
            canvas.style.width = '100%'
            canvas.style.height = height + 'px'
        } else {
            const rect = this.#wrapper.getBoundingClientRect()
            this.#scale = rect.height / h
            this.#width = w * this.#scale
            this.#wrapper.style.width = this.#width + 'px'
            this.#wrapper.style.height = ''
            canvas.style.width = this.#width + 'px'
            canvas.style.height = ''
        }
    }

    #draw(canvas) {
        const c = canvas.getContext('2d')
        canvas.width = this.#image.naturalWidth
        canvas.height = this.#image.naturalHeight

        c.clearRect(0, 0, canvas.width, canvas.height)
        c.drawImage(this.#image, 0, 0)
        c.globalCompositeOperation = 'multiply'
        c.fillStyle = `rgb(${this.colorR}, ${this.colorG}, ${this.colorB})`
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.globalCompositeOperation = 'destination-in'
        c.drawImage(this.#image, 0, 0)
    }

    #apply_offset() {
        const y = this.offsetY * this.#scale
        this.#inner.style.transform = `translate(0px, ${y}px)`
    }

    #apply_opacity() {
        this.#wrapper.style.opacity = this.opacity
    }

    #apply_scroll(delta) {
        this.#scrollOffset -= this.scrollSpeed * delta
        const shift = Utils.Math.fposmod((this.#scrollOffset - this.offsetX) * this.#scale, this.#width)
        this.#tileCanvases[0].style.transform = `translate(${-shift}px)`
        this.#tileCanvases[1].style.transform = `translate(${this.#width - shift - 1}px)`
    }
}