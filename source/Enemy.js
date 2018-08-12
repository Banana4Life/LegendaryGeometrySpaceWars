(function (global) {

	const Enemy = function (scene, player, type) {

		this.scene = scene;
		this.player = player;
		if (!type) {
			type = Math.floor(Math.random() * 3);
		}
		this.type = type;
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
					this.object.position.x += 1.2 * this.direction;

					if (Math.abs(this.object.position.x) > 500) {
						this.direction = -this.direction;
					}
				};

				this.object.position.x = Math.random() * 1000 - 500;
				this.object.position.z = Math.random() * 1000 - 500;
				break;
			case 1:
				let material2 = new THREE.MeshBasicMaterial({
					color: 0x33ff00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry2 = new THREE.Geometry();
				geometry2.vertices.push(
					new THREE.Vector3(0, -10, 0),
					new THREE.Vector3(30, 0, 0),
					new THREE.Vector3(0, 10, 0)
				);
				geometry2.faces.push(new THREE.Face3(0, 1, 2));
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

				this.object.position.x = Math.random() * 1000 - 500;
				this.object.position.z = Math.random() * 1000 - 500;
				break;
			case 2:
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
					let distance = delta.lengthSq();
					delta.normalize();

					this.object.position.add(delta.multiplyScalar(Math.max(Math.min(distance / 15000, 5), 0.7)));

					if (Math.abs(this.object.position.z) > 500) {
						this.direction = -this.direction;
						this.object.rotateY(THREE.Math.degToRad(180));
					}
				};

				this.object.rotateY(THREE.Math.degToRad(-90));

				this.destroyType = () => {
					for (let i = 0; i < 5; i++) {
						let part = new Enemy(this.scene, this.player, 99)
						part.object.position.x = this.object.position.x + Math.random() * 10 - 5;
						part.object.position.y = this.object.position.y;
						part.object.position.z = this.object.position.z + Math.random() * 10 - 5;
						part.invincibleTime = 0.25;
					}
				};

				this.object.position.x = Math.random() * 1000 - 500;
				this.object.position.z = Math.random() * 1000 - 500;
				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(1000));

				break;

			case 99:
				let material4 = new THREE.MeshBasicMaterial({
					color: 0xaaaa00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry4 = new THREE.Geometry();
				geometry4.vertices.push(
					new THREE.Vector3(-5, -10, 0),
					new THREE.Vector3(10, 0, 0),
					new THREE.Vector3(-5, 10, 0)
				);
				geometry4.faces.push(new THREE.Face3(0, 1, 2));
				geometry4.computeBoundingBox();
				this.object = new THREE.Mesh(geometry4, material4);

				this.vDirection = new THREE.Vector3(Math.floor(Math.random() * 100 - 50), 0, Math.floor(Math.random() * 100 - 50)).normalize().multiplyScalar(2.5);

				this.movementType = () => {
					this.object.rotation.z += 0.07 * this.direction;
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;
					if (Math.abs(nPos.x) > 500) {

						this.vDirection.x = -this.vDirection.x;

					}
					if (Math.abs(nPos.z) > 500) {
						this.vDirection.z = -this.vDirection.z;
					}

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


		this.object.name = "Enemy" + type;

		this.direction = 1;

		scene.add(this.object);


		this.particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 5000
		});

		scene.add(this.particleSystem);

		this.psOptions = {
			position: new THREE.Vector3(),
			positionRandomness: 25,
			velocity: new THREE.Vector3(),
			velocityRandomness: .5,
			color: 0xffaaaa,
			colorRandomness: .10,
			turbulence: .5,
			lifetime: 1,
			size: 15,
			sizeRandomness: 1
		};

		this.tick = 0;

	};

	Enemy.prototype = {

		destroy: function () {

			if ((!this.death || this.death < 0) && !this.invincibleTime) {
				this.psOptions.position.x = this.object.position.x;
				this.psOptions.position.y = this.object.position.y;
				this.psOptions.position.z = this.object.position.z;

				for (let j = 0; j < 50; j++) {
					this.particleSystem.spawnParticle(this.psOptions);
				}
				this.particleSystem.update(this.tick)

				this.object.visible = false;
				this.death = 5;

				if (this.destroyType) {
					this.destroyType();
				}

			}

		},

		update: function (delta) {

			if (this.object.visible) {
				this.movementType();
			}

			this.death -= delta;
			this.invincibleTime -= delta;

			if (this.invincibleTime < 0) {
				this.invincibleTime = undefined;
			}

			if (this.death < 0) {
				this.death = undefined;

				if (this.type > 50) {
					this.scene.remove(this.object);
				} else {
					this.object.visible = true;
					this.object.position.x = Math.random() * 1000 - 500;
					this.object.position.z = Math.random() * 1000 - 500;

					if (this.type === 2) {
						this.object.position.add(this.object.position.clone().normalize().multiplyScalar(1000));
					}
				}

			}

			this.tick += delta;
			if (this.tick < 0) {
				this.tick = 0;
			}

			this.particleSystem.update(this.tick)


		},

		render: function () {
		},


	};

	global.Enemy = Enemy;


})(typeof window !== 'undefined' ? window : this);


