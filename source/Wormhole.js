
(function(global) {

	const Wormhole = function(data, scene) {

		let states = Object.assign({}, data);


		console.log('new Wormhole!', states);


		let material  = new THREE.MeshStandardMaterial({
			color: 0x6083c2
		});
		let geometry  = new THREE.SphereBufferGeometry(100, 20, 10, material);
		let refractor = new THREE.Refractor(geometry, {
			color: 0x999999,
			textureWidth: 1024,
			textureHeight: 1024,
			shader: THREE.WaterRefractionShader
		});

		refractor.position.set(states.position.x, states.position.y, states.position.z);

		this.object = new THREE.Mesh(geometry, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);


		scene.add(refractor);
		scene.add(this.object);

	};


	Wormhole.prototype = {

		destroy: function() {
		},

		update: function() {
		},

		render: function() {
		}

	};


	global.Wormhole = Wormhole;

})(typeof window !== 'undefined' ? window : this);

