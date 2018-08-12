
(function(global) {

	const Wormhole = function(data, scene, camera, renderer) {

		let states = Object.assign({}, data);

		this.pos = new THREE.Vector3(states.position.x, states.position.y, states.position.z);

		let material  = new THREE.MeshPhysicalMaterial({
			map: null,
			color: 0x000000,
			metalness: 1.0,
			roughness: 1,
			opacity: 1,
			transparent: true,
			envMapIntensity: 5,
			premultipliedAlpha: true
		});

		let geometryHole  = new THREE.SphereGeometry(40, 20, 20);
		let geometryWater = new THREE.SphereGeometry(60, 20, 20);

		let water = new THREE.Water(geometryWater, {
			color: 0x888888,
			scale: 2,
			flowDirection: new THREE.Vector2(1, 1),
			textureWidth: 1024,
			textureHeight: 1024
		});

		this.object = new THREE.Mesh(geometryHole, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);

		scene.add(this.object);
		scene.add(water);

		water.position.set(states.position.x, states.position.y, states.position.z);
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
