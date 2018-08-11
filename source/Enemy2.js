
(function (global) {

	const Enemy2 = function (data, scene, camera, player) {

		let states = Object.assign({}, data);

		this.player = player;

		let geometry = new THREE.TetrahedronGeometry(20);

		let material  = new THREE.MeshBasicMaterial({
			color: 0xaa0000,
			wireframe: true,
			wireframeLinewidth: 2
		});

		this.object = new THREE.Mesh(geometry, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);
		this.object.rotation.x += 0.07;
		this.object.rotation.y += 0.07;
		this.object.rotation.z -= 0.07;

		//let delta = this.player.object.position.clone().sub(this.object.position);
		//let distance = delta.lengthSq();
		//delta.normalize();

		//this.object.position.add(delta.multiplyScalar(Math.max(Math.min(distance / 15000, 5), 0.7)));
	};

	Enemy2.prototype = {

		follow: function () {
		},

		update: function () {
		}
	};

	global.Enemy2 = Enemy2;

})(typeof window !== 'undefined' ? window : this);
