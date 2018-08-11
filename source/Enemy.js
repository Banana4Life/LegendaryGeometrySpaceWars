(function (global) {

	const Enemy = function (scene, player) {

		this.player = player;
		let type = Math.floor(Math.random() * 3);
		switch (type) {
			case 0:
				let material1 = new THREE.MeshBasicMaterial({
					color: 0x4400ff,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry1 = new THREE.PlaneGeometry(25, 25, 1, 1);
				this.object = new THREE.Mesh(geometry1, material1);

				this.movementType = () => {
					this.object.rotation.y += 0.07 * this.direction;
					this.object.position.x += 0.4 * this.direction;

					if (Math.abs(this.object.position.x) > 500) {
						this.direction = -this.direction;
					}
				};

				break;
			case 1:
				let material2 = new THREE.MeshBasicMaterial({
					color: 0x33ff00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry2 = new THREE.Geometry();
				geometry2.vertices.push(
					new THREE.Vector3( 0,  -10, 0 ),
					new THREE.Vector3( 30, 0, 0 ),
					new THREE.Vector3(  0, 10, 0 )
				);
				geometry2.faces.push(new THREE.Face3(0,1,2));
				geometry2.computeBoundingBox();
				this.object = new THREE.Mesh(geometry2, material2);

				this.movementType = () => {
					this.object.rotation.y += 0.07 * this.direction;
					this.object.position.z += 1.5 * this.direction;

					if (Math.abs(this.object.position.z) > 500) {
						this.direction = -this.direction;
						this.object.rotateY(THREE.Math.degToRad(180));
					}
				};

				this.object.rotateY(THREE.Math.degToRad(-90));
				break;
			default:
				let material3 = new THREE.MeshBasicMaterial({
					color: 0xaaaa00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry3 = new THREE.CircleGeometry(25, 5);
				this.object = new THREE.Mesh(geometry3, material3);

				this.movementType = () => {
					this.object.rotation.z += 0.07 * this.direction;

					let delta = this.player.object.position.clone().sub(this.object.position);
					let distance = delta.lengthSq()
					delta.normalize();

					this.object.position.add(delta.multiplyScalar(Math.max(Math.min(distance / 15000, 5), 0.7)));

					if (Math.abs(this.object.position.z) > 500) {
						this.direction = -this.direction;
						this.object.rotateY(THREE.Math.degToRad(180));
					}
				};

				this.object.rotateY(THREE.Math.degToRad(-90));
				break;
		}


		this.object.rotateX(THREE.Math.degToRad(-90));

		this.object.userData = {entity: this}
		this.object.position.x = Math.random() * 1000 - 500;
		this.object.position.z = Math.random() * 1000 - 500;

		this.object.name = "Enemy" + type;

		this.direction = 1;

		scene.add(this.object);

	};

	Enemy.prototype = {

		destroy: function () {
		},

		update: function () {
			this.movementType();

		},

		render: function () {
		},


	};

	global.Enemy = Enemy;


})(typeof window !== 'undefined' ? window : this);


