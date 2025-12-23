class Utils {
    static Math = class {
        static ease(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
        }

        static randf_range(min,max) {
            return min + Math.random() * (max - min)
        }

        static get_weighted_variant(variants, weights) {
            let totalWeight = 0
            weights.forEach(w => totalWeight += w)

            let random = Math.random() * totalWeight
            for (let i = 0; i < variants.length; i++) {
                random -= weights[i]
                if (random <= 0) {
                    return variants[i]
                }
            }
            
            return variants[variants.length - 1]
        }
    }

    static Tweener = class {
            constructor() {
            this.tweens = []
            this._ready()
        }

        tween(target, property, toValue, duration) {
            this.tweens = this.tweens.filter(t => !(t.target === target && t.property === property))
            
            if (duration === 0) {
                target[property] = toValue
                return this
            }
            
            this.tweens.push({
                target,
                property,
                fromValue: target[property],
                toValue,
                elapsed: 0,
                duration
            })
            
            return this
        }

        _ready() {
            ProcessManager.register_process_node(this)
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
                    const eased = Utils.Math.ease(t)
                    tween.target[tween.property] = tween.fromValue + (tween.toValue - tween.fromValue) * eased
                }
            }
        }
    }
}
