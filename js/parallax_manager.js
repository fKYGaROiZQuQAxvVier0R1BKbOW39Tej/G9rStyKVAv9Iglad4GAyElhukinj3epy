class ParallaxManager {
    static _tweener = new Tweener()
    static _stage = document.getElementById('stage')
    static _lastZIndex = 0
    static _layersContainer = document.getElementById('layers')
    static _layers = []

    static _ready() {
        this._stage.style.aspectRatio = '1.355'
        console.log("Parallax manager loaded")
    }

    static getTweener() {
        return this._tweener
    }

    static createLayer(imagePath) {
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
        const runRevolution = () => {
            this._layers.forEach(layer => {
                const randomX = xOffsetLimits[0] + Math.random() * (xOffsetLimits[1] - xOffsetLimits[0])
                const randomY = yOffsetLimits[0] + Math.random() * (yOffsetLimits[1] - yOffsetLimits[0])
                const randomR = Math.floor(colorLimits[0][0] + Math.random() * (colorLimits[0][1] - colorLimits[0][0]))
                const randomG = Math.floor(colorLimits[1][0] + Math.random() * (colorLimits[1][1] - colorLimits[1][0]))
                const randomB = Math.floor(colorLimits[2][0] + Math.random() * (colorLimits[2][1] - colorLimits[2][0]))
                const randomOpacity = opacityLimits[0] + Math.random() * (opacityLimits[1] - opacityLimits[0])
                const randomSpeed = speedLimits[0] + Math.random() * (speedLimits[1] - speedLimits[0])

                layer.setOffset(randomX, randomY, 1)
                layer.setColor(randomR, randomG, randomB, 1)
                layer.setOpacity(randomOpacity, 1)
                layer.setSpeed(randomSpeed, 1)
            })  

            revolutions++
            if (revolutions < duration) {
                setTimeout(runRevolution, 1000)
            } else {
                console.log("Stress test finished")
            }
        }

        runRevolution()
        return "Running stress test..."
    }
}

ParallaxManager._ready()