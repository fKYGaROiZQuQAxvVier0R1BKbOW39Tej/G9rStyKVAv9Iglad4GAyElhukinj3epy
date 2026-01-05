//#region LAYER CREATION

ParallaxManager.create_layer(Resources.Images.SKY_GRADIENT)
    .set_vertical()
    .set_color(251, 204, 186)
    .export_as(Resources.LayerNames.SKY_GRADIENT)

ParallaxManager.create_layer(Resources.Images.GENERIC_SKY_OVERLAY)
    .set_horizontal()
    .set_opacity(0)
    .export_as(Resources.LayerNames.SKY_COLOR_OVERLAY)

ParallaxManager.create_layer(Resources.Images.MEDIUM_CLOUDS)
    .set_horizontal()
    .set_scroll_speed(0.6)
    .set_offset(75,-35)
    .export_as(Resources.LayerNames.MEDIUM_CLOUDS)

ParallaxManager.create_layer(Resources.Images.BIG_CLOUDS)
    .set_horizontal()
    .set_scroll_speed(0.3)
    .set_offset(0,-45)
    .export_as(Resources.LayerNames.BIG_CLOUDS)

ParallaxManager.create_layer(Resources.Images.BUILDINGS)
    .set_horizontal()
    .set_offset(0,8)
    .export_as(Resources.LayerNames.BUILDINGS)

ParallaxManager.create_layer(Resources.Images.BUILDINGS_LIGHTS)
    .set_horizontal()
    .set_offset(0,8)
    .export_as(Resources.LayerNames.BUILDINGS_LIGHTS)

ParallaxManager.create_layer(Resources.Images.BUILDINGS_SNOW)
    .set_horizontal()
    .set_offset(0,8)
    .export_as(Resources.LayerNames.BUILDINGS_SNOW)

ParallaxManager.create_layer(Resources.Images.GENERIC_SKY_OVERLAY)
    .set_horizontal()
    .set_opacity(0)
    .export_as(Resources.LayerNames.FOG)

ParticleManager.create_layer(Resources.ParticleConfigs.RAIN_DROP)
    .use_antialiasing()
    .set_opacity(0.42)
    .export_as(Resources.LayerNames.RAIN_DROPS)
    .start()

ParticleManager.create_layer(Resources.ParticleConfigs.RAIN_TRAIL)
    .set_opacity(0.7)
    .export_as(Resources.LayerNames.RAIN_TRAILS)
    .start()

ParticleManager.create_layer(Resources.ParticleConfigs.RAIN_SPLASH)
    .set_opacity(0.65)
    .export_as(Resources.LayerNames.RAIN_SPLASHES)
    .start()

ParticleManager.create_layer(Resources.ParticleConfigs.SNOW_FLAKE)
    .export_as(Resources.LayerNames.SNOW_FLAKES)
    .start()

ParallaxManager.create_layer(Resources.Images.FOREGROUND)
    .set_horizontal()
    .export_as(Resources.LayerNames.FOREGROUND)

ParallaxManager.create_layer(Resources.Images.RAYCASTS)
    .set_horizontal()
    .set_color(255, 0, 0)
    .export_as(Resources.LayerNames.RAYCASTS)

//#endregion LAYER CREATION



//#region BEHAVIOR MAPPINGS

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_DROPS)
    .from('rain')
    .below(1).count(0).opacity(0)
    .between(1, 3).count([0, 8]).opacity(0.42)
    .between(3, 8).count([8, 1024]).opacity([0.42, 0.48])
    .between(8, 50).count([1024, 4096]).opacity([0.48, 0.5])
    .above(50).count(4096).opacity(0.5)
    .apply(WeatherManager.particle_opacity_by_time)

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_TRAILS)
    .from('rain')
    .below(3).count(0).opacity(0)
    .between(3, 8).count([0, 12]).opacity([0.5, 0.65])
    .between(8, 50).count([12, 16]).opacity([0.65, 0.7])
    .above(50).count(16).opacity(0.7)
    .apply(WeatherManager.particle_opacity_by_time)

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_SPLASHES)
    .from('rain')
    .below(3).count(0).opacity(0)
    .between(3, 8).count([0, 8]).opacity([0.65, 0.72])
    .between(8, 50).count([8, 16]).opacity([0.72, 0.75])
    .above(50).count(16).opacity(0.75)
    .apply(WeatherManager.particle_opacity_by_time)

WeatherManager.create_range_mapping(Resources.LayerNames.SNOW_FLAKES)
    .from('snowfall')
    .below(1).count(0).opacity(0)
    .between(1, 3).count(128).opacity(0.25)
    .between(3, 8).count([128, 768]).opacity([0.25, 0.45])
    .between(8, 50).count([768, 1536]).opacity([0.45, 0.5])
    .above(50).count(1536).opacity(0.5)
    .apply(WeatherManager.particle_opacity_by_time)

WeatherManager.create_range_mapping(Resources.LayerNames.SNOW_FLAKES)
    .from('windspeed')
    .below(2).angle([-20, 20]).speed(-50)
    .between(2, 12).angle([[-20, -20], [20, -20]]).speed([[-50, -1200], [-50, -1200]])
    .above(12).angle(-20).speed(-1200)
    .apply()

WeatherManager.create_range_mapping(Resources.LayerNames.BUILDINGS_SNOW)
    .from('snowfall')
    .below(3).opacity(0)
    .between(3, 5).opacity([0.4, 0.9])
    .above(5).opacity(0.9)
    .apply(WeatherManager.particle_opacity_by_time)

