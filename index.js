
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
	const _STATIC_OBJECTS  = {};
	const _DYNAMIC_OBJECTS = [];

	let _LAST_UPDATE = Date.now();
	let _TICK = 0;
	let _NEXTSPAWN = 5;

	/*
	 * INITIALIZATION
	 */

	const _init = _ => {

		_RENDERER.setPixelRatio(global.devicePixelRatio);
		_RENDERER.setSize(global.innerWidth, global.innerHeight);

		global.document.body.appendChild(_RENDERER.domElement);

		let background = new THREE.CubeTextureLoader()
			.setPath('textures/spacespace/')
			.load([ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]);
		background.format = THREE.RGBFormat;

		let smallBackground = new THREE.CubeTextureLoader()
			.setPath('textures/MilkyWay/')
			.load([ 'dark-s_px.jpg', 'dark-s_nx.jpg', 'dark-s_py.jpg', 'dark-s_ny.jpg', 'dark-s_pz.jpg', 'dark-s_nz.jpg' ]);
		background.format = THREE.RGBFormat;

		if (window.devicePixelRatio < 2 || window.devicePixelRatio < 2) {
			_SCENE.background = background;
		} else {
			_SCENE.background = smallBackground;
		}

		let ambient_light = new THREE.AmbientLight(0xcccccc, 0.4);
		let point_light   = new THREE.PointLight(0xffffff, 0.8);



		let plane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000, 8, 8),
			new THREE.MeshBasicMaterial({
				color: 0x248f24, alphaTest: 0, visible: false
			}));
		plane.name = 'Plane';
		plane.rotateX(THREE.Math.degToRad(-90));
		_SCENE.add(plane);

		_CAMERA.position.x = 800;
		_CAMERA.position.y = 1000;
		_CAMERA.add(point_light);
		_CAMERA.lookAt(_SCENE.position);

		_SCENE.add(ambient_light);
		_SCENE.add(_CAMERA);

		_STATIC_OBJECTS.scoreboard = new Scoreboard({
			position: {
				x: -500,
				y: 0,
				z: 0
			}
		}, _SCENE);

		let wormhole = new Wormhole({
			position: {
				x: -150,
				y: 0,
				z: -150
			}
		}, _SCENE, _CAMERA, _RENDERER);

		_STATIC_OBJECTS.player = new Player(_SCENE, _CAMERA, _STATIC_OBJECTS.plane, wormhole, _STATIC_OBJECTS.scoreboard);

		_STATIC_OBJECTS.grid = new Grid({
			size: 1000,
			divisions: 100
		}, _SCENE, _CAMERA, _STATIC_OBJECTS.player);

		new Particles(_SCENE, wormhole);

		for (let i = 0; i < 4; i++) {

			new Enemy(_SCENE, _STATIC_OBJECTS.player);
		}
		new Enemy(_SCENE, _STATIC_OBJECTS.player, 3);

	};



	const _render_loop = _ => {

		global.render();
		global.requestAnimationFrame(_render_loop);

		let now = Date.now();
		let delta = (now - _LAST_UPDATE) / 1000;
		_LAST_UPDATE = now;

		_TICK += delta;
		if (_TICK < 0) {
			_TICK = 0;
		}



		if (_STATIC_OBJECTS.scoreboard.lives > 0) {
			if (_TICK > _NEXTSPAWN) {
				_NEXTSPAWN += 20;
				new Enemy(_SCENE, _STATIC_OBJECTS.player);
			}

			document.body.className = "running";
			_CONTROLS.enabled = false;
			_SCENE.children.forEach(object => {
				if (object && object.userData.entity) {
					object.userData.entity.update(delta, _TICK);
				}
			});
		} else {
			document.body.className = "";
			_CONTROLS.enabled = true;
		}

	};

	global.render = _ => {

		_CONTROLS.update();

		// _CAMERA.position.x = Math.cos(timer) * 800;
		// _CAMERA.position.y = Math.sin(timer) * 800;

		_SCENE.children.forEach(object => {
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

		// setTimeout(_ => {
		// 	_GAME_BEAT.play();
		// }, 1000);

		_init();
		_render_loop();

	})();


	global._CAMERA         = _CAMERA;
	global._SCENE          = _SCENE;
	global._STATIC_OBJECTS = _STATIC_OBJECTS;

})(typeof window !== 'undefined' ? window : this);
