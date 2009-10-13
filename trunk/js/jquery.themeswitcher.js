/* jQuery plugin themeswitcher
---------------------------------------------------------------------*/
$.fn.themeswitcher = function(settings){
	var options = jQuery.extend({
		loadTheme: null,
		initialText: 'Switch Theme',
		width: 150,
		height: 200,
		buttonPreText: 'Theme: ',
		closeOnSelect: true,
		buttonHeight: 14,
		cookieName: 'jquery-ui-theme',
		onOpen: function(){},
		onClose: function(){},
		onSelect: function(){}
	}, settings);

	//markup 
	var button = $('<a href="#" class="jquery-ui-themeswitcher-trigger"><span class="jquery-ui-themeswitcher-icon"></span><span class="jquery-ui-themeswitcher-title">'+ options.initialText +'</span></a>');
	var switcherpane = $('<div class="jquery-ui-themeswitcher"><div id="themeGallery">	<ul>		<li><a href="?ffDefault=Trebuchet+MS,+Tahoma,+Verdana,+Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.1em&amp;cornerRadius=4px&amp;bgColorHeader=f6a828&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=35&amp;borderColorHeader=e78f08&amp;fcHeader=ffffff&amp;iconColorHeader=ffffff&amp;bgColorContent=eeeeee&amp;bgTextureContent=03_highlight_soft.png&amp;bgImgOpacityContent=100&amp;borderColorContent=dddddd&amp;fcContent=333333&amp;iconColorContent=222222&amp;bgColorDefault=f6f6f6&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=100&amp;borderColorDefault=cccccc&amp;fcDefault=1c94c4&amp;iconColorDefault=ef8c08&amp;bgColorHover=fdf5ce&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=100&amp;borderColorHover=fbcb09&amp;fcHover=c77405&amp;iconColorHover=ef8c08&amp;bgColorActive=ffffff&amp;bgTextureActive=02_glass.png&amp;bgImgOpacityActive=65&amp;borderColorActive=fbd850&amp;fcActive=eb8f00&amp;iconColorActive=ef8c08&amp;bgColorHighlight=ffe45c&amp;bgTextureHighlight=03_highlight_soft.png&amp;bgImgOpacityHighlight=75&amp;borderColorHighlight=fed22f&amp;fcHighlight=363636&amp;iconColorHighlight=228ef1&amp;bgColorError=b81900&amp;bgTextureError=08_diagonals_thick.png&amp;bgImgOpacityError=18&amp;borderColorError=cd0a0a&amp;fcError=ffffff&amp;iconColorError=ffd27a&amp;bgColorOverlay=666666&amp;bgTextureOverlay=08_diagonals_thick.png&amp;bgImgOpacityOverlay=20&amp;opacityOverlay=50&amp;bgColorShadow=000000&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=10&amp;opacityShadow=20&amp;thicknessShadow=5px&amp;offsetTopShadow=-5px&amp;offsetLeftShadow=-5px&amp;cornerRadiusShadow=5px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_ui_light.png" alt="UI Lightness" title="UI Lightness" />			<span class="themeName">UI lightness</span>		</a></li>				<li><a href="?ffDefault=Segoe+UI%2C+Arial%2C+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.1em&amp;cornerRadius=6px&amp;bgColorHeader=333333&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=25&amp;borderColorHeader=333333&amp;fcHeader=ffffff&amp;iconColorHeader=ffffff&amp;bgColorContent=000000&amp;bgTextureContent=05_inset_soft.png&amp;bgImgOpacityContent=25&amp;borderColorContent=666666&amp;fcContent=ffffff&amp;iconColorContent=cccccc&amp;bgColorDefault=555555&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=20&amp;borderColorDefault=666666&amp;fcDefault=eeeeee&amp;iconColorDefault=cccccc&amp;bgColorHover=0078a3&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=40&amp;borderColorHover=59b4d4&amp;fcHover=ffffff&amp;iconColorHover=ffffff&amp;bgColorActive=f58400&amp;bgTextureActive=05_inset_soft.png&amp;bgImgOpacityActive=30&amp;borderColorActive=ffaf0f&amp;fcActive=ffffff&amp;iconColorActive=222222&amp;bgColorHighlight=eeeeee&amp;bgTextureHighlight=03_highlight_soft.png&amp;bgImgOpacityHighlight=80&amp;borderColorHighlight=cccccc&amp;fcHighlight=2e7db2&amp;iconColorHighlight=4b8e0b&amp;bgColorError=ffc73d&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=40&amp;borderColorError=ffb73d&amp;fcError=111111&amp;iconColorError=a83300&amp;bgColorOverlay=5c5c5c&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=50&amp;opacityOverlay=80&amp;bgColorShadow=cccccc&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=30&amp;opacityShadow=60&amp;thicknessShadow=7px&amp;offsetTopShadow=-7px&amp;offsetLeftShadow=-7px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_ui_dark.png" alt="UI Darkness" title="UI Darkness" />			<span class="themeName">UI darkness</span>		</a></li>			<li><a href="?ffDefault=Verdana,Arial,sans-serif&amp;fwDefault=normal&amp;fsDefault=1.1em&amp;cornerRadius=4px&amp;bgColorHeader=cccccc&amp;bgTextureHeader=03_highlight_soft.png&amp;bgImgOpacityHeader=75&amp;borderColorHeader=aaaaaa&amp;fcHeader=222222&amp;iconColorHeader=222222&amp;bgColorContent=ffffff&amp;bgTextureContent=01_flat.png&amp;bgImgOpacityContent=75&amp;borderColorContent=aaaaaa&amp;fcContent=222222&amp;iconColorContent=222222&amp;bgColorDefault=e6e6e6&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=75&amp;borderColorDefault=d3d3d3&amp;fcDefault=555555&amp;iconColorDefault=888888&amp;bgColorHover=dadada&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=75&amp;borderColorHover=999999&amp;fcHover=212121&amp;iconColorHover=454545&amp;bgColorActive=ffffff&amp;bgTextureActive=02_glass.png&amp;bgImgOpacityActive=65&amp;borderColorActive=aaaaaa&amp;fcActive=212121&amp;iconColorActive=454545&amp;bgColorHighlight=fbf9ee&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=fcefa1&amp;fcHighlight=363636&amp;iconColorHighlight=2e83ff&amp;bgColorError=fef1ec&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=95&amp;borderColorError=cd0a0a&amp;fcError=cd0a0a&amp;iconColorError=cd0a0a&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=0&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_smoothness.png" alt="Smoothness" title="Smoothness" />			<span class="themeName">Smoothness</span>		</a></li>					<li><a href="?ffDefault=Verdana%2CArial%2Csans-serif&amp;fwDefault=normal&amp;fsDefault=1.1em&amp;cornerRadius=5px&amp;bgColorHeader=2191c0&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=75&amp;borderColorHeader=4297d7&amp;fcHeader=eaf5f7&amp;iconColorHeader=d8e7f3&amp;bgColorContent=fcfdfd&amp;bgTextureContent=06_inset_hard.png&amp;bgImgOpacityContent=100&amp;borderColorContent=a6c9e2&amp;fcContent=222222&amp;iconColorContent=0078ae&amp;bgColorDefault=0078ae&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=45&amp;borderColorDefault=77d5f7&amp;fcDefault=ffffff&amp;iconColorDefault=e0fdff&amp;bgColorHover=79c9ec&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=75&amp;borderColorHover=448dae&amp;fcHover=026890&amp;iconColorHover=056b93&amp;bgColorActive=6eac2c&amp;bgTextureActive=12_gloss_wave.png&amp;bgImgOpacityActive=50&amp;borderColorActive=acdd4a&amp;fcActive=ffffff&amp;iconColorActive=f5e175&amp;bgColorHighlight=f8da4e&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=fcd113&amp;fcHighlight=915608&amp;iconColorHighlight=f7a50d&amp;bgColorError=e14f1c&amp;bgTextureError=12_gloss_wave.png&amp;bgImgOpacityError=45&amp;borderColorError=cd0a0a&amp;fcError=ffffff&amp;iconColorError=fcd113&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=75&amp;opacityOverlay=30&amp;bgColorShadow=999999&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=55&amp;opacityShadow=45&amp;thicknessShadow=0px&amp;offsetTopShadow=5px&amp;offsetLeftShadow=5px&amp;cornerRadiusShadow=5px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_start_menu.png" alt="Start" title="Start" />			<span class="themeName">Start</span>		</a></li>		<li><a href="?ffDefault=Lucida+Grande,+Lucida+Sans,+Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.1em&amp;cornerRadius=5px&amp;bgColorHeader=5c9ccc&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=55&amp;borderColorHeader=4297d7&amp;fcHeader=ffffff&amp;iconColorHeader=d8e7f3&amp;bgColorContent=fcfdfd&amp;bgTextureContent=06_inset_hard.png&amp;bgImgOpacityContent=100&amp;borderColorContent=a6c9e2&amp;fcContent=222222&amp;iconColorContent=469bdd&amp;bgColorDefault=dfeffc&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=85&amp;borderColorDefault=c5dbec&amp;fcDefault=2e6e9e&amp;iconColorDefault=6da8d5&amp;bgColorHover=d0e5f5&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=75&amp;borderColorHover=79b7e7&amp;fcHover=1d5987&amp;iconColorHover=217bc0&amp;bgColorActive=f5f8f9&amp;bgTextureActive=06_inset_hard.png&amp;bgImgOpacityActive=100&amp;borderColorActive=79b7e7&amp;fcActive=e17009&amp;iconColorActive=f9bd01&amp;bgColorHighlight=fbec88&amp;bgTextureHighlight=01_flat.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=fad42e&amp;fcHighlight=363636&amp;iconColorHighlight=2e83ff&amp;bgColorError=fef1ec&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=95&amp;borderColorError=cd0a0a&amp;fcError=cd0a0a&amp;iconColorError=cd0a0a&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=0&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_windoze.png" alt="Windoze" title="Windoze" />			<span class="themeName">Redmond</span>		</a></li>		<li><a href="?ffDefault=Lucida+Grande%2C+Lucida+Sans%2C+Arial%2C+sans-serif&amp;fwDefault=normal&amp;fsDefault=1.1em&amp;cornerRadius=3px&amp;bgColorHeader=e7eef3&amp;bgTextureHeader=03_highlight_soft.png&amp;bgImgOpacityHeader=100&amp;borderColorHeader=b2c7d7&amp;fcHeader=222222&amp;iconColorHeader=72a7cf&amp;bgColorContent=f9f9f9&amp;bgTextureContent=04_highlight_hard.png&amp;bgImgOpacityContent=100&amp;borderColorContent=dddddd&amp;fcContent=362b36&amp;iconColorContent=222222&amp;bgColorDefault=e6e6e6&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=80&amp;borderColorDefault=cccccc&amp;fcDefault=444444&amp;iconColorDefault=888888&amp;bgColorHover=f0f0f0&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=100&amp;borderColorHover=b2c7d7&amp;fcHover=0b5b98&amp;iconColorHover=2694e8&amp;bgColorActive=99c2ff&amp;bgTextureActive=02_glass.png&amp;bgImgOpacityActive=50&amp;borderColorActive=2694e8&amp;fcActive=000000&amp;iconColorActive=ffffff&amp;bgColorHighlight=fbf5d0&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=f9dd34&amp;fcHighlight=363636&amp;iconColorHighlight=2e83ff&amp;bgColorError=fef1ec&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=95&amp;borderColorError=cd0a0a&amp;fcError=cd0a0a&amp;iconColorError=cd0a0a&amp;bgColorOverlay=444444&amp;bgTextureOverlay=08_diagonals_thick.png&amp;bgImgOpacityOverlay=15&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=07_diagonals_small.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=30&amp;thicknessShadow=0px&amp;offsetTopShadow=4px&amp;offsetLeftShadow=4px&amp;cornerRadiusShadow=4px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_cupertino.png" alt="Cupertino" title="Cupertino" />			<span class="themeName">Cupertino</span>				</a></li>		<li><a href="?ffDefault=segoe+ui%2C+Arial%2C+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.1em&amp;cornerRadius=4px&amp;bgColorHeader=3b3b35&amp;bgTextureHeader=05_inset_soft.png&amp;bgImgOpacityHeader=22&amp;borderColorHeader=59584f&amp;fcHeader=ffffff&amp;iconColorHeader=e7e6e4&amp;bgColorContent=f0efea&amp;bgTextureContent=03_highlight_soft.png&amp;bgImgOpacityContent=100&amp;borderColorContent=aaaaaa&amp;fcContent=222222&amp;iconColorContent=808080&amp;bgColorDefault=327E04&amp;bgTextureDefault=03_highlight_soft.png&amp;bgImgOpacityDefault=25&amp;borderColorDefault=327E04&amp;fcDefault=ffffff&amp;iconColorDefault=eeeeee&amp;bgColorHover=5A9D1A&amp;bgTextureHover=03_highlight_soft.png&amp;bgImgOpacityHover=25&amp;borderColorHover=327E04&amp;fcHover=ffffff&amp;iconColorHover=ffffff&amp;bgColorActive=f0efea&amp;bgTextureActive=07_diagonals_small.png&amp;bgImgOpacityActive=100&amp;borderColorActive=c4c5c3&amp;fcActive=403D38&amp;iconColorActive=8DC262&amp;bgColorHighlight=fcf0ba&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=e8e1b5&amp;fcHighlight=363636&amp;iconColorHighlight=8DC262&amp;bgColorError=ffedad&amp;bgTextureError=03_highlight_soft.png&amp;bgImgOpacityError=95&amp;borderColorError=e3a345&amp;fcError=cd5c0a&amp;iconColorError=cd0a0a&amp;bgColorOverlay=2e2e28&amp;bgTextureOverlay=21_glow_ball.png&amp;bgImgOpacityOverlay=25&amp;opacityOverlay=65&amp;bgColorShadow=f0f0f0&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=35&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_south_street.png" alt="South St" title="South St" />			<span class="themeName">South Street</span>				</a></li>		<li><a href="?ffDefault=Arial,sans-serif&amp;fwDefault=bold&amp;fsDefault=1.3em&amp;cornerRadius=.4em&amp;bgColorHeader=cc0000&amp;bgTextureHeader=03_highlight_soft.png&amp;bgImgOpacityHeader=15&amp;borderColorHeader=cc0000&amp;fcHeader=ffffff&amp;iconColorHeader=ffffff&amp;bgColorContent=ffffff&amp;bgTextureContent=01_flat.png&amp;bgImgOpacityContent=75&amp;borderColorContent=eeeeee&amp;fcContent=333333&amp;iconColorContent=cc0000&amp;bgColorDefault=eeeeee&amp;bgTextureDefault=04_highlight_hard.png&amp;bgImgOpacityDefault=100&amp;borderColorDefault=d8dcdf&amp;fcDefault=004276&amp;iconColorDefault=cc0000&amp;bgColorHover=f6f6f6&amp;bgTextureHover=04_highlight_hard.png&amp;bgImgOpacityHover=100&amp;borderColorHover=cdd5da&amp;fcHover=111111&amp;iconColorHover=cc0000&amp;bgColorActive=ffffff&amp;bgTextureActive=01_flat.png&amp;bgImgOpacityActive=65&amp;borderColorActive=eeeeee&amp;fcActive=cc0000&amp;iconColorActive=cc0000&amp;bgColorHighlight=fbf8ee&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=fcd3a1&amp;fcHighlight=555555&amp;iconColorHighlight=004276&amp;bgColorError=eee7e7&amp;bgTextureError=08_diagonals_thick.png&amp;bgImgOpacityError=55&amp;borderColorError=cc0000&amp;fcError=cc0000&amp;iconColorError=cc0000&amp;bgColorOverlay=a6a6a6&amp;bgTextureOverlay=09_dots_small.png&amp;bgImgOpacityOverlay=65&amp;opacityOverlay=40&amp;bgColorShadow=333333&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=10&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_blitzer.png" alt="Blitzer" title="Blitzer" />			<span class="themeName">Blitzer</span>		</a></li>			<li><a href="?tr=ffDefault=Helvetica,Arial,sans-serif&amp;fwDefault=normal&amp;fsDefault=1.2em&amp;cornerRadius=6px&amp;bgColorHeader=cb842e&amp;bgTextureHeader=02_glass.png&amp;bgImgOpacityHeader=25&amp;borderColorHeader=d49768&amp;fcHeader=ffffff&amp;iconColorHeader=ffffff&amp;bgColorContent=f4f0ec&amp;bgTextureContent=05_inset_soft.png&amp;bgImgOpacityContent=100&amp;borderColorContent=e0cfc2&amp;fcContent=1e1b1d&amp;iconColorContent=c47a23&amp;bgColorDefault=ede4d4&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=70&amp;borderColorDefault=cdc3b7&amp;fcDefault=3f3731&amp;iconColorDefault=f08000&amp;bgColorHover=f5f0e5&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=100&amp;borderColorHover=f5ad66&amp;fcHover=a46313&amp;iconColorHover=f08000&amp;bgColorActive=f4f0ec&amp;bgTextureActive=04_highlight_hard.png&amp;bgImgOpacityActive=100&amp;borderColorActive=e0cfc2&amp;fcActive=b85700&amp;iconColorActive=f35f07&amp;bgColorHighlight=f5f5b5&amp;bgTextureHighlight=04_highlight_hard.png&amp;bgImgOpacityHighlight=75&amp;borderColorHighlight=d9bb73&amp;fcHighlight=060200&amp;iconColorHighlight=cb672b&amp;bgColorError=fee4bd&amp;bgTextureError=04_highlight_hard.png&amp;bgImgOpacityError=65&amp;borderColorError=f8893f&amp;fcError=592003&amp;iconColorError=ff7519&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=75&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=75&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_humanity.png" alt="Humanity" title="Humanity" />			<span class="themeName">Humanity</span>		</a></li>			<li><a href="?ffDefault=Gill+Sans,Arial,sans-serif&amp;fwDefault=bold&amp;fsDefault=1.2em&amp;cornerRadius=4px&amp;bgColorHeader=35414f&amp;bgTextureHeader=09_dots_small.png&amp;bgImgOpacityHeader=35&amp;borderColorHeader=2c4359&amp;fcHeader=e1e463&amp;iconColorHeader=e1e463&amp;bgColorContent=ffffff&amp;bgTextureContent=01_flat.png&amp;bgImgOpacityContent=75&amp;borderColorContent=aaaaaa&amp;fcContent=2c4359&amp;iconColorContent=c02669&amp;bgColorDefault=93c3cd&amp;bgTextureDefault=07_diagonals_small.png&amp;bgImgOpacityDefault=50&amp;borderColorDefault=93c3cd&amp;fcDefault=333333&amp;iconColorDefault=ffffff&amp;bgColorHover=ccd232&amp;bgTextureHover=07_diagonals_small.png&amp;bgImgOpacityHover=75&amp;borderColorHover=999999&amp;fcHover=212121&amp;iconColorHover=454545&amp;bgColorActive=db4865&amp;bgTextureActive=07_diagonals_small.png&amp;bgImgOpacityActive=40&amp;borderColorActive=ff6b7f&amp;fcActive=ffffff&amp;iconColorActive=ffffff&amp;bgColorHighlight=ffff38&amp;bgTextureHighlight=10_dots_medium.png&amp;bgImgOpacityHighlight=80&amp;borderColorHighlight=b4d100&amp;fcHighlight=363636&amp;iconColorHighlight=88a206&amp;bgColorError=ff3853&amp;bgTextureError=07_diagonals_small.png&amp;bgImgOpacityError=50&amp;borderColorError=ff6b7f&amp;fcError=ffffff&amp;iconColorError=ffeb33&amp;bgColorOverlay=f7f7ba&amp;bgTextureOverlay=11_white_lines.png&amp;bgImgOpacityOverlay=85&amp;opacityOverlay=80&amp;bgColorShadow=ba9217&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=75&amp;opacityShadow=20&amp;thicknessShadow=10px&amp;offsetTopShadow=8px&amp;offsetLeftShadow=8px&amp;cornerRadiusShadow=5px">		<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_hot_sneaks.png" alt="Hot Sneaks" title="Hot Sneaks" />			<span class="themeName">Hot sneaks</span>		</a></li>			<li><a href="?ffDefault=segoe+ui,+Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.2em&amp;cornerRadius=3px&amp;bgColorHeader=f9f9f9&amp;bgTextureHeader=03_highlight_soft.png&amp;bgImgOpacityHeader=100&amp;borderColorHeader=cccccc&amp;fcHeader=e69700&amp;iconColorHeader=5fa5e3&amp;bgColorContent=eeeeee&amp;bgTextureContent=06_inset_hard.png&amp;bgImgOpacityContent=100&amp;borderColorContent=aaaaaa&amp;fcContent=222222&amp;iconColorContent=0a82eb&amp;bgColorDefault=1484e6&amp;bgTextureDefault=08_diagonals_thick.png&amp;bgImgOpacityDefault=22&amp;borderColorDefault=ffffff&amp;fcDefault=ffffff&amp;iconColorDefault=fcdd4a&amp;bgColorHover=2293f7&amp;bgTextureHover=08_diagonals_thick.png&amp;bgImgOpacityHover=26&amp;borderColorHover=2293f7&amp;fcHover=ffffff&amp;iconColorHover=ffffff&amp;bgColorActive=e69700&amp;bgTextureActive=08_diagonals_thick.png&amp;bgImgOpacityActive=20&amp;borderColorActive=e69700&amp;fcActive=ffffff&amp;iconColorActive=ffffff&amp;bgColorHighlight=c5ddfc&amp;bgTextureHighlight=07_diagonals_small.png&amp;bgImgOpacityHighlight=25&amp;borderColorHighlight=ffffff&amp;fcHighlight=333333&amp;iconColorHighlight=0b54d5&amp;bgColorError=e69700&amp;bgTextureError=08_diagonals_thick.png&amp;bgImgOpacityError=20&amp;borderColorError=e69700&amp;fcError=ffffff&amp;iconColorError=ffffff&amp;bgColorOverlay=e6b900&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=0&amp;opacityOverlay=30&amp;bgColorShadow=e69700&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=20&amp;thicknessShadow=0px&amp;offsetTopShadow=6px&amp;offsetLeftShadow=6px&amp;cornerRadiusShadow=3px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_excite_bike.png" alt="Excite Bike" title="Excite Bike" />			<span class="themeName">Excite Bike</span>			</a></li>		<li><a href="?tr&amp;ffDefault=Helvetica,+Arial,+sans-serif&amp;fwDefault=normal&amp;fsDefault=1.1&amp;fsDefaultUnit=em&amp;cornerRadius=5&amp;cornerRadiusUnit=px&amp;bgColorHeader=888888&amp;bgTextureHeader=04_highlight_hard.png&amp;bgImgOpacityHeader=15&amp;borderColorHeader=404040&amp;fcHeader=ffffff&amp;iconColorHeader=cccccc&amp;bgColorContent=121212&amp;bgTextureContent=12_gloss_wave.png&amp;bgImgOpacityContent=16&amp;borderColorContent=404040&amp;fcContent=eeeeee&amp;iconColorContent=bbbbbb&amp;bgColorDefault=adadad&amp;bgTextureDefault=03_highlight_soft.png&amp;bgImgOpacityDefault=35&amp;borderColorDefault=cccccc&amp;fcDefault=333333&amp;iconColorDefault=666666&amp;bgColorHover=dddddd&amp;bgTextureHover=03_highlight_soft.png&amp;bgImgOpacityHover=60&amp;borderColorHover=dddddd&amp;fcHover=000000&amp;iconColorHover=c98000&amp;bgColorActive=121212&amp;bgTextureActive=05_inset_soft.png&amp;bgImgOpacityActive=15&amp;borderColorActive=000000&amp;fcActive=ffffff&amp;iconColorActive=f29a00&amp;bgColorHighlight=555555&amp;bgTextureHighlight=04_highlight_hard.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=404040&amp;fcHighlight=cccccc&amp;iconColorHighlight=aaaaaa&amp;bgColorError=fef1ec&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=95&amp;borderColorError=cd0a0a&amp;fcError=cd0a0a&amp;iconColorError=cd0a0a">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_black_matte.png" alt="Vader" title="Vader" />			<span class="themeName">Vader</span>			</a></li>				<li><a href="?ffDefault=Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.3em&amp;cornerRadius=4px&amp;bgColorHeader=0b3e6f&amp;bgTextureHeader=08_diagonals_thick.png&amp;bgImgOpacityHeader=15&amp;borderColorHeader=0b3e6f&amp;fcHeader=f6f6f6&amp;iconColorHeader=98d2fb&amp;bgColorContent=111111&amp;bgTextureContent=12_gloss_wave.png&amp;bgImgOpacityContent=20&amp;borderColorContent=000000&amp;fcContent=d9d9d9&amp;iconColorContent=9ccdfc&amp;bgColorDefault=333333&amp;bgTextureDefault=09_dots_small.png&amp;bgImgOpacityDefault=20&amp;borderColorDefault=333333&amp;fcDefault=ffffff&amp;iconColorDefault=9ccdfc&amp;bgColorHover=00498f&amp;bgTextureHover=09_dots_small.png&amp;bgImgOpacityHover=40&amp;borderColorHover=222222&amp;fcHover=ffffff&amp;iconColorHover=ffffff&amp;bgColorActive=292929&amp;bgTextureActive=01_flat.png&amp;bgImgOpacityActive=40&amp;borderColorActive=096ac8&amp;fcActive=75abff&amp;iconColorActive=00498f&amp;bgColorHighlight=0b58a2&amp;bgTextureHighlight=10_dots_medium.png&amp;bgImgOpacityHighlight=30&amp;borderColorHighlight=052f57&amp;fcHighlight=ffffff&amp;iconColorHighlight=ffffff&amp;bgColorError=a32d00&amp;bgTextureError=09_dots_small.png&amp;bgImgOpacityError=30&amp;borderColorError=cd0a0a&amp;fcError=ffffff&amp;iconColorError=ffffff&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=0&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_dot_luv.png" alt="Dot Luv" title="Dot Luv" />			<span class="themeName">Dot Luv</span>			</a></li>			<li><a href="?ffDefault=Segoe+UI,+Helvetica,+Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.2em&amp;cornerRadius=4px&amp;bgColorHeader=cdc2a1&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=75&amp;borderColorHeader=9c947c&amp;fcHeader=222222&amp;iconColorHeader=222222&amp;bgColorContent=cdc2a1&amp;bgTextureContent=05_inset_soft.png&amp;bgImgOpacityContent=40&amp;borderColorContent=9c947c&amp;fcContent=000000&amp;iconColorContent=222222&amp;bgColorDefault=382f28&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=10&amp;borderColorDefault=382f28&amp;fcDefault=9bcc60&amp;iconColorDefault=9bcc60&amp;bgColorHover=44372c&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=20&amp;borderColorHover=0f0f0f&amp;fcHover=add978&amp;iconColorHover=add978&amp;bgColorActive=cdc2a1&amp;bgTextureActive=03_highlight_soft.png&amp;bgImgOpacityActive=40&amp;borderColorActive=9c947c&amp;fcActive=382f28&amp;iconColorActive=382f28&amp;bgColorHighlight=619226&amp;bgTextureHighlight=03_highlight_soft.png&amp;bgImgOpacityHighlight=20&amp;borderColorHighlight=add978&amp;fcHighlight=ffffff&amp;iconColorHighlight=ffffff&amp;bgColorError=5f391b&amp;bgTextureError=02_glass.png&amp;bgImgOpacityError=15&amp;borderColorError=5f391b&amp;fcError=ffffff&amp;iconColorError=f1fd86&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=01_flat.png&amp;bgImgOpacityOverlay=0&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_mint_choco.png" alt="Mint Choc" title="Mint Choc" />			<span class="themeName">Mint Choc</span>		</a></li>		<li><a href="?ffDefault=Verdana,+Arial,+sans-serif&amp;fwDefault=normal&amp;fsDefault=1.1em&amp;cornerRadius=4px&amp;bgColorHeader=333333&amp;bgTextureHeader=08_diagonals_thick.png&amp;bgImgOpacityHeader=8&amp;borderColorHeader=a3a3a3&amp;fcHeader=eeeeee&amp;iconColorHeader=bbbbbb&amp;bgColorContent=f9f9f9&amp;bgTextureContent=04_highlight_hard.png&amp;bgImgOpacityContent=100&amp;borderColorContent=cccccc&amp;fcContent=222222&amp;iconColorContent=222222&amp;bgColorDefault=111111&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=40&amp;borderColorDefault=777777&amp;fcDefault=e3e3e3&amp;iconColorDefault=ededed&amp;bgColorHover=1c1c1c&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=55&amp;borderColorHover=000000&amp;fcHover=ffffff&amp;iconColorHover=ffffff&amp;bgColorActive=ffffff&amp;bgTextureActive=01_flat.png&amp;bgImgOpacityActive=65&amp;borderColorActive=cccccc&amp;fcActive=222222&amp;iconColorActive=222222&amp;bgColorHighlight=ffeb80&amp;bgTextureHighlight=06_inset_hard.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=ffde2e&amp;fcHighlight=363636&amp;iconColorHighlight=4ca300&amp;bgColorError=cd0a0a&amp;bgTextureError=06_inset_hard.png&amp;bgImgOpacityError=45&amp;borderColorError=9e0505&amp;fcError=ffffff&amp;iconColorError=ffcf29&amp;bgColorOverlay=aaaaaa&amp;bgTextureOverlay=04_highlight_hard.png&amp;bgImgOpacityOverlay=40&amp;opacityOverlay=30&amp;bgColorShadow=aaaaaa&amp;bgTextureShadow=03_highlight_soft.png&amp;bgImgOpacityShadow=50&amp;opacityShadow=20&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=8px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_black_tie.png" alt="Black Tie" title="Black Tie" />			<span class="themeName">Black Tie</span>		</a></li>		<li><a href="?ffDefault=Segoe+UI,+Helvetica,+Arial,+sans-serif&amp;fwDefault=bold&amp;fsDefault=1.2em&amp;cornerRadius=6px&amp;bgColorHeader=9fda58&amp;bgTextureHeader=12_gloss_wave.png&amp;bgImgOpacityHeader=85&amp;borderColorHeader=000000&amp;fcHeader=222222&amp;iconColorHeader=1f1f1f&amp;bgColorContent=000000&amp;bgTextureContent=12_gloss_wave.png&amp;bgImgOpacityContent=55&amp;borderColorContent=4a4a4a&amp;fcContent=ffffff&amp;iconColorContent=9fda58&amp;bgColorDefault=0a0a0a&amp;bgTextureDefault=02_glass.png&amp;bgImgOpacityDefault=40&amp;borderColorDefault=1b1613&amp;fcDefault=b8ec79&amp;iconColorDefault=b8ec79&amp;bgColorHover=000000&amp;bgTextureHover=02_glass.png&amp;bgImgOpacityHover=60&amp;borderColorHover=000000&amp;fcHover=96f226&amp;iconColorHover=b8ec79&amp;bgColorActive=4c4c4c&amp;bgTextureActive=01_flat.png&amp;bgImgOpacityActive=0&amp;borderColorActive=696969&amp;fcActive=ffffff&amp;iconColorActive=ffffff&amp;bgColorHighlight=f1fbe5&amp;bgTextureHighlight=02_glass.png&amp;bgImgOpacityHighlight=55&amp;borderColorHighlight=8cce3b&amp;fcHighlight=030303&amp;iconColorHighlight=000000&amp;bgColorError=f6ecd5&amp;bgTextureError=12_gloss_wave.png&amp;bgImgOpacityError=95&amp;borderColorError=f1ac88&amp;fcError=74736d&amp;iconColorError=cd0a0a&amp;bgColorOverlay=262626&amp;bgTextureOverlay=07_diagonals_small.png&amp;bgImgOpacityOverlay=50&amp;opacityOverlay=30&amp;bgColorShadow=303030&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=0&amp;opacityShadow=50&amp;thicknessShadow=6px&amp;offsetTopShadow=-6px&amp;offsetLeftShadow=-6px&amp;cornerRadiusShadow=12px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_trontastic.png" alt="Trontastic" title="Trontastic" />			<span class="themeName">Trontastic</span>			</a></li>			<li><a href="?ffDefault=Georgia%2C+Verdana%2CArial%2Csans-serif&amp;fwDefault=bold&amp;fsDefault=1.2em&amp;cornerRadius=5px&amp;bgColorHeader=261803&amp;bgTextureHeader=13_diamond.png&amp;bgImgOpacityHeader=8&amp;borderColorHeader=baaa5a&amp;fcHeader=eacd86&amp;iconColorHeader=e9cd86&amp;bgColorContent=443113&amp;bgTextureContent=13_diamond.png&amp;bgImgOpacityContent=8&amp;borderColorContent=efec9f&amp;fcContent=efec9f&amp;iconColorContent=efec9f&amp;bgColorDefault=4f4221&amp;bgTextureDefault=13_diamond.png&amp;bgImgOpacityDefault=10&amp;borderColorDefault=362917&amp;fcDefault=f8eec9&amp;iconColorDefault=e8e2b5&amp;bgColorHover=675423&amp;bgTextureHover=13_diamond.png&amp;bgImgOpacityHover=25&amp;borderColorHover=362917&amp;fcHover=f8eec9&amp;iconColorHover=f2ec64&amp;bgColorActive=443113&amp;bgTextureActive=13_diamond.png&amp;bgImgOpacityActive=8&amp;borderColorActive=efec9f&amp;fcActive=f9f2bd&amp;iconColorActive=f9f2bd&amp;bgColorHighlight=d5ac5d&amp;bgTextureHighlight=13_diamond.png&amp;bgImgOpacityHighlight=25&amp;borderColorHighlight=362917&amp;fcHighlight=060200&amp;iconColorHighlight=070603&amp;bgColorError=fee4bd&amp;bgTextureError=04_highlight_hard.png&amp;bgImgOpacityError=65&amp;borderColorError=c26629&amp;fcError=803f1e&amp;iconColorError=ff7519&amp;bgColorOverlay=372806&amp;bgTextureOverlay=13_diamond.png&amp;bgImgOpacityOverlay=20&amp;opacityOverlay=80&amp;bgColorShadow=ddd4b0&amp;bgTextureShadow=01_flat.png&amp;bgImgOpacityShadow=75&amp;opacityShadow=30&amp;thicknessShadow=8px&amp;offsetTopShadow=-8px&amp;offsetLeftShadow=-8px&amp;cornerRadiusShadow=12px">			<img src="http://jqueryui.com/themeroller/images/themeGallery/theme_30_swanky_purse.png" alt="Swanky Purse" title="Swanky Purse" />			<span class="themeName">Swanky Purse</span>			</a></li>	</ul></div></div>').find('div').removeAttr('id');
	
	//button events
	button.click(
		function(){
			if(switcherpane.is(':visible')){ switcherpane.spHide(); }
			else{ switcherpane.spShow(); }
					return false;
		}
	);
	
	//menu events (mouseout didn't work...)
	switcherpane.hover(
		function(){},
		function(){if(switcherpane.is(':visible')){$(this).spHide();}}
	);

	//show/hide panel functions
	$.fn.spShow = function(){ $(this).css({top: button.offset().top + options.buttonHeight + 6, left: button.offset().left}).slideDown(50); button.css(button_active); options.onOpen(); }
	$.fn.spHide = function(){ $(this).slideUp(50, function(){options.onClose();}); button.css(button_default); }
	
		
	/* Theme Loading
	---------------------------------------------------------------------*/
	switcherpane.find('a').click(function(){
		updateCSS( $(this).attr('href') );
		var themeName = $(this).find('span').text();
		button.find('.jquery-ui-themeswitcher-title').text( options.buttonPreText + themeName );
		$.cookie(options.cookieName, themeName);
		options.onSelect();
		if(options.closeOnSelect && switcherpane.is(':visible')){ switcherpane.spHide(); }
		return false;
	});
	
	//function to append a new theme stylesheet with the new style changes
	function updateCSS(locStr){
		var locStr = locStr.split('?')[1];
		var cssLink = $('<link href="http://jqueryui.com/themeroller/css/parseTheme.css.php?'+ locStr +'" type="text/css" rel="Stylesheet" />');
		//once 1.6 final is ready: $("head").append(cssLink);
		if( $("link[href*=parseTheme.css.php], link[href=ui.theme.css]").size() > 0){
			$("link[href*=parseTheme.css.php]:last, link[href=ui.theme.css]:last").eq(0).after(cssLink);
		}
		else {
			$("head").append(cssLink);
		}
		
		
		if( $("link[href*=parseTheme.css.php]").size() > 3){
			$("link[href*=parseTheme.css.php]:first").remove();
		}	
	}	
	
	/* Inline CSS 
	---------------------------------------------------------------------*/
	var button_default = {
		fontFamily: 'Trebuchet MS, Verdana, sans-serif',
		fontSize: '11px',
		color: '#666',
		background: '#eee url(http://jqueryui.com/themeroller/themeswitchertool/images/buttonbg.png) 50% 50% repeat-x',
		border: '1px solid #ccc',
		'-moz-border-radius': '6px',
		'-webkit-border-radius': '6px',
		textDecoration: 'none',
		padding: '3px 3px 3px 8px',
		width: options.width - 11,//minus must match left and right padding 
		display: 'block',
		height: options.buttonHeight,
		outline: '0'
	};
	var button_hover = {
		'borderColor':'#bbb',
		'background': '#f0f0f0',
		cursor: 'pointer',
		color: '#444'
	};
	var button_active = {
		color: '#aaa',
		background: '#000',
		border: '1px solid #ccc',
		borderBottom: 0,
		'-moz-border-radius-bottomleft': 0,
		'-webkit-border-bottom-left-radius': 0,
		'-moz-border-radius-bottomright': 0,
		'-webkit-border-bottom-right-radius': 0,
		outline: '0'
	};
	
	
	
	//button css
	button.css(button_default)
	.hover(
		function(){ 
			$(this).css(button_hover); 
		},
		function(){ 
		 if( !switcherpane.is(':animated') && switcherpane.is(':hidden') ){	$(this).css(button_default);  }
		}	
	)
	.find('.jquery-ui-themeswitcher-icon').css({
		float: 'right',
		width: '16px',
		height: '16px',
		background: 'url(http://jqueryui.com/themeroller/themeswitchertool/images/icon_color_arrow.gif) 50% 50% no-repeat'
	});	
	//pane css
	switcherpane.css({
		position: 'absolute',
		float: 'left',
		fontFamily: 'Trebuchet MS, Verdana, sans-serif',
		fontSize: '12px',
		background: '#000',
		color: '#fff',
		padding: '8px 3px 3px',
		border: '1px solid #ccc',
		'-moz-border-radius-bottomleft': '6px',
		'-webkit-border-bottom-left-radius': '6px',
		'-moz-border-radius-bottomright': '6px',
		'-webkit-border-bottom-right-radius': '6px',
		borderTop: 0,
		zIndex: 999999,
		width: options.width-6//minus must match left and right padding
	})
	.find('ul').css({
		listStyle: 'none',
		margin: '0',
		padding: '0',
		overflow: 'auto',
		height: options.height
	}).end()
	.find('li').hover(
		function(){ 
			$(this).css({
				'borderColor':'#555',
				'background': 'url(http://jqueryui.com/themeroller/themeswitchertool/images/menuhoverbg.png) 50% 50% repeat-x',
				cursor: 'pointer'
			}); 
		},
		function(){ 
			$(this).css({
				'borderColor':'#111',
				'background': '#000',
				cursor: 'auto'
			}); 
		}
	).css({
		width: options.width-30,
		height: '',
		padding: '2px',
		margin: '1px',
		border: '1px solid #111',
		'-moz-border-radius': '4px',
		clear: 'left',
		float: 'left'
	}).end()
	.find('a').css({
		color: '#aaa',
		textDecoration: 'none',
		float: 'left',
		width: '100%',
		outline: '0 none !important'
	}).end()
	.find('img').css({
		float: 'left',
		border: '1px solid #333',
		margin: '0 2px'
	}).end()
	.find('.themeName').css({
		float: 'left',
		margin: '3px 0'
	}).end();
	


	$(this).append(button);
	$('body').append(switcherpane);
	switcherpane.hide();
	if( $.cookie(options.cookieName) || options.loadTheme ){
		var themeName = $.cookie(options.cookieName) || options.loadTheme;
		switcherpane.find('a:contains('+ themeName +')').trigger('click');
	}

	return this;
};




/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};