class AbstractLayer {
    // PUBLIC
    constructor() {
        Object.defineProperties(this, {
            colorR: { value: 255, writable: true, enumerable: false },
            colorG: { value: 255, writable: true, enumerable: false },
            colorB: { value: 255, writable: true, enumerable: false },
            offsetX: { value: 0, writable: true, enumerable: false },
            offsetY: { value: 0, writable: true, enumerable: false },
            opacity: { value: 1, writable: true, enumerable: false },
            antialiasing: { value: false, writable: true, enumerable: false },
        })
    }

    export_as(propertyName) {
        window[propertyName] = this

        return this
    }

    set_color(r, g, b, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween_color_hsl(this, r, g, b, transitionDuration)

        return this
    }

    set_offset(x = 0, y = 0, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'offsetX', x, transitionDuration)
            .tween(this, 'offsetY', y, transitionDuration)

        return this
    }

    set_opacity(value, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'opacity', value, transitionDuration)

        return this
    }

    reset_color(transitionDuration = 0) {
        return this.set_color(255, 255, 255, transitionDuration)
    }

    use_antialiasing() {
        this.antialiasing = true
        return this
    }

    reset_offset(transitionDuration = 0) {
        return this.set_offset(0, 0, transitionDuration)
    }

    reset_opacity(transitionDuration = 0) {
        return this.set_opacity(1, transitionDuration)
    }
}

class AbstractScrollLayer extends AbstractLayer {
    // PUBLIC
    constructor() {
        super()

        Object.defineProperties(this, {
            scrollSpeed: { value: 0, writable: true, enumerable: false },
            vertical: { value: false, writable: true, enumerable: false },
        })
    }

    set_horizontal() {
        this.vertical = false

        return this
    }

    set_vertical() {
        this.vertical = true

        return this
    }

    set_scroll_speed(value, transitionDuration = 0) {
        ParallaxManager.get_tweener()
            .tween(this, 'scrollSpeed', value / 1000, transitionDuration)

        return this
    }

    reset_scroll_speed(transitionDuration = 0) {
        return this.set_scroll_speed(0, transitionDuration)
    }
}
