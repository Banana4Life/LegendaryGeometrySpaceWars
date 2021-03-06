(function (global) {

	const Enemy = function (scene, player, type) {

		this.audioLoader = new THREE.AudioLoader();
		this.soundSource = new THREE.Audio(player.listener);

		this.scene = scene;
		this.player = player;
		if (typeof type === "undefined") {
			type = Math.floor(Math.random() * 3);
		}
		this.type = type;
		switch (type) {
			case 0: {
				this.pointValue = 23;

				this.desirePos = Math.random() * this.scene.grid.allowedRadius();

				let material = new THREE.MeshBasicMaterial({
					color: 0x4400ff,
					wireframe: true,
					wireframeLinewidth: 2.5,
				});
				let geometry = new THREE.PlaneGeometry(25, 25, 1, 1);
				this.object = new THREE.Mesh(geometry, material);

				this.vDirection = new THREE.Vector3(2.5,0,0);

				this.movementType = () => {

					this.object.rotation.y += 0.15;
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;

					if (Math.abs(nPos.x) > this.scene.grid.allowedRadius()) {
						let oldDir = this.vDirection.x;
						this.vDirection.x = Math.abs(this.vDirection.x) * -Math.sign(nPos.x);;
						if (oldDir !== this.vDirection.x) {
							this.object.lookAt(nPos.clone().add(this.vDirection));
							this.object.rotateX(THREE.Math.degToRad(-90));
						}
					}

					if (Math.abs(nPos.z) > this.desirePos) {
						nPos.z += -Math.sign(nPos.z) * 3;
					}

				};

				this.destroyType = () => {
					let part1 = new Enemy(this.scene, this.player, 100);
					let part2 = new Enemy(this.scene, this.player, 100);
					part1.object.position.x = this.object.position.x + Math.random() * 20 - 10;
					part1.object.position.y = this.object.position.y;
					part1.object.position.z = this.object.position.z + Math.random() * 20 - 10;
					part1.invincibleTime = 0.25;
					part2.object.position.x = this.object.position.x + Math.random() * 20 - 10;
					part2.object.position.y = this.object.position.y;
					part2.object.position.z = this.object.position.z + Math.random() * 20 - 10;
					part2.invincibleTime = 0.25;

					part1.vDirection = new THREE.Vector3(1, 0, 1).normalize().multiplyScalar(4);
					part2.vDirection = new THREE.Vector3(1, 0, 1).normalize().multiplyScalar(-4);

					part2.object.lookAt(part2.object.position.clone().sub(part1.vDirection));
					part1.object.lookAt(part1.object.position.clone().sub(part2.vDirection));

				};

				this.object.position.x = this.scene.grid.randomPos();
				this.object.position.z = this.scene.grid.randomPos();

				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(this.scene.grid.allowedRadius() / 1.5));


				this.object.rotateX(THREE.Math.degToRad(-90));

			}

				break;
			case 1: {
				this.pointValue = 22;

				this.desirePos = Math.random() * this.scene.grid.allowedRadius();

				let material = new THREE.MeshBasicMaterial({
					color: 0x33ff00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(
					new THREE.Vector3(0, 0, 30),
					new THREE.Vector3(-10, 0, 0),
					new THREE.Vector3(10, 0, 0)
				);
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				this.object = new THREE.Mesh(geometry, material);

				this.vDirection = new THREE.Vector3(0,0,2);

				this.movementType = () => {

					this.object.rotation.z += 0.07 * Math.sign(this.vDirection.z);
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;

					if (Math.abs(nPos.x) > this.desirePos) {
						nPos.x += -Math.sign(nPos.x) * 3;
					}

					if (Math.abs(nPos.z) > this.scene.grid.allowedRadius()) {

						let oldDir = this.vDirection.z;
						this.vDirection.z = Math.abs(this.vDirection.z) * -Math.sign(nPos.z);
						if (oldDir !== this.vDirection.z) {
							this.object.lookAt(nPos.clone().add(this.vDirection));
						}
					}


				};

				this.object.position.x = this.scene.grid.randomPos();
				this.object.position.z = this.scene.grid.randomPos();
				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(this.scene.grid.allowedRadius() / 1.5));


			}
				break;
			case 2: {

				this.pointValue = 31;

				let material = new THREE.MeshBasicMaterial({
					color: 0xaaaa00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.CircleGeometry(25, 5);
				this.object = new THREE.Mesh(geometry, material);

				this.movementType = () => {

					let delta = this.player.object.position.clone().sub(this.object.position);
					let distance = delta.lengthSq();
					delta.normalize();

					this.object.rotation.z += Math.max(0.2, Math.min(0.01, 5000000 / (distance * distance)));

					this.object.position.add(delta.multiplyScalar(Math.max(Math.min(distance / 15000, 5), 0.7)));
				};

				this.object.rotateY(THREE.Math.degToRad(-90));

				this.destroyType = () => {
					for (let i = 0; i < 5; i++) {
						let part = new Enemy(this.scene, this.player, 102);
						part.object.position.x = this.object.position.x + Math.random() * 10 - 5;
						part.object.position.y = this.object.position.y;
						part.object.position.z = this.object.position.z + Math.random() * 10 - 5;
						part.invincibleTime = 0.25;
					}
				};

				this.object.position.x = this.scene.grid.randomPos();
				this.object.position.z = this.scene.grid.randomPos();
				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(this.scene.grid.allowedRadius() / 1.5));

				this.object.rotateX(THREE.Math.degToRad(-90));
			}
				break;
			case 3: {
				this.pointValue = 111;

				let material = new THREE.MeshBasicMaterial({
					color: 0xff0022,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(
					// Square
					new THREE.Vector3(-10, 0, -10),
					new THREE.Vector3(-10, 0,  10),
					new THREE.Vector3( 10, 0,  10),
					new THREE.Vector3( 10, 0, -10),
					// Triangle Front
					new THREE.Vector3(  0, 0, 40),
					// Triangle Left
					new THREE.Vector3(-10, 0, 0),
					new THREE.Vector3(-10, 0, -20),
					new THREE.Vector3(-30, 0, -20),
					// Triangle Right
					new THREE.Vector3(10, 0, 0),
					new THREE.Vector3(10, 0, -20),
					new THREE.Vector3(30, 0, -20),
				);
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				geometry.faces.push(new THREE.Face3(0, 2, 3));

				geometry.faces.push(new THREE.Face3(1, 2, 4));

				geometry.faces.push(new THREE.Face3(5, 6, 7));
				geometry.faces.push(new THREE.Face3(8, 9, 10));
				this.object = new THREE.Mesh(geometry, material);

				this.movementType = () => {
					let delta = this.player.object.position.clone().sub(this.object.position);
					delta.normalize();

					this.object.lookAt(this.player.object.position);

					this.object.position.add(delta.multiplyScalar(3));
				};

				this.destroyType = () => {
					let part = new Enemy(this.scene, this.player, 0);
					part.object.position.x = this.object.position.x + Math.random() * 10 - 5;
					part.object.position.y = this.object.position.y;
					part.object.position.z = this.object.position.z + Math.random() * 10 - 5;
					part.invincibleTime = 0.25;
					let part2 = new Enemy(this.scene, this.player, 1);
					part2.object.position.x = this.object.position.x + Math.random() * 10 - 5;
					part2.object.position.y = this.object.position.y;
					part2.object.position.z = this.object.position.z + Math.random() * 10 - 5;
					part2.invincibleTime = 0.25;

 					part.destroyType();
				};



				this.object.position.x = this.scene.grid.randomPos();
				this.object.position.z = this.scene.grid.randomPos();

				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(this.scene.grid.allowedRadius() / 1.5));

			}
				break;
			case 100: {

				this.pointValue = 24;

				let material = new THREE.MeshBasicMaterial({
					color: 0x2200dd,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(
					new THREE.Vector3(-15, 0, -10),
					new THREE.Vector3(0, 0, 5),
					new THREE.Vector3(15, 0, -10)
				);
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				geometry.computeBoundingBox();
				this.object = new THREE.Mesh(geometry, material);

				this.vDirection = new THREE.Vector3();

				this.movementType = () => {
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;
					if (Math.abs(nPos.x) > this.scene.grid.allowedRadius()) {
						this.vDirection.x = Math.abs(this.vDirection.x) * -Math.sign(nPos.x);
						this.object.lookAt(nPos.clone().add(this.vDirection));
					}
					if (Math.abs(nPos.z) > this.scene.grid.allowedRadius()) {
						this.vDirection.z = Math.abs(this.vDirection.z) * -Math.sign(nPos.z);
						this.object.lookAt(nPos.clone().add(this.vDirection));
					}

				};

			}
				break;

			case 102: {
				this.pointValue = 13;

				let material = new THREE.MeshBasicMaterial({
					color: 0x999900,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(
					new THREE.Vector3(-5, -10, 0),
					new THREE.Vector3(10, 0, 0),
					new THREE.Vector3(-5, 10, 0)
				);
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				geometry.computeBoundingBox();
				this.object = new THREE.Mesh(geometry, material);

				this.vDirection = new THREE.Vector3(Math.floor(Math.random() * 100 - 50), 0, Math.floor(Math.random() * 100 - 50)).normalize().multiplyScalar(5);

				this.movementType = () => {


					this.object.rotation.z += 0.07;
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;


					if (Math.abs(nPos.x) > this.scene.grid.allowedRadius()) {
						this.vDirection.x = Math.abs(this.vDirection.x) * -Math.sign(nPos.x);
					}
					if (Math.abs(nPos.z) > this.scene.grid.allowedRadius()) {
						this.vDirection.z = Math.abs(this.vDirection.z) * -Math.sign(nPos.z);
					}

				};

				this.object.rotateY(THREE.Math.degToRad(-90));

				this.object.rotateX(THREE.Math.degToRad(-90));
			}
				break;
		}

		this.object.userData = {entity: this}


		this.object.name = "Enemy" + type;

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
			color: 0xff11ff,
			colorRandomness: 20,
			turbulence: 2,
			lifetime: 2,
			size: 25,
			sizeRandomness: 1
		};

	};

	Enemy.prototype = {

		destroy: function (by) {

			if ((!this.death || this.death < 0) && !this.invincibleTime) {


				this.scene.grid.rip({
					x: this.object.position.x,
					y: 0,
					z: this.object.position.z
				});


				this.psOptions.position.x = this.object.position.x;
				this.psOptions.position.y = 5;
				this.psOptions.position.z = this.object.position.z;

				for (let j = 0; j < 50; j++) {
					this.particleSystem.spawnParticle(this.psOptions);
				}
				this.particleSystem.update(this.tick)

				this.object.visible = false;
				this.death = 3;

				if (by.award) {
					by.award(this.pointValue);

					this.audioLoader.load('sounds/explosion1_2.wav', (buffer) => {
						if (this.soundSource.isPlaying) {
							this.soundSource.stop();
						} else {

						}
						this.soundSource.setBuffer(buffer);
						this.soundSource.setLoop(false);
						this.soundSource.setVolume(0.7);
						this.soundSource.play();

					});

				}

				if (by.object.name !== "Player") {
					if (this.destroyType) {
						this.destroyType();
					}
				}

			}

		},

		dealDamage: function (to) {
			if (this.object.visible) {
				if (to.destroy) {
					to.destroy(this);
				}
			}
		},

		update: function (delta, tick) {

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
					this.object.position.x = this.scene.grid.randomPos();
					this.object.position.z = this.scene.grid.randomPos();

					this.object.position.add(this.object.position.clone().normalize().multiplyScalar(this.scene.grid.allowedRadius() / 1.5));
				}

			}

			this.particleSystem.update(tick)


		},

		render: function () {
		},


	};

	global.Enemy = Enemy;


})(typeof window !== 'undefined' ? window : this);
