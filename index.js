
(function(global) {

	const _CAMERA   = new THREE.PerspectiveCamera(45, global.innerWidth / global.innerHeight, 1, 10000);
	const _CONTROLS = new THREE.OrbitControls(_CAMERA);
	const _SCENE    = new THREE.Scene();
	const _RENDERER = new THREE.WebGLRenderer({
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


		let material = new THREE.MeshBasicMaterial({
			color: 0xffaa00,
			transparent:
			true,
			blending: THREE.AdditiveBlending
		});

		let object = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100, 4, 4), material);
		object.position.set(0, -75, 0);
		_STATIC_OBJECTS.plane = object;
		_SCENE.add(object);


		let ship = new Ship({}, _SCENE, _CAMERA);
		_SCENE.add(ship.object);
		_SCENE.add(_PLAYER.object);

		_CAMERA.position.x = 800;
		_CAMERA.position.y = 200;
		_CAMERA.add(point_light);
		_CAMERA.lookAt(_SCENE.position);

		_SCENE.add(new THREE.GridHelper(1000, 100));
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
		_init();
		_render_loop();
	})();


	global._CAMERA = _CAMERA;
	global._SCENE  = _SCENE;

})(typeof window !== 'undefined' ? window : this);

