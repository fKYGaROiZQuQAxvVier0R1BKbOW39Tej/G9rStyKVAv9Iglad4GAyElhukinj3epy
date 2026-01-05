class Utils {
    static Array = class {
        // PUBLIC
        static backwards_each(array, callable) {
            Utils.Math.range(array.length - 1, -1, -1).forEach(i => callable(array[i], i))
        }
    }

    static Math = class {
        // PUBLIC
        static cubic_ease(t) {
            if (t < 0.5) return 4 * Math.pow(t, 3) 
            else return 1 - 4 * Math.pow(1 - t, 3); 
        }

        static clamp(value, min, max) {
            return Math.min(Math.max(value, min), max)
        }

        static direction_from_rotation(angle) {
            const rad = angle * Math.PI / 180

            return {
                x: Math.sin(rad),
                y: -Math.cos(rad)
            }
        }

        static fposmod(x, n) {
            return (x % n + n) % n
        }

        static get_weighted_variant(variants, weights) {
            let totalWeight = 0
            Utils.Math.range(weights.length).forEach(i => totalWeight += weights[i])

            let random = Utils.Math.randf() * totalWeight
            for (let i = 0; i < variants.length; i++) {
                random -= weights[i]
                if (random <= 0) return variants[i]
            }

            return variants[variants.length - 1]
        }
        
        static lerp(from, to, weight) {
            return from + (to - from) * weight
        }

        static normalize(value, min, max) {
            return this.remap(value, min, max, 0, 1)
        }

        static randf() {
            return Math.random()
        }

        static randf_range(min, max) {
            return min + Math.random() * (max - min)
        }

        static range(start, end, step = 1) {
            const result = []

            if (end === undefined) {
                end = start
                start = 0
            }

            if (step > 0) for (let i = start; i < end; i += step) result.push(i)
            else if (step < 0) for (let i = start; i > end; i += step) result.push(i)
            else return null

            return result
        }

        static remap(value, istart, istop, ostart, ostop) {
            return ostart + (value - istart) * (ostop - ostart) / (istop - istart)
        }

    }

    static Tweener = class {
        // VARIABLES
        #tweens = []


        // PUBLIC
        constructor() {
            this.#ready()
        }

        tween(target, property, toValue, duration) {
            this.#ensureUnique(target, property)
            
            if (duration === 0) {
                target[property] = toValue
                return this
            }
            
            this.#tweens.push({
                target,
                property,
                fromValue: target[property],
                toValue,
                elapsed: 0,
                duration: duration * 1000
            })
            
            return this
        }

        tween_color_hsl(target, toR, toG, toB, duration) {
            if (duration === 0) {
                target.colorR = toR
                target.colorG = toG
                target.colorB = toB
                return this
            }
            
            this.#ensureUnique(target, 'colorHSL')
            
            this.#tweens.push({
                target,
                property: 'colorHSL',
                fromR: target.colorR,
                fromG: target.colorG,
                fromB: target.colorB,
                toR, toG, toB,
                elapsed: 0,
                duration: duration * 1000,
                isColorHSL: true
            })
            
            return this
        }


        // PRIVATE
        #ready() {
            ProcessManager.register_process_node(this)
        }

        _process(delta) {
            Utils.Math.range(this.#tweens.length - 1, -1, -1).forEach(i => {
                const tween = this.#tweens[i]
                tween.elapsed += delta

                const progress = Utils.Math.normalize(tween.elapsed, 0, tween.duration)
                const eased = Utils.Math.cubic_ease(progress)
                
                if (tween.isColorHSL) {
                    const rgb = Utils.Color.lerp_hsl(tween.fromR, tween.fromG, tween.fromB, tween.toR, tween.toG, tween.toB, eased)
                    tween.target.colorR = rgb.r
                    tween.target.colorG = rgb.g
                    tween.target.colorB = rgb.b
                } else {
                    tween.target[tween.property] = tween.fromValue + (tween.toValue - tween.fromValue) * eased
                }

                const finished = progress >= 1
                if (finished) {
                    this.#tweens.splice(i, 1)
                }
            })
        }

        #ensureUnique(target, property) {
            this.#tweens = this.#tweens.filter(tween => 
                tween.target !== target || tween.property !== property
            )
        }
    }

    static Color = class {
        static lerp_hsl(fromR, fromG, fromB, toR, toG, toB, weight) {
            const from = this.rgb_to_hsl(fromR, fromG, fromB)
            const to = this.rgb_to_hsl(toR, toG, toB)
            
            let h = from.h
            let hDiff = to.h - from.h

            if (Math.abs(hDiff) > 180) {
                if (hDiff > 0) hDiff -= 360
                else hDiff += 360
            }

            const hue = (h + hDiff * weight + 360) % 360
            const sat = Utils.Math.lerp(from.s, to.s, weight)
            const light = Utils.Math.lerp(from.l, to.l, weight)
            
            return this.hsl_to_rgb(hue, sat, light)
        }

        static rgb_to_hsl(r, g, b) {
            r /= 255
            g /= 255
            b /= 255
            
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const diff = max - min
            
            let h = 0
            let s = 0
            let l = (max + min) / 2
            
            if (diff !== 0) {
                s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
                
                if (max === r) h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
                else if (max === g) h = ((b - r) / diff + 2) / 6
                else h = ((r - g) / diff + 4) / 6
            }
            
            return { h: h * 360, s: s * 100, l: l * 100 }
        }

        static hsl_to_rgb(h, s, l) {
            h /= 360
            s /= 100
            l /= 100
            
            const hue_to_rgb = (p, q, t) => {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1/6) return p + (q - p) * 6 * t
                if (t < 1/2) return q
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
                return p
            }
            
            if (s === 0) {
                const gray = l * 255
                return { r: gray, g: gray, b: gray }
            }
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            
            return {
                r: hue_to_rgb(p, q, h + 1/3) * 255,
                g: hue_to_rgb(p, q, h) * 255,
                b: hue_to_rgb(p, q, h - 1/3) * 255
            }
        }
    }

    static Time = class {
        static parse_iso(isoString) {
            const time = isoString.split('T')[1]
            const hms = time.split(/[Z+\-]/)[0]
            const parts = hms.split(':')

            return {
                hour: +parts[0],
                minute: +parts[1],
                second: +(parts[2]?.split('.')[0] ?? 0),
            }
        }
    }
}