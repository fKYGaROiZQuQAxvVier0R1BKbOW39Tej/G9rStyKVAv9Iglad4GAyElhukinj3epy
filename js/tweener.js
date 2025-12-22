class Tweener {
    constructor() {
        this.tweens = []
        this._ready()
    }

    _ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    tween(target, property, toValue, duration) {
        this.tweens = this.tweens.filter(t => !(t.target === target && t.property === property))
        
        if (duration === 0) {
            target[property] = toValue
            return
        }
        
        this.tweens.push({
            target,
            property,
            fromValue: target[property],
            toValue,
            elapsed: 0,
            duration
        })
    }

    _ready() {
        ProcessManager.registerProcess(this)
    }

    _process(delta) {
        for (let i = this.tweens.length - 1; i >= 0; i--) {
            const tween = this.tweens[i]
            tween.elapsed += delta
            
            if (tween.elapsed >= tween.duration) {
                tween.target[tween.property] = tween.toValue
                this.tweens.splice(i, 1)
            } else {
                const t = tween.elapsed / tween.duration
                const eased = this._ease(t)
                tween.target[tween.property] = tween.fromValue + (tween.toValue - tween.fromValue) * eased
            }
        }
    }
}