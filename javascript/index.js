'use strict';

(function() {

	// web developer console signature
	console.log('%c Made with ❤︎️ by Studio MOTIO — https://www.studiomotio.com', 'background:#000;color:#fff;padding:0.5em 1em;line-height:2;');

	// defines some design constants
	const colors = {
		green: '#00ffd3',
		white: '#fff',
		yellow: '#f6cc00',
		blue: '#00c3f4',
		orange: '#ff8b26',
		magenta: '#ff2de3',
		red: '#f31250'
	};

	// linear easing path (1:1)
	const linearCurve = mojs.easing.path('M0, -100 C0, -100 100, 0 100, 0');

	// firework explosion blast
	let blast = new mojs.Shape({
		radius: { 0 : 'rand(100, 200)' },
		fill: 'transparent',
		stroke: colors.white,
		strokeWidth: { 10 : 0 },
		opacity: { 0.8 : 0 },
		duration: 700,
		isForce3d: true
	});

	// firework explosion sparks
	let sparks = new mojs.Burst({
		count: 'rand(20, 50)',
		radius: { 0 : 'rand(100, 200)' },
		degree: 400,
		children: {
			fill: [ colors.green, colors.white, colors.yellow ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 0 }
		},
		isForce3d: true
	});

	// firework explosion trails
	let trails = new mojs.Burst({
		count: 'rand(20, 30)',
		radius: { 0 : 'rand(150, 250)' },
		degree: 400,
		children: {
			shape: 'line',
			stroke: [ colors.green, colors.white, colors.yellow ],
			strokeWidth: { 3 : 1 },
			duration: 'rand(1500, 2500)',
			radius: { 5 : 'rand(50, 100)' }
		},
		isForce3d: true,
		onStart: function() {
			let audio = './audio/explosion-{sound}.mp3';

			let sounds = [
				'particles-long',
				'particles-short'
			];

			new Audio(audio.replace('{sound}', sounds[Math.floor(Math.random() * sounds.length)])).play();
		}
	});

	// firework particles
	let particle = mojs.stagger(mojs.Burst);
	let particles = new particle({
		quantifier: 20,
		count: 'rand(5, 10)',
		children: {
			fill: colors.white,
			opacity: { 0.8 : 0, curve: linearCurve },
			duration: 'rand(1000, 2000)',
			radius: { 1 : 0 },
			delay: 'rand(800, 1200)'
		},
		isForce3d: true
	});

	// trajectory of the projectile
	let rocket = new mojs.ShapeSwirl({
		shape: 'circle',
		fill: colors.white,
		x: 'rand(-400, 400)',
		y: { 200 : 'rand(-100, -300)' },
		radius: 2,
		swirlSize: 3,
		swirlFrequency: 10,
		degreeShift: 'rand(-45, 45)',
		direction: -1,
		scale: { 1 : 0, curve: linearCurve },
		duration: 1400,
		easing: mojs.easing.quad.out,
		isForce3d: true,
		onStart: function() {
			let explosion = trails._props.radius;
			let audio = './audio/rocket-{sound}.mp3';

			if (explosion < 180) {
				audio = audio.replace('{sound}', 'short');
			} else if (explosion >= 180 && explosion < 200) {
				audio = audio.replace('{sound}', 'medium');
			} else if (explosion >= 200) {
				audio = audio.replace('{sound}', 'long');
			}

			new Audio(audio).play();
		},
		onProgress: function(p) {

			if (Math.round(p*100) < 5) {
				return;
			}

			// smoke of the projectile
			new mojs.Shape({
				x: rocket._props.x,
				y: rocket._props.y,
				fill: colors.yellow,
				radius: { 1 : 0, curve: linearCurve },
				duration: 500,
				delay: 'stagger(10, 250)',
				isForce3d: true,
				onComplete: function() {
					this.el.parentNode.removeChild(this.el);
				}
			}).play();
		},
		onComplete: function() {
			let x = parseInt(rocket._props.x.replace('px', ''));
			let y = parseInt(rocket._props.y.replace('px', ''));
			let r = trails._props.radius;

			sparks.tune({
				x: x,
				y: y
			}).generate().replay();

			blast.tune({
				x: x,
				y: y
			}).generate().replay();

			trails.tune({
				x: x,
				y: y
			}).generate().replay();

			particles.tune({
				x: 'rand(' + (x-100) + ', ' + (x+100) + ')',
				y: 'rand(' + (y-100) + ', ' + (y+100) + ')',
				radius: 'stagger(rand(0, ' + r * 0.2 + '), 1)'
			}).play();

			setTimeout(function() {
				rocket.generate().play();
			}, Math.floor((Math.random() * 2200) + 1800));
		}
	});

	// defines the base shapes for "2018" word
	class Number2 extends mojs.CustomShape {
		getShape() {
			return '<path d="M34.16 17.58c3.94-4.03 9.4-6.05 16.4-6.05s12.44 1.85 16.3 5.55c3.87 3.7 5.8 8.89 5.8 15.55 0 5.65-1.22 10.7-3.67 15.11-2.44 4.42-5.95 9.1-10.5 14.01L44.47 76.73h28.88v10.6h-45.1v-9.8l21.5-23c4.27-4.53 7.17-8.2 8.7-11 1.54-2.8 2.3-6.26 2.3-10.4 0-3.4-.86-6.08-2.6-8.05-1.73-1.96-4.16-2.95-7.3-2.95-7.13 0-10.76 4.34-10.9 13l-11.9-.7c.14-7.2 2.17-12.81 6.1-16.85z"/>';
		}
	}

	class Number0 extends mojs.CustomShape {
		getShape() {
			return '<path d="M29.76 20.42c5-6.7 11.7-10.05 20.1-10.05 8.4 0 15.09 3.35 20.05 10.05 4.97 6.7 7.45 16.15 7.45 28.35 0 12.13-2.5 21.56-7.5 28.3-5 6.73-11.66 10.1-20 10.1-8.4 0-15.1-3.37-20.1-10.1-5-6.74-7.5-16.17-7.5-28.3 0-12.2 2.5-21.65 7.5-28.35zm20.1.55c-10.33 0-15.5 9.27-15.5 27.8s5.17 27.8 15.5 27.8c10.27 0 15.4-9.27 15.4-27.8 0-18.54-5.13-27.8-15.4-27.8z"/>';
		}
	}

	class Number1 extends mojs.CustomShape {
		getShape() {
			return '<path d="M60.56 87.33h-11.8v-59.1l-11.4 8.4-5.7-9.4 20.2-14.7h8.7v74.8z"/>';
		}
	}

	class Number8 extends mojs.CustomShape {
		getShape() {
			return '<path d="M33.46 16.03c4.34-3.66 9.9-5.5 16.7-5.5s12.39 1.84 16.75 5.5c4.37 3.67 6.55 8.67 6.55 15 0 7.14-3.06 12.34-9.2 15.6a19.7 19.7 0 0 1 8.1 7.2 20 20 0 0 1 3 11c0 6.87-2.35 12.34-7.05 16.4-4.7 4.07-10.71 6.1-18.05 6.1-7.33 0-13.35-2.03-18.05-6.1-4.7-4.06-7.05-9.53-7.05-16.4 0-4.2.99-7.85 2.95-10.95a19.48 19.48 0 0 1 8.05-7.15c-6.13-3.2-9.2-8.43-9.2-15.7 0-6.33 2.17-11.33 6.5-15zm16.7 36.3c-3.8 0-6.95 1.09-9.45 3.25-2.5 2.17-3.75 5.15-3.75 8.95 0 3.74 1.25 6.7 3.75 8.9s5.65 3.3 9.45 3.3c3.87 0 7.05-1.1 9.55-3.3 2.5-2.2 3.75-5.16 3.75-8.9 0-3.8-1.23-6.78-3.7-8.95-2.46-2.16-5.66-3.25-9.6-3.25zm8.3-28.4c-2.13-1.86-4.86-2.8-8.2-2.8-3.33 0-6.06.94-8.2 2.8-2.13 1.87-3.2 4.44-3.2 7.7 0 3.2 1.09 5.72 3.25 7.55 2.17 1.84 4.89 2.75 8.15 2.75 3.34 0 6.07-.91 8.2-2.75 2.14-1.83 3.2-4.35 3.2-7.55 0-3.26-1.06-5.83-3.2-7.7z"/>';
		}
	}

	// adds all custom shapes to the library
	mojs.addShape('number-2', Number2);
	mojs.addShape('number-0', Number0);
	mojs.addShape('number-1', Number1);
	mojs.addShape('number-8', Number8);

	// animates the "2018" word
	const number_options = {
		radius: { 0 : 50 },
		fill: colors.white,
		scaleX: { 10 : 1 },
		angle: { 'rand(-90, 90)' : 0 },
		opacity: { 0 : 1 },
		duration: 'rand(1000, 1400)',
		easing: mojs.easing.elastic.out,
		isForce3d: true
	};

	// trails for "2018" word
	const number_trails_options = {
		count: 'rand(5, 10)',
		radius: { 50 : 'rand(100, 200)' },
		children: {
			shape: 'line',
			stroke: [ colors.green, colors.white, colors.yellow ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 'rand(50, 100)' }
		},
		isForce3d: true,
		onStart: function() {
			new Audio('./audio/explosion-short.mp3').play();
		}
	};

	let number2 = new mojs.Shape(
		mojs.helpers.extend({
			x: -200,
			shape: 'number-2',
			delay: 'rand(100, 200)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: -200
					}, number_trails_options)
				).play();
			}
		}, number_options)
	);

	let number0 = new mojs.Shape(
		mojs.helpers.extend({
			x: -60,
			shape: 'number-0',
			delay: 'rand(200, 300)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: -60
					}, number_trails_options)
				).play();
			}
		}, number_options)
	);

	let number1 = new mojs.Shape(
		mojs.helpers.extend({
			shape: 'number-1',
			x: 70,
			delay: 'rand(300, 400)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: 70
					}, number_trails_options)
				).play();
			}
		}, number_options)
	).then({
		fill: colors.green,
		delay: 100,
		duration: 700
	});

	let number8 = new mojs.Shape(
		mojs.helpers.extend({
			x: 200,
			shape: 'number-8',
			delay: 'rand(400, 500)',
			onStart: function() {
				new mojs.Burst(
					mojs.helpers.extend({
						x: 200
					}, number_trails_options)
				).play();
			}
		}, number_options)
	).then({
		fill: colors.green,
		duration: 700
	});

	// information box sparks
	let boxsparks = new mojs.Burst({
		parent: '.info',
		left: 'rand(90%, 100%)',
		top: 'rand(0%, 10%)',
		count: 'rand(5, 10)',
		radius: { 0 : 'rand(50, 70)' },
		children: {
			fill: [ colors.green, colors.yellow ],
			duration: 'rand(1000, 1400)',
			radius: { 7 : 0 },
			delay: 'rand(0, 100)'
		}
	});

	// creates the timeline
	const timeline = new mojs.Timeline();

	// adds shapes to the timeline
	timeline.add(
		rocket,
		number2,
		number0,
		number1,
		number8
	);

	// creates the player
	new MojsPlayer({
		add: timeline,
		isSaveState: true,
		isPlaying: false,
		isRepeat: false,
		isHidden: false
	});

	// binds the DOMContentLoaded event of the document to preload the experiment
	document.addEventListener('DOMContentLoaded', function() {
		document.querySelector('body').classList.add('go');

		// plays the background music in loop
		let music = new Audio('audio/background-music.mp3');
		music.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);

		music.play();

		// plays the timeline
		setTimeout(function() {
			timeline.play();
		}, 5000);

		// allows user interaction
		setTimeout(function() {
			window.pipe = 0;

			document.addEventListener('click', function(e) {
				if (window.pipe > 4) {
					return;
				}

				new mojs.Shape({
					left: e.clientX,
					top: e.clientY,
					radius: { 0 : 'rand(100, 150)' },
					fill: 'transparent',
					stroke: colors.white,
					strokeWidth: { 10 : 0 },
					opacity: { 0.8 : 0 },
					duration: 700,
					isShowEnd: false,
					isForce3d: true,
					onComplete: function() {
						this.el.parentNode.removeChild(this.el);
					}
				}).play();

				let effect = [
					colors.green,
					colors.blue,
					colors.yellow,
					colors.orange,
					colors.magenta,
					colors.red
				];

				new mojs.Burst({
					left: e.clientX,
					top: e.clientY,
					count: 'rand(10, 15)',
					radius: { 0 : 'rand(100, 200)' },
					children: {
						shape: 'line',
						stroke: [ effect[Math.floor(Math.random() * effect.length)], colors.white ],
						duration: 'rand(1000, 1500)',
						radius: { 5 : 'rand(50, 100)' }
					},
					isShowEnd: false,
					isForce3d: true,
					onStart: function() {
						new Audio('./audio/explosion-short.mp3').play();
					},
					onComplete: function() {
						this.el.parentNode.removeChild(this.el);
						window.pipe--;
					}
				}).play();

				window.pipe++;
			});
		}, 7000);

		// allows the user to entire the fullscreen mode
		document.querySelector('[for="fullscreen"]').addEventListener('click', function() {
			if (!document.querySelector('#fullscreen').checked) {
				const element = document.querySelector('body');

				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		});

		// binds the fullscreenchange event to refresh the fullscreen command icon
		['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function(e) {
			window.addEventListener(e, function() {
				if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
					document.querySelector('#fullscreen').checked = false;
				}
			});
		});

		// allows the user to switch on/off the background music
		document.querySelector('[for="sound"]').addEventListener('click', function() {
			if (document.querySelector('#sound').checked) {
				music.pause();
			} else {
				music.play();
			}
		});

		// displays the information box
		document.querySelector('[for="info"]').addEventListener('click', function() {
			if (!document.querySelector('#info').checked) {
				boxsparks.generate().replay();

				new mojs.Html({
					el: '.info',
					scale: { 0.7 : 1 },
					opacity: { 0 : 1 },
					duration: 800,
					easing: mojs.easing.elastic.out
				}).play();
			} else {
				new mojs.Html({
					el: '.info',
					scale: { 1 : 0.8 },
					opacity: { 1 : 0 },
					duration: 500,
					easing: mojs.easing.expo.out
				}).play();
			}
		});
	});
})();