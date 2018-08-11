
(function(global) {

	const _CAMERA   = new THREE.PerspectiveCamera(45, global.innerWidth / global.innerHeight, 1, 10000);
	const _SCENE    = new THREE.Scene();
	const _RENDERER = new THREE.WebGLRenderer({
		antialias: true
	});
	const _CONTROLS = new THREE.OrbitControls(_CAMERA, _RENDERER.domElement);
	const _STATIC_OBJECTS  = {};
	const _DYNAMIC_OBJECTS = [];

	/*
	 * INITIALIZATION
	 */

	const _init = _ => {


		_RENDERER.setPixelRatio(global.devicePixelRatio);
		_RENDERER.setSize(global.innerWidth, global.innerHeight);

		global.document.body.appendChild(_RENDERER.domElement);


		let ambient_light = new THREE.AmbientLight(0xcccccc, 0.4);
		let point_light   = new THREE.PointLight(0xffffff, 0.8);


		let material = new THREE.MeshBasicMaterial({
			color: 0xffaa00,
			transparent:
			true,
			blending: THREE.AdditiveBlending
		});



		let ship = new Ship({}, _SCENE, _CAMERA);
		_SCENE.add(ship.object);

		let axesHelper = new THREE.AxesHelper(250);
		axesHelper.position.y = 0.1;
		_SCENE.add(axesHelper);

		_CAMERA.position.x = 800;
		_CAMERA.position.y = 200;
		_CAMERA.add(point_light);
		_CAMERA.lookAt(_SCENE.position);

		let plane = new THREE.GridHelper(1000, 100);
		plane.name = "Plane";
		_SCENE.add(plane);
		_SCENE.add(ambient_light);
		_SCENE.add(_CAMERA);

		let wormhole = new Wormhole({
			position: {
				x: -150,
				y: 0,
				z: -150
			}
		}, _SCENE, _CAMERA, _RENDERER);

		new Particles(_SCENE, wormhole);

		new Player(_SCENE, _CAMERA, _STATIC_OBJECTS.plane, wormhole);

	};


	const _render_loop = _ => {
		global.render();
		global.requestAnimationFrame(_render_loop);

		_SCENE.traverse(object => {

			if (object.userData.entity) {
				object.userData.entity.update();
			}
		});

	};

	global.render = _ => {

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
