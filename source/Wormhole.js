
(function(global) {

	const Wormhole = function(data, scene, camera, renderer) {

		let states = Object.assign({}, data);

		this.pos = new THREE.Vector3(states.position.x, states.position.y, states.position.z);

		let clock = new THREE.Clock();
		console.log('new Wormhole!', states);

		let material  = new THREE.MeshPhysicalMaterial({
			map: null,
			color: 0x000000,
			metalness: 1.0,
			roughness: 1,
			opacity: 0.95,
			transparent: true,
			envMapIntensity: 5,
			premultipliedAlpha: true
		});

		let geometryHole  = new THREE.SphereGeometry(50, 20, 20);
		let geometryWater = new THREE.SphereGeometry(49, 20, 20);

		let water = new THREE.Water(geometryWater, {
			color: 0x888888,
			scale: 4,
			flowDirection: new THREE.Vector2(1, 1),
			textureWidth: 2048,
			textureHeight: 2048
		});

		water.rotation.x = Math.PI * -0.5;
		water.rotation.y = Math.PI * -0.5;
		water.rotation.z = Math.PI * -0.5;

		this.object = new THREE.Mesh(geometryHole, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);

		scene.add(this.object);
		scene.add(water);

		water.position.set(states.position.x, states.position.y, states.position.z);

		let animate = function() {
			requestAnimationFrame(animate);
			render();
		};

		let render = function() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			document.body.appendChild(renderer.domElement);

			water.material.uniforms.time.value += clock.getDelta() * 2;
			renderer.render(scene, camera);
		};
	};



	Wormhole.prototype = {

		destroy: function() {
		},

		update: function() {
		},

		attract: function(point, velocity) {

			let dir = new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z).sub(point).normalize();
			let distance = this.pos.distanceToSquared(point);
			if (distance < 45 * 45) {
				velocity.x = 0;
				velocity.y = 0;
				velocity.z = 0;
			} else {
				distance /= 1000;
				velocity.x -= -dir.x / distance;
				velocity.y -= -dir.y / distance;
				velocity.z -= -dir.z / distance;
			}

		}
	};

	global.Wormhole = Wormhole;

})(typeof window !== 'undefined' ? window : this);
