class ThemeManager {
    // VARIABLES
    static #activeTheme = null
    static #themeMenuButton = document.getElementById("themeMenuButton")
    static #themeMenuPanel = document.getElementById("themeMenuPanel")

    static Themes = {
        theme1: {
            button: document.getElementById("theme1Button"),
            particleConfig: Resources.ParticleConfigs.rainDrops,
            on_select: ThemeManager.#applied_theme_1,
            on_deselect: ThemeManager.#removed_theme_1
        },
        theme2: {
            button: document.getElementById("theme2Button"),
            particleConfig: Resources.ParticleConfigs.rainTrails,
            on_select: ThemeManager.#applied_theme_2,
            on_deselect: ThemeManager.#removed_theme_2
        },
        theme3: {
            button: document.getElementById("theme3Button"),
            particleConfig: Resources.ParticleConfigs.rainSplashes,
            on_select: ThemeManager.#applied_theme_3,
            on_deselect: ThemeManager.#removed_theme_3
        }
    }


    // PRIVATE
    static #ready() {
        ThemeManager.#themeMenuButton.addEventListener("click", () => {
            ThemeManager.#themeMenuPanel.classList.toggle("hidden")
            SoundManager.play((Resources.Sounds.CLICK))
        })

        ThemeManager.Themes.theme1.button.addEventListener("click", () => {
            ThemeManager.#on_theme_button_clicked(Object.keys(ThemeManager.Themes)[0])
            SoundManager.play((Resources.Sounds.CLICK))
        })

        ThemeManager.Themes.theme2.button.addEventListener("click", () => {
            this.#on_theme_button_clicked(Object.keys(ThemeManager.Themes)[1])
            SoundManager.play((Resources.Sounds.CLICK))
        })

        ThemeManager.Themes.theme3.button.addEventListener("click", () => {
            this.#on_theme_button_clicked(Object.keys(ThemeManager.Themes)[2])
            SoundManager.play((Resources.Sounds.CLICK))
        })
    }

    static #pause_auto_weather() {
        WeatherManager.pause_rain()
        WeatherManager.pause_snow()
        WeatherManager.pause_wind()
        WeatherManager.pause_visibility()
        ClockManager.pause()
    }

    static #unpause_auto_weather() {
        WeatherManager.unpause_rain()
        WeatherManager.unpause_snow()
        WeatherManager.unpause_wind()
        WeatherManager.unpause_visibility()
        WeatherManager.update_weather(1)
        ClockManager.unpause()
    }

    static #applied_theme_1() {
        ThemeManager.#pause_auto_weather()
        ClockManager.set_time("17:20:00")
        WeatherManager.set_snow(0)
        WeatherManager.set_visibility(100)
        WeatherManager.set_rain(10)
        WeatherManager.set_wind(20)
    }

    static #removed_theme_1() {
        ThemeManager.#unpause_auto_weather()
    }

    static #applied_theme_2() {
        ThemeManager.#pause_auto_weather()
        ClockManager.set_time("12:00:00")
        WeatherManager.set_snow(0)
        WeatherManager.set_visibility(100)
        WeatherManager.set_rain(0)
        WeatherManager.set_wind(0)
    }

    static #removed_theme_2() {
        ThemeManager.#unpause_auto_weather()
    }

    static #applied_theme_3() {
        ThemeManager.#pause_auto_weather()
        ClockManager.set_time("17:50:00")
        WeatherManager.set_snow(30)
        WeatherManager.set_visibility(100)
        WeatherManager.set_rain(0)
        WeatherManager.set_wind(0)
    }

    static #removed_theme_3() {
        ThemeManager.#unpause_auto_weather()
    }

    static #on_theme_button_clicked(theme) {
        const alreadySelected = ThemeManager.#activeTheme === theme
        if (alreadySelected) {
            ThemeManager.#deselect_theme(theme)
            ThemeManager.#unpause_auto_weather()
            return
        }
        const shouldCleanupPrevious = ThemeManager.#activeTheme !== null
        if (shouldCleanupPrevious) {
            ThemeManager.#deselect_theme(ThemeManager.#activeTheme)
        }
        ThemeManager.#select_theme(theme)
    }

    static #select_theme(theme) {
        ThemeManager.Themes[theme].button.classList.add("selected")
        ThemeManager.Themes[theme].button.classList.remove("deselected")
        ThemeManager.#activeTheme = theme

        ThemeManager.Themes[theme].on_select()
    }

    static #deselect_theme(theme) {
        ThemeManager.Themes[theme].button.classList.remove("selected")
        ThemeManager.Themes[theme].button.classList.add("deselected")
        ThemeManager.#activeTheme = null

        ThemeManager.Themes[theme].on_deselect()
    }


    // INIT
    static {
        ThemeManager.#ready()
    }
}