
(function(global) {

	const _CAMERA    = new THREE.PerspectiveCamera(45, global.innerWidth / global.innerHeight, 1, 10000);
	const _CONTROLS  = new THREE.OrbitControls(_CAMERA);
	const _GAME_BEAT = new Beat({
		url: './asset/street-dancing.mp3'
	});
	let _GAME_START  = Date.now();
	const _SCENE     = new THREE.Scene();
	const _RENDERER  = new THREE.WebGLRenderer({
		antialias: true
	});

	const _PLAYER = new Player();

	const _STATIC_OBJECTS  = {};
	const _DYNAMIC_OBJECTS = [];



	/*
	 * INITIALIZATION
	 */

	const _init = _ => {

		_RENDERER.setPixelRatio(global.devicePixelRatio);
		_RENDERER.setSize(global.innerWidth, global.innerHeight);

		global.document.body.appendChild(_RENDERER.domElement);


		let ambient_light = new THREE.AmbientLight(0xffffff, 0.4);
		let point_light   = new THREE.PointLight(0xffffff, 0.8);


		let grid = new Grid({
			size: 1000,
			divisions: 200
		}, _SCENE, _CAMERA);

		_STATIC_OBJECTS.grid = grid;
		_SCENE.add(grid.object);

		let ship = new Ship({}, _SCENE, _CAMERA);
		_STATIC_OBJECTS.ship = ship;
		_SCENE.add(ship.object);
		_SCENE.add(_PLAYER.object);

		_CAMERA.position.x = 800;
		_CAMERA.position.y = 200;
		_CAMERA.add(point_light);
		_CAMERA.lookAt(_SCENE.position);

		// _SCENE.add(new THREE.GridHelper(1000, 100));
		_SCENE.add(ambient_light);
		_SCENE.add(_CAMERA);

	};



	const _render_loop = _ => {

		global.render();
		_PLAYER.update();

		global.requestAnimationFrame(_render_loop);

	};

	global.render = _ => {


		_CONTROLS.update();
		_STATIC_OBJECTS.grid.update();

		// _CAMERA.position.x = Math.cos(timer) * 800;
		// _CAMERA.position.y = Math.sin(timer) * 800;

		_SCENE.traverse(object => {
			// if (object.isMesh === true) {
			// 	object.rotation.x = timer * 5;
			// 	object.rotation.y = timer * 2.5;
			// }
		});

		_RENDERER.render(_SCENE, _CAMERA);

	};



	/*
	 * EVENTS
	 */

	global.document.addEventListener('resize', _ => {

		_CAMERA.aspect = global.innerWidth / global.innerHeight;
		_CAMERA.updateProjectionMatrix();

		_RENDERER.setSize(global.innerWidth, global.innerHeight);

	}, false);


	(function() {

		_GAME_START = Date.now();

		setTimeout(_ => {
			_GAME_BEAT.play();
		}, 1000);

		_init();
		_render_loop();

	})();


	global._CAMERA = _CAMERA;
	global._SCENE  = _SCENE;

})(typeof window !== 'undefined' ? window : this);

