ParallaxManager.create_layer("assets/images/sky.png").export_as("sky").set_color(251, 204, 186)
ParallaxManager.create_layer("assets/images/medium_clouds.png").export_as("medium_clouds").set_color(0, 0, 255).set_speed(3)
ParallaxManager.create_layer("assets/images/big_clouds.png").export_as("big_clouds").set_color(255, 0, 0).set_speed(1.5)
ParallaxManager.create_layer("assets/images/buildings.png").export_as("buildings")
ParallaxManager.create_layer("assets/images/foreground.png").export_as("foreground")
ParallaxManager.create_layer("assets/images/raycasts.png").export_as("raycasts").set_color(255, 173, 139)
ParallaxManager.create_layer("assets/images/papers.png").export_as("papers")

ProcessManager.start_process_loop()

themes.theme1.button.addEventListener("click", () => _on_theme_button_clicked(Object.keys(themes)[0]))
themes.theme1.button.addEventListener("click", () => SoundManager.play((SoundManager.get_sounds().template)))

themes.theme2.button.addEventListener("click", () => _on_theme_button_clicked(Object.keys(themes)[1]))
themes.theme2.button.addEventListener("click", () => SoundManager.play((SoundManager.get_sounds().template)))

themes.theme3.button.addEventListener("click", () => _on_theme_button_clicked(Object.keys(themes)[2]))
themes.theme3.button.addEventListener("click", () => SoundManager.play((SoundManager.get_sounds().template)))