
(function(global) {

	const Wormhole = function(data, scene, camera, renderer) {

		let states = Object.assign({}, data);
		let clock = new THREE.Clock();
		console.log('new Wormhole!', states);
		let wormholeGroup = new THREE.Group();

		let material  = new THREE.MeshPhysicalMaterial({
			map: null,
			color: 0x0000ff,
			metalness: 0.0,
			roughness: 0,
			opacity: 0.15,
			side: THREE.FrontSide,
			transwormholeGroup: true,
			envMapIntensity: 5,
			premultipliedAlpha: true
		});

		let geometry  = new THREE.SphereGeometry(100, 50, 25);

		let refractor = new THREE.Refractor(geometry, {
			color: 0x999999,
			textureWidth: 1024,
			textureHeight: 1024,
			shader: THREE.WaterRefractionShader
		});

		refractor.position.set(states.position.x, states.position.y, states.position.z);

		let dudvMap = new THREE.TextureLoader().load('source/Wormhole.jpg', function () {
			animate();
		});

		dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
		refractor.material.uniforms.tDudv.value = dudvMap;

		this.object = new THREE.Mesh(geometry, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);
		this.object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material = material;
				let second = child.clone();
				second.material = material;
				wormholeGroup.add(second);
				wormholeGroup.add(child);
				scene.add(wormholeGroup);
			}
		});
		scene.add(this.object);
		//scene.add(refractor);

		this.object.userData = { entity:this };

		let animate = function() {
			requestAnimationFrame(animate);
			render();
		};

		let render = function() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setClearColor(0x20252f);
			renderer.setPixelRatio(window.devicePixelRatio);
			document.body.appendChild(renderer.domElement);

			this.refractor.material.uniforms.time.value += clock.getDelta();
			renderer.render(scene, camera);
		};
	};



	Wormhole.prototype = {

		destroy: function() {
		},

		update: function() {
		}
	};


	global.Wormhole = Wormhole;

})(typeof window !== 'undefined' ? window : this);
