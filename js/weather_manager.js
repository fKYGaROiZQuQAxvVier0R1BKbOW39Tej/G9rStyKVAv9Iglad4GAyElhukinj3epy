class WeatherData {

    // VARIABLES
    static sunrise = null /*date*/
    static sunset = null /*date*/
    static rain = null /*absolute*/
    static snowfall = null /*absolute*/
    static windspeed = null /*absolute*/
    static visibility = null /*percentage*/



    // PUBLIC
    static print_data() {
        console.log(`WeatherData.rain ${WeatherData.rain} \nWeatherData.snow ${WeatherData.snowfall} \nWeatherData.wind ${WeatherData.windspeed}\nWeatherData.visibility ${WeatherData.visibility}`);
    }

    static async update_data() {
        console.log("fetched data")
        return this.#fetch_weather()
            .then(this.#parse_json)
            .then(this.#process_weather)
    }



    // PRIVATE
    static #parse_json(response) {
        return response.json()
    }

    static #fetch_weather() {
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=44.43&longitude=26.10&current=rain,snowfall,windspeed_10m,visibility&daily=sunrise,sunset&timezone=auto`)
    }

    static #process_weather(weather) {
        WeatherData.sunrise = Utils.Time.parse_iso(weather.daily.sunrise[0])
        WeatherData.sunset = Utils.Time.parse_iso(weather.daily.sunset[0])
        WeatherData.rain = weather.current.rain
        WeatherData.snowfall = weather.current.snowfall
        WeatherData.windspeed = weather.current.windspeed_10m
        WeatherData.visibility = Utils.Math.remap(Utils.Math.clamp(weather.current.visibility, 200, 1500), 200, 1500, 0, 100)
    }
}

class MappingBuilder {
    #mapping = null
    #currentRule = null
    #register = null

    constructor(layerName, register) {
        this.#register = register
        this.#mapping = {
            layer: layerName,
            source: null,
            rules: [],
            applyFn: null,
        }
    }

    from(sourceName) {
        this.#mapping.source = sourceName
        return this
    }

    below(x) {
        const rule = { kind: 'below', x: x, props: {} }
        this.#mapping.rules.push(rule)
        this.#currentRule = rule
        return this
    }

    between(a, b) {
        const rule = { kind: 'between', a: a, b: b, peak: null, props: {} }
        this.#mapping.rules.push(rule)
        this.#currentRule = rule
        return this
    }

    above(x) {
        const rule = { kind: 'above', x: x, props: {} }
        this.#mapping.rules.push(rule)
        this.#currentRule = rule
        return this
    }

    peak(x) {
        if (this.#currentRule && this.#currentRule.kind === 'between') {
            this.#currentRule.peak = x
        }
        return this
    }

    apply(fn = null) {
        this.#mapping.applyFn = fn
        this.#register(this.#mapping)
        return this
    }

    count(x) {
        this.#currentRule.props.count = x
        return this
    }

    opacity(x) {
        this.#currentRule.props.opacity = x
        return this
    }

    speed(x) {
        this.#currentRule.props.speed = x
        return this
    }

    angle(x) {
        this.#currentRule.props.angle = x
        return this
    }

    lifetime(x) {
        this.#currentRule.props.lifetime = x
        return this
    }

    fadeout(x) {
        this.#currentRule.props.fadeout = x
        return this
    }

    color(a, b = null) {
        this.#currentRule.props.color = b === null ? a : [a, b]
        return this
    }

    offset(a, b = null) {
        this.#currentRule.props.offset = b === null ? a : [a, b]
        return this
    }

    brightness(a, b = null) {
        this.#currentRule.props.brightness = b === null ? a : [a, b]
        return this
    }

    overlay(color, strength) {
        this.#currentRule.props.overlay = { color: color, strength: strength }
        return this
    }
}

class WeatherManager {
    static #SKY_TIMING = {
        SUNRISE_START: -20,
        SUNRISE_END: 60,

        SUNSET_START: -20,
        SUNSET_END: 65,
    }

    static #FOREGROUND_BG = { r: 93, g: 115, b: 136 }

    static #paused = false

    static #rainPaused = false
    static #manualRain = null

    static #snowPaused = false
    static #manualSnow = null

    static #visibilityPaused = false
    static #manualVisibility = null

    static #windPaused = false
    static #manualWind = null

    static #rangeMappings = []
    static #timeMappings = []


    // APPLY FUNCTION
    static building_lights_color_by_time(ctx, offColor, onColor) {
        const layer = ParallaxManager.get_layer(Resources.LayerNames.BUILDINGS_LIGHTS)
        if (!layer) {
            return
        }

        const lightsOn = ctx.currentMinutes >= 17 * 60 + 20 && ctx.currentMinutes < 24 * 60
        if (lightsOn) {
            layer.set_color(onColor[0], onColor[1], onColor[2], 0)
            layer.set_opacity(onColor[3], 0)
        } else {
            layer.set_color(offColor[0], offColor[1], offColor[2], 0)
            layer.set_opacity(offColor[3], 0)
        }
    }

    static particle_opacity_by_time(ctx, out) {
        if (out.opacity === undefined) {
            return out
        }

        const mul = 0.5 + 0.5 * ctx.daylightT
        out.opacity = out.opacity * mul
        return out
    }

    static fog_multiply_by_sky(ctx, out) {
        if (!out.color) {
            return out
        }

        out.color = {
            r: out.color.r * ctx.sky.r / 255,
            g: out.color.g * ctx.sky.g / 255,
            b: out.color.b * ctx.sky.b / 255,
        }

        return out
    }


    // PUBLIC
    static create_range_mapping(layerName) {
        return new MappingBuilder(layerName, (mapping) => {
            this.#rangeMappings.push(mapping)
        })
    }

    static create_time_mapping(layerName) {
        return new MappingBuilder(layerName, (mapping) => {
            this.#timeMappings.push(mapping)
        })
    }

    static update_weather(transitionDuration = 1) {
        if (this.#paused) {
            return
        }

        if (WeatherData.sunrise === null || WeatherData.sunset === null) {
            return
        }

        const ctx = this.#get_context(transitionDuration)
        const outputs = {}

        this.#rangeMappings.forEach(mapping => {
            const v = this.#get_range_source(mapping.source)
            const out = this.#eval_mapping(mapping, v, ctx)
            this.#merge_output(outputs, mapping.layer, out)
        })

        this.#timeMappings.forEach(mapping => {
            if (mapping.source !== ctx.timeMode) {
                return
            }

            const v = this.#get_time_delta(mapping.source, ctx)
            const out = this.#eval_mapping(mapping, v, ctx)
            this.#merge_output(outputs, mapping.layer, out)
        })

        this.#post_process_outputs(outputs)

        Object.keys(outputs).forEach(layerName => {
            this.#apply_layer_output(layerName, outputs[layerName], ctx)
        })
    }

    static pause() {
        this.#paused = true
    }

    static unpause() {
        this.#paused = false
    }

    static is_paused() {
        return this.#paused
    }



    // RAIN
    static is_rain_paused() {
        return this.#rainPaused
    }

    static get_manual_rain() {
        return this.#manualRain
    }

    static set_rain(rain) {
        this.#manualRain = rain
        this.pause_rain()
        this.update_weather()
    }

    static pause_rain() {
        this.#rainPaused = true
        if (this.#manualRain === null) {
            this.#manualRain = WeatherData.rain
        }
    }

    static unpause_rain() {
        this.#rainPaused = false
        this.#manualRain = null
    }


    // SNOW
    static is_snow_paused() {
        return this.#snowPaused
    }

    static get_manual_snow() {
        return this.#manualSnow
    }

    static set_snow(snowfall) {
        this.#manualSnow = snowfall
        this.pause_snow()
        this.update_weather()
    }

    static pause_snow() {
        this.#snowPaused = true
        if (this.#manualSnow === null) {
            this.#manualSnow = WeatherData.snowfall
        }
    }

    static unpause_snow() {
        this.#snowPaused = false
        this.#manualSnow = null
    }


    // VISIBILITY
    static is_visibility_paused() {
        return this.#visibilityPaused
    }

    static get_manual_visibility() {
        return this.#manualVisibility
    }

    static set_visibility(visibility) {
        this.#manualVisibility = visibility
        this.pause_visibility()
        this.update_weather()
    }

    static pause_visibility() {
        this.#visibilityPaused = true
        if (this.#manualVisibility === null) {
            this.#manualVisibility = WeatherData.visibility
        }
    }

    static unpause_visibility() {
        this.#visibilityPaused = false
        this.#manualVisibility = null
    }



    // WIND
    static is_wind_paused() {
        return this.#windPaused
    }

    static get_manual_wind() {
        return this.#manualWind
    }

    static set_wind(windspeed) {
        this.#manualWind = windspeed
        this.pause_wind()
        this.update_weather()
    }

    static pause_wind() {
        this.#windPaused = true
        if (this.#manualWind === null) {
            this.#manualWind = WeatherData.windspeed
        }
    }

    static unpause_wind() {
        this.#windPaused = false
        this.#manualWind = null
    }



    // PRIVATE
    static #ready() {
        ProcessManager.register_process_node(this)
        WeatherData.update_data().then(() => WeatherManager.update_weather(0)).finally(() => VideoManager.stop(0.25))
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) WeatherManager.update_weather(0)
        })

        console.log("Weather manager loaded")
    }

    static _process(delta) {
        const layer = ParallaxManager.get_layer(Resources.LayerNames.FOREGROUND)
        if (!layer) {
            return
        }

        const base = this.#FOREGROUND_BG
        const r = Math.round(base.r * layer.colorR / 255)
        const g = Math.round(base.g * layer.colorG / 255)
        const b = Math.round(base.b * layer.colorB / 255)

        document.documentElement.style.setProperty('--background_color', `rgba(${r}, ${g}, ${b}, 1)`)
    }

    static #get_context(transitionDuration) {
        const now = ClockManager.is_paused() ? ClockManager.get_manual_time() : new Date()
        const currentMinutes = now.getHours()*60 + now.getMinutes() + now.getSeconds()/60

        const sunriseMinutes = this.#sun_to_minutes(WeatherData.sunrise)
        const sunsetMinutes = this.#sun_to_minutes(WeatherData.sunset)

        const sunriseStartAbs = sunriseMinutes + this.#SKY_TIMING.SUNRISE_START
        const sunsetStartAbs = sunsetMinutes + this.#SKY_TIMING.SUNSET_START

        const timeMode = (currentMinutes >= sunsetStartAbs || currentMinutes < sunriseStartAbs) ? 'sunset' : 'sunrise'

        return {
            td: transitionDuration,
            now: now,
            currentMinutes: currentMinutes,
            sunriseMinutes: sunriseMinutes,
            sunsetMinutes: sunsetMinutes,
            sunriseStartAbs: sunriseStartAbs,
            sunsetStartAbs: sunsetStartAbs,
            daylightT: this.#get_daylight_t(currentMinutes, sunriseMinutes, sunsetMinutes),
            sky: this.#get_sky_color(currentMinutes, sunriseMinutes, sunsetMinutes),
            timeMode: timeMode,
        }
    }

    static #get_sky_color(currentMinutes, sunriseMinutes, sunsetMinutes) {
        const sunriseStart = sunriseMinutes + this.#SKY_TIMING.SUNRISE_START
        const sunriseEnd = sunriseMinutes + this.#SKY_TIMING.SUNRISE_END
        const sunsetStart = sunsetMinutes + this.#SKY_TIMING.SUNSET_START
        const sunsetEnd = sunsetMinutes + this.#SKY_TIMING.SUNSET_END

        let t = 0
        if (currentMinutes >= sunriseStart && currentMinutes <= sunriseEnd) {
            t = this.#clamped_normalize(currentMinutes, sunriseStart, sunriseEnd)
        }
        else if (currentMinutes > sunriseEnd && currentMinutes < sunsetStart) {
            t = 1
        }
        else if (currentMinutes >= sunsetStart && currentMinutes <= sunsetEnd) {
            t = 1 - this.#clamped_normalize(currentMinutes, sunsetStart, sunsetEnd)
        }

        return {
            r: Utils.Math.lerp(42, 182, t),
            g: Utils.Math.lerp(62, 234, t),
            b: Utils.Math.lerp(135, 255, t),
        }
    }

    static #get_daylight_t(currentMinutes, sunriseMinutes, sunsetMinutes) {
        const sunriseStart = sunriseMinutes + this.#SKY_TIMING.SUNRISE_START
        const sunriseEnd = sunriseMinutes + this.#SKY_TIMING.SUNRISE_END
        const sunsetStart = sunsetMinutes + this.#SKY_TIMING.SUNSET_START
        const sunsetEnd = sunsetMinutes + this.#SKY_TIMING.SUNSET_END

        if (currentMinutes >= sunriseStart && currentMinutes <= sunriseEnd) {
            return this.#clamped_normalize(currentMinutes, sunriseStart, sunriseEnd)
        }

        if (currentMinutes > sunriseEnd && currentMinutes < sunsetStart) {
            return 1
        }

        if (currentMinutes >= sunsetStart && currentMinutes <= sunsetEnd) {
            return 1 - this.#clamped_normalize(currentMinutes, sunsetStart, sunsetEnd)
        }

        return 0
    }

    static #get_range_source(sourceName) {
        if (sourceName === 'rain') {
            return this.#rainPaused ? this.#manualRain : WeatherData.rain
        }

        if (sourceName === 'snowfall') {
            return this.#snowPaused ? this.#manualSnow : WeatherData.snowfall
        }

        if (sourceName === 'windspeed') {
            return this.#windPaused ? this.#manualWind : WeatherData.windspeed
        }

        if (sourceName === 'visibility') {
            return this.#visibilityPaused ? this.#manualVisibility : Utils.Math.clamp(WeatherData.visibility, 0, 100)
        }

        const v = WeatherData[sourceName]
        return v === undefined ? 0 : v
    }

    static #get_time_delta(sourceName, ctx) {
        if (sourceName === 'sunrise') {
            return ctx.currentMinutes - ctx.sunriseMinutes
        }

        if (sourceName === 'sunset') {
            let d = ctx.currentMinutes - ctx.sunsetMinutes
            if (ctx.currentMinutes < ctx.sunriseStartAbs) {
                d += 1440
            }
            return d
        }

        return 0
    }

    static #eval_mapping(mapping, v, ctx) {
        const out = {}

        mapping.rules.forEach(rule => {
            if (!this.#rule_matches(rule, v)) {
                return
            }

            const t = rule.kind === 'between' ? this.#clamped_normalize(v, rule.a, rule.b) : 0
            const tri = (rule.kind === 'between' && rule.peak !== null) ? this.#triangle(v, rule.a, rule.peak, rule.b) : null

            Object.keys(rule.props).forEach(prop => {
                if (prop === 'color') {
                    out.color = this.#eval_color(rule.props.color, t)
                    return
                }

                if (prop === 'overlay') {
                    out.overlay = this.#eval_overlay(rule.props.overlay, tri)
                    return
                }

                if (prop === 'offset') {
                    out.offset = this.#eval_scalar(rule.props.offset, t)
                    return
                }

                if (prop === 'brightness') {
                    out.brightness = this.#eval_scalar(rule.props.brightness, t)
                    return
                }

                if (prop === 'opacity') {
                    out.opacity = this.#eval_opacity(rule.props.opacity, t, tri)
                    return
                }

                if (prop === 'count') {
                    out.count = this.#eval_scalar(rule.props.count, t)
                    return
                }

                if (prop === 'fadeout') {
                    out.fadeout = this.#eval_scalar(rule.props.fadeout, t)
                    return
                }

                if (prop === 'lifetime') {
                    out.lifetime = this.#eval_pair(rule.props.lifetime, t)
                    return
                }

                if (prop === 'speed') {
                    out.speed = (mapping.layer === Resources.LayerNames.RAIN_DROPS)
                        ? this.#eval_scalar(rule.props.speed, t)
                        : this.#eval_pair(rule.props.speed, t)
                    return
                }

                if (prop === 'angle') {
                    out.angle = (mapping.layer === Resources.LayerNames.RAIN_DROPS)
                        ? this.#eval_scalar(rule.props.angle, t)
                        : this.#eval_pair(rule.props.angle, t)
                    return
                }
            })
        })

        if (mapping.applyFn) {
            const maybe = mapping.applyFn(ctx, out)
            if (maybe) {
                Object.keys(maybe).forEach(k => out[k] = maybe[k])
            }
        }

        return out
    }

    static #rule_matches(rule, v) {
        if (rule.kind === 'below') {
            return v < rule.x
        }

        if (rule.kind === 'above') {
            return v >= rule.x
        }

        return v >= rule.a && v <= rule.b
    }

    static #clamped_normalize(v, a, b) {
        let t = Utils.Math.normalize(v, a, b)
        t = Utils.Math.clamp(t, 0, 1)
        return t
    }

    static #triangle(v, start, peak, end) {
        const a = this.#clamped_normalize(v, start, peak)
        const b = this.#clamped_normalize(v, peak, end)
        return a * (1 - b)
    }

    static #eval_scalar(spec, t) {
        if (Array.isArray(spec)) {
            return Utils.Math.lerp(spec[0], spec[1], t)
        }

        return spec
    }

    static #eval_opacity(spec, t, tri) {
        if (tri !== null) {
            if (Array.isArray(spec)) {
                return spec[0] + (spec[1] - spec[0]) * tri
            }
            return spec * tri
        }

        return this.#eval_scalar(spec, t)
    }

    static #eval_pair(spec, t) {
        if (Array.isArray(spec) && Array.isArray(spec[0])) {
            const min = Utils.Math.lerp(spec[0][0], spec[0][1], t)
            const max = Utils.Math.lerp(spec[1][0], spec[1][1], t)
            return [min, max]
        }

        return spec
    }

    static #eval_color(spec, t) {
        const a = Array.isArray(spec[0]) ? spec[0] : spec
        const b = Array.isArray(spec[0]) ? spec[1] : null

        if (!b) {
            return { r: a[0], g: a[1], b: a[2] }
        }

        return {
            r: Utils.Math.lerp(a[0], b[0], t),
            g: Utils.Math.lerp(a[1], b[1], t),
            b: Utils.Math.lerp(a[2], b[2], t),
        }
    }

    static #eval_overlay(spec, tri) {
        let a = spec.strength
        if (tri !== null) {
            a = a * tri
        }

        return { r: spec.color[0], g: spec.color[1], b: spec.color[2], a: a }
    }

    static #merge_output(outputs, layerName, out) {
        if (!outputs[layerName]) {
            outputs[layerName] = {}
        }

        Object.keys(out).forEach(k => {
            outputs[layerName][k] = out[k]
        })
    }

    static #post_process_outputs(outputs) {
        const splashes = outputs[Resources.LayerNames.RAIN_SPLASHES]
        if (splashes && splashes.count !== undefined && splashes.lifetime) {
            const avg = (splashes.lifetime[0] + splashes.lifetime[1]) / 2
            splashes.count = splashes.count * avg / 0.7
        }
    }

    static #apply_layer_output(layerName, out, ctx) {
        const layer = ParallaxManager.get_layer(layerName)
        if (!layer) {
            return
        }

        const td = ctx.td
        let appliedColor = null

        if (out.brightness !== undefined) {
            appliedColor = { r: out.brightness, g: out.brightness, b: out.brightness }
            layer.set_color(out.brightness, out.brightness, out.brightness, td)
        }

        if (out.color) {
            let r = out.color.r
            let g = out.color.g
            let b = out.color.b

            if (out.overlay && out.overlay.a > 0) {
                r = r * (1 - out.overlay.a) + out.overlay.r * out.overlay.a
                g = g * (1 - out.overlay.a) + out.overlay.g * out.overlay.a
                b = b * (1 - out.overlay.a) + out.overlay.b * out.overlay.a
            }

            appliedColor = { r: r, g: g, b: b }
            layer.set_color(r, g, b, td)
        }

        if (layerName === Resources.LayerNames.FOREGROUND && appliedColor) {
            const base = this.#FOREGROUND_BG
            const br = Math.round(base.r * appliedColor.r / 255)
            const bg = Math.round(base.g * appliedColor.g / 255)
            const bb = Math.round(base.b * appliedColor.b / 255)
        }

        if (out.offset !== undefined) {
            layer.set_offset(0, out.offset, td)
        }

        if (out.opacity !== undefined) {
            layer.set_opacity(out.opacity, td)
        }

        if (out.count !== undefined && layer.set_particle_count) {
            layer.set_particle_count(out.count, td)
        }

        if (out.speed !== undefined && layer.set_particle_speed) {
            if (Array.isArray(out.speed)) {
                layer.set_particle_speed(out.speed[0], out.speed[1], td)
            }
            else {
                layer.set_particle_speed(out.speed, out.speed, td)
            }
        }

        if (out.angle !== undefined && layer.set_particle_rotation) {
            if (Array.isArray(out.angle)) {
                layer.set_particle_rotation(out.angle[0], out.angle[1], td)
            }
            else {
                layer.set_particle_rotation(out.angle, out.angle, td)
            }
        }

        if (out.lifetime && layer.set_particle_lifetime) {
            layer.set_particle_lifetime(out.lifetime[0], out.lifetime[1], td)
        }

        if (out.fadeout !== undefined && layer.set_particle_fade_out_duration) {
            layer.set_particle_fade_out_duration(out.fadeout, td)
        }
    }

    static #sun_to_minutes(sun) {
        return sun.hour * 60 + sun.minute + sun.second / 60
    }



    // INIT
    static {
        this.#ready()
    }
}