WeatherManager.create_range_mapping(Resources.LayerNames.BUILDINGS_LIGHTS)
    .apply((context) => WeatherManager.building_lights_color_by_time(context, [105, 117, 164, 0.2], [210, 194, 83, 0.7]))

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_DROPS)
    .from('windspeed')
    .below(5).speed(-2900).angle(0)
    .between(5, 10).speed([-2900, -3600])
    .between(5, 35).angle([0, -20])
    .above(10).speed(-3600)
    .above(35).angle(-20)
    .apply()

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_TRAILS)
    .from('windspeed')
    .below(5).lifetime([2, 4]).fadeout(2).speed([-8, -19]).angle([-1, 0])
    .between(5, 35).lifetime([[2, 0.75], [4, 1.5]]).fadeout([2, 0.5]).speed([[-8, -20], [-19, -60]]).angle([[-1, -3], [0, -1]])
    .above(35).lifetime([0.75, 1.5]).fadeout(0.5).speed([-20, -60]).angle([-3, -1])
    .apply()

WeatherManager.create_range_mapping(Resources.LayerNames.RAIN_SPLASHES)
    .from('windspeed')
    .below(5).lifetime([0.6, 0.8]).fadeout(0.3)
    .between(5, 35).lifetime([[0.6, 0.1], [0.8, 0.1]]).fadeout([0.3, 0.1])
    .above(35).lifetime([0.1, 0.1]).fadeout(0.1)
    .apply()

WeatherManager.create_range_mapping(Resources.LayerNames.FOG)
    .from('visibility')
    .below(0).opacity(0.65)
    .between(0, 100).opacity([0.65, 0])
    .above(100).opacity(0)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.BIG_CLOUDS)
    .from('sunrise')
    .below(-20).opacity(0.25).color([125,125,125])
    .between(-20, 60).opacity([0.25, 0.5]).color([125,125,125], [255,255,255])
    .above(60).opacity(0.5).color([255,255,255])
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.BIG_CLOUDS)
    .from('sunset')
    .below(-20).opacity(0.5).color([255,255,255])
    .between(-20, 65).opacity([0.5, 0.25]).color([255,255,255], [125,125,125])
    .above(65).opacity(0.25).color([125,125,125])
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.MEDIUM_CLOUDS)
    .from('sunrise')
    .below(-20).opacity(0.2).color([125,125,125])
    .between(-20, 60).opacity([0.2, 0.4]).color([125,125,125], [255,255,255])
    .above(60).opacity(0.4).color([255,255,255])
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.MEDIUM_CLOUDS)
    .from('sunset')
    .below(-20).opacity(0.4).color([255,255,255])
    .between(-20, 65).opacity([0.4, 0.2]).color([255,255,255], [125,125,125])
    .above(65).opacity(0.2).color([125,125,125])
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.SKY_GRADIENT)
    .from('sunrise')
    .below(-20).color([42,62,135]).offset(-62)
    .between(-20, 60).color([42,62,135], [182,234,255]).offset(-62, -255)
    .above(60).color([182,234,255]).offset(-255)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.SKY_GRADIENT)
    .from('sunset')
    .below(-20).color([182,234,255]).offset(-255)
    .between(-20, 65).color([182,234,255], [42,62,135]).offset(-255, -62)
    .above(65).color([42,62,135]).offset(-62)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.SKY_COLOR_OVERLAY)
    .from('sunrise')
    .below(-20).opacity(0)
    .between(-20, 60).peak(10).color([255,0,0]).opacity(0.2)
    .above(60).opacity(0)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.SKY_COLOR_OVERLAY)
    .from('sunset')
    .below(-20).opacity(0)
    .between(-20, 65).peak(0).color([255,0,0]).opacity(0.3)
    .above(65).opacity(0)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.RAYCASTS)
    .from('sunrise')
    .below(8).opacity(0)
    .between(8, 18).peak(13).opacity([0, 0.3])
    .above(18).opacity(0)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.RAYCASTS)
    .from('sunset')
    .below(-2).opacity(0)
    .between(-2, 18).peak(8).opacity([0, 0.3])
    .above(18).opacity(0)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.BUILDINGS)
    .from('sunrise')
    .below(-20).brightness(100)
    .between(-20, 60).brightness([100, 255])
    .above(60).brightness(255)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.BUILDINGS)
    .from('sunset')
    .below(-20).brightness(255)
    .between(-20, 65).brightness([255, 100])
    .above(65).brightness(100)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.FOREGROUND)
    .from('sunrise')
    .below(-20).brightness(75)
    .between(-20, 60).brightness([75, 255])
    .above(60).brightness(255)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.FOREGROUND)
    .from('sunset')
    .below(-20).brightness(255)
    .between(-20, 65).brightness([255, 75])
    .above(65).brightness(75)
    .apply()

WeatherManager.create_time_mapping(Resources.LayerNames.FOG)
    .from('sunrise')
    .below(-20).color([71,69,63])
    .between(-20, 60).peak(10).color([71,69,63], [242,240,234]).overlay([255,0,0], 0.2)
    .above(60).color([242,240,234])
    .apply(WeatherManager.fog_multiply_by_sky)

WeatherManager.create_time_mapping(Resources.LayerNames.FOG)
    .from('sunset')
    .below(-20).color([242,240,234])
    .between(-20, 65).peak(0).color([242,240,234], [71,69,63]).overlay([255,0,0], 0.3)
    .above(65).color([71,69,63])
    .apply(WeatherManager.fog_multiply_by_sky)

//#endregion BEHAVIOR MAPPINGS



ProcessManager.start_process_loop()



VideoManager.play(Resources.Videos.LOADING, 0.25)