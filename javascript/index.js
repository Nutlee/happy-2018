'use strict';

(function() {

	// defines some design constants
	const colors = {
		base: '#000',
		vibrant: '#00ffd3',
		contrast: '#fff',
		bright: '#5f5f5f',
		warning: '#f6cc00'
	};

	// linear easing path (1:1)
	const linearCurve = mojs.easing.path('M0, -100 C0, -100 100, 0 100, 0');

	// creates the timeline
	const timeline = new mojs.Timeline({
		speed: 1.0,
		delay: 0
	});

	// projectile particles
	let particle = mojs.stagger(mojs.Shape);
	let particles = new particle({
		quantifier: 2,
		x: 0,
		y: 0,
		radius: { 0.5 : 0, curve: linearCurve },
		fill: colors.contrast,
		opacity: 1,
		duration: 1000
	});

	// firework explosion sparks
	let sparks = new mojs.Burst({
		count: 'rand(20, 50)',
		radius: { 0 : 'rand(100, 200)' },
		children: {
			fill: [ colors.vibrant, colors.contrast, colors.warning ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 0 }
		}
	});

	// firework explosion blast
	let blast = new mojs.Shape({
		radius: { 0 : 'rand(100, 200)' },
		fill: 'transparent',
		stroke: colors.contrast,
		strokeWidth: { 10 : 0 },
		opacity: { 0.8 : 0 },
		duration: 700
	});

	// firework explosion trails
	let trails = new mojs.Burst({
		count: 'rand(10, 20)',
		radius: { 0 : 'rand(150, 250)' },
		children: {
			shape: 'line',
			stroke: [ colors.vibrant, colors.contrast, colors.warning ],
			strokeWidth: { 3 : 1 },
			duration: 'rand(1500, 2500)',
			delay: 100,
			radius: { 5 : 50 }
		}
	});

	// trajectory of the projectile
	let path = new mojs.ShapeSwirl({
		shape: 'circle',
		fill: colors.contrast,
		y: { 200 : 'rand(-100, -300)' },
		radius: 2,
		swirlSize: 3,
		swirlFrequency: 10,
		degreeShift: 'rand(-45, 45)',
		scale: { 1 : 0, curve: linearCurve },
		duration: 2000,
		easing: 'quad.out',
		isForce3d: true,
		onStart: function(isForward, isYoyo) {
			particles.tune({
				x: path._props.x,
				y: path._props.y
			});
		},
		onProgress: function(p, isForward, isYoyo) {
			let x = parseFloat(path._props.x.replace('px', ''));
			let y = parseFloat( path._props.y.replace('px', ''));
			let delta = 10;

			if (x == 0) {
				return;
			}

			particles.tune({
				x: 'rand(' + (x - delta / 2) + ', ' + (x + delta / 2) + ')',
				y: 'rand(' + y + ', ' + (y + delta * 2) + ')'
			});
		},
		onComplete: function() {
			sparks.tune({
				x: path._props.x,
				y: path._props.y
			}).play();

			blast.tune({
				x: path._props.x,
				y: path._props.y
			}).play();

			trails.tune({
				x: path._props.x,
				y: path._props.y
			}).play();
		}
	});

	// adds shapes to the timeline
	timeline.add(
		path,
		particles
	);

	// creates the player
	new MojsPlayer({
		add: timeline,
		isSaveState: true,
		isPlaying: false,
		isRepeat: false,
		isHidden: false
	});
})();