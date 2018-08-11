(function (global) {

	const Enemy = function (scene) {

		this.object = new THREE.Mesh(new THREE.PlaneGeometry(25, 25, 1, 1),
			new THREE.MeshBasicMaterial({
				color: 0x4400ff,
				wireframe: true,
				wireframeLinewidth: 2.5
			}));

		scene.add(this.object);
		this.object.rotateX(THREE.Math.degToRad(-90));

		this.object.userData = {entity: this}
		this.object.position.x = 20;

		this.direction = 1;
	};

	Enemy.prototype = {

		destroy: function () {
		},

		update: function () {
			this.object.rotation.y += 0.07 * this.direction;
			this.object.position.x += 0.4 * this.direction;

			if (Math.abs(this.object.position.x) > 500) {
				this.direction = -this.direction;
			}
		},

		render: function () {
		},


	};

	global.Enemy = Enemy;


})(typeof window !== 'undefined' ? window : this);


