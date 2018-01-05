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
		delay: 200,
		easing: 'quad.out',
		isForce3d: true
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