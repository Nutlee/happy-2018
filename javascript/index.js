'use strict';

(function() {

	// defines some design constants
	const colors = {
		green: '#00ffd3',
		white: '#fff',
		yellow: '#f6cc00'
	};

	// linear easing path (1:1)
	const linearCurve = mojs.easing.path('M0, -100 C0, -100 100, 0 100, 0');

	// creates the timeline
	const timeline = new mojs.Timeline({
		speed: 1.0,
		delay: 0
	});

	// firework explosion sparks
	let sparks = new mojs.Burst({
		count: 'rand(20, 50)',
		radius: { 0 : 'rand(100, 200)' },
		children: {
			fill: [ colors.green, colors.white, colors.yellow ],
			duration: 'rand(1000, 2000)',
			radius: { 5 : 0 }
		},
		isForce3d: true
	});

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

	// firework explosion trails
	let trails = new mojs.Burst({
		count: 'rand(10, 20)',
		radius: { 0 : 'rand(150, 250)' },
		children: {
			shape: 'line',
			stroke: [ colors.green, colors.white, colors.yellow ],
			strokeWidth: { 3 : 1 },
			duration: 'rand(1500, 2500)',
			radius: { 5 : 50 }
		},
		isForce3d: true
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
	let path = new mojs.ShapeSwirl({
		shape: 'circle',
		fill: colors.white,
		y: { 200 : 'rand(-100, -300)' },
		radius: 2,
		swirlSize: 3,
		swirlFrequency: 10,
		degreeShift: 'rand(-45, 45)',
		direction: -1,
		scale: { 1 : 0, curve: linearCurve },
		duration: 1400,
		easing: 'quad.out',
		isForce3d: true,
		onProgress: function(p) {

			if (Math.round(p*100) % 2 == 0 || Math.round(p*100) < 5) {
				return;
			}

			// smoke of the projectile
			new mojs.Shape({
				x: path._props.x,
				y: path._props.y,
				fill: colors.yellow,
				radius: { 1 : 0, curve: linearCurve },
				duration: 500,
				delay: 'stagger(0, 250)',
				isForce3d: true,
				onComplete: function() {
					this.el.parentNode.removeChild(this.el);
				}
			}).play();
		},
		onComplete: function() {
			let x = parseInt(path._props.x.replace('px', ''));
			let y = parseInt(path._props.y.replace('px', ''));
			let r = trails._props.radius;

			sparks.tune({
				x: x,
				y: y
			}).play();

			blast.tune({
				x: x,
				y: y
			}).play();

			trails.tune({
				x: x,
				y: y
			}).play();

			particles.tune({
				x: 'rand(' + (x-100) + ', ' + (x+100) + ')',
				y: 'rand(' + (y-100) + ', ' + (y+100) + ')',
				radius: 'stagger(rand(0, ' + r * 0.2 + '), 1)'
			}).play();
		}
	});

	// adds shapes to the timeline
	timeline.add(
		path
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