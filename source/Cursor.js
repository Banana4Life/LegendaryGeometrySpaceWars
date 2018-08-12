(function (global) {

	const Cursor = function (scene) {

		let material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true,
			wireframeLinewidth: 2.5
		});

		let geometry = new THREE.CircleGeometry(15, 3);

		this.object = new THREE.Mesh(geometry, material);
		this.object.name = "Cursor";
		this.object.userData = {entity: this};

		scene.add(this.object);

		this.position = new THREE.Vector3();

		this.object.rotateX(THREE.Math.degToRad(90))

	};

	Cursor.prototype = {

		pointAt: function (position) {
			this.position = position;
		},

		update: function () {
			this.object.position.x = this.position.x;
			this.object.position.dy = 0;
			this.object.position.z = this.position.z;
		}


	};

	global.Cursor = Cursor;


})(typeof window !== 'undefined' ? window : this);
