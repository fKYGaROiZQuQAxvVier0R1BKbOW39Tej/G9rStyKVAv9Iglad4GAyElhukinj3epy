class Resources {
    static Days = [
        'Sunday', 'Monday', 'Tuesday', 
        'Wednesday', 'Thursday', 'Friday', 
        'Saturday'
    ]

    static Months = [
        'January', 'February', 'March', 
        'April', 'May', 'June', 
        'July', 'August', 'September', 
        'October', 'November', 'December'
    ]

    static Sounds = class {
        static CLICK = new Audio('assets/sounds/click.mp3')
    }

    static Videos = class {
        static LOADING = 'assets/videos/loading.mp4'
    }

    static ScreenPosition = class {
        static TOP = 0
        static BOTTOM = 1
        static LEFT = 2
        static RIGHT = 3
        static CENTER = 4
    }

    static Images = class {
        // PARALLAX IMAGES
        static SKY_GRADIENT = "assets/images/layers/sky_gradient.png"
        static GENERIC_SKY_OVERLAY = "assets/images/layers/generic_sky_overlay.png"
        static MEDIUM_CLOUDS = "assets/images/layers/medium_clouds.png"
        static BIG_CLOUDS = "assets/images/layers/big_clouds.png"
        static BUILDINGS = "assets/images/layers/buildings.png"
        static BUILDINGS_LIGHTS = "assets/images/layers/buildings_lights.png"
        static BUILDINGS_SNOW = "assets/images/layers/buildings_snow.png"
        static FOREGROUND = "assets/images/layers/foreground.png"
        static RAYCASTS = "assets/images/layers/raycasts.png"


        // PARTICLE IMAGES
        static RAIN_DROP = "assets/images/rain/rain_drop.png"
        static RAIN_TRAIL = "assets/images/rain/rain_trail.png"
        static RAIN_SPLASH = "assets/images/rain/rain_splash.png"
        static SNOW_SMALL = "assets/images/snow/snow_small.png"
        static SNOW_BIG = "assets/images/snow/snow_big.png"
    }

    static LayerNames = class {
        // PARALLAX LAYERS
        static SKY_GRADIENT = "parallax_sky"
        static SKY_COLOR_OVERLAY = "parallax_sky_overlay"
        static MEDIUM_CLOUDS = "parallax_medium_clouds"
        static BIG_CLOUDS = "parallax_big_clouds"
        static BUILDINGS = "parallax_buildings"
        static BUILDINGS_LIGHTS = "parallax_buildings_lights"
        static BUILDINGS_SNOW = "parallax_buildings_snow"
        static FOG = "parallax_fog"
        static FOREGROUND = "parallax_foreground"
        static RAYCASTS = "parallax_raycasts"
        

        // PARTICLE LAYERS
        static CLOUDS = "particle_clouds"
        static RAIN_DROPS = "particle_rain_drops"
        static RAIN_TRAILS = "particle_rain_trails"
        static RAIN_SPLASHES = "particle_rain_splashes"
        static SNOW_FLAKES = "particle_snow_flakes"
    }

    static ParticleConfigs = class {
        static RAIN_DROP = {
            count:              0 /*instances*/ ,

            imagePool: [
                { path: Resources.Images.RAIN_DROP, weight: 1.0 },
            ],

            minLifetime:        1 /*seconds*/ * 1000 ,
            maxLifetime:        1 /*seconds*/ * 1000 ,
            fadeInDuration:     0 /*seconds*/ * 1000 ,
            fadeOutDuration:    0 /*seconds*/ * 1000 ,

            spawnFrom:          Resources.ScreenPosition.TOP ,
            spread:             500 /*px*/ ,

            minSize:            40 /*px*/ ,
            maxSize:            40 /*px*/ ,

            minRotation:        -20 /*degrees*/ ,
            maxRotation:        -20 /*degrees*/ ,
            minSpeed:           -3600 /*px per sec*/ / 1000 ,
            maxSpeed:           -3600 /*px per sec*/ / 1000 ,
        }

        static RAIN_TRAIL = {
            count:              0 /*instances*/ ,

            imagePool: [
                { path: Resources.Images.RAIN_TRAIL, weight: 1.0 } ,
            ],

            minLifetime:        2 /*seconds*/ * 1000 ,
            maxLifetime:        4 /*seconds*/ * 1000 ,
            fadeInDuration:     0 /*seconds*/ * 1000 ,
            fadeOutDuration:    2 /*seconds*/ * 1000 ,

            spawnFrom:          Resources.ScreenPosition.CENTER ,
            spread:             300 /*px*/ ,

            minSize:            20 /*px*/ ,
            maxSize:            25 /*px*/ ,

            minRotation:        0 /*degrees*/ ,
            maxRotation:        1 /*degrees*/ ,
            minSpeed:           -8 /*px per sec*/ / 1000 ,
            maxSpeed:           -19 /*px per sec*/ / 1000 ,
        }

        static RAIN_SPLASH = {
            count:              0 /*instances*/ ,

            imagePool: [
                { path: Resources.Images.RAIN_SPLASH, weight: 1.0 } ,
            ],

            minLifetime:        0.6 /*seconds*/ * 1000 ,
            maxLifetime:        0.8 /*seconds*/ * 1000 ,
            fadeInDuration:     0 /*seconds*/ * 1000 ,
            fadeOutDuration:    0.3 /*seconds*/ * 1000 ,

            spawnFrom:          Resources.ScreenPosition.CENTER ,
            spread:             300 /*px*/ ,

            minSize:            8 /*px*/ ,
            maxSize:            10 /*px*/ ,

            minRotation:        -0.5 /*degrees*/ ,
            maxRotation:        0.5 /*degrees*/ ,
            minSpeed:           -1 /*px per sec*/ / 1000 ,
            maxSpeed:           -3 /*px per sec*/ / 1000 ,
        }

        static SNOW_FLAKE = {
            count:              0 /*instances*/ ,

            imagePool: [
                { path: Resources.Images.SNOW_SMALL, weight: 0.7 },
                { path: Resources.Images.SNOW_BIG, weight: 0.3 },
            ],

            minLifetime:        16 /*seconds*/ * 1000 ,
            maxLifetime:        16 /*seconds*/ * 1000 ,
            fadeInDuration:     0 /*seconds*/ * 1000 ,
            fadeOutDuration:    3 /*seconds*/ * 1000 ,

            spawnFrom:          Resources.ScreenPosition.TOP ,
            spread:             300 /*px*/ ,

            minSize:            10 /*px*/ ,
            maxSize:            10 /*px*/ ,

            minRotation:        -20 /*degrees*/ ,
            maxRotation:        20 /*degrees*/ ,
            minSpeed:           -50 /*px per sec*/ / 1000 ,
            maxSpeed:           -50 /*px per sec*/ / 1000 ,
        }
    }
}