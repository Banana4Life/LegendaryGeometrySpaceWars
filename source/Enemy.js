(function (global) {

	const Enemy = function (scene, player, type) {

		this.scene = scene;
		this.player = player;
		if (!type) {
			type = Math.floor(Math.random() * 3);
		}
		this.type = type;
		switch (type) {
			case 0: {
				this.pointValue = 23;

				let material = new THREE.MeshBasicMaterial({
					color: 0x4400ff,
					wireframe: true,
					wireframeLinewidth: 2.5,
				});
				let geometry = new THREE.PlaneGeometry(25, 25, 1, 1);
				this.object = new THREE.Mesh(geometry, material);

				this.movementType = () => {
					this.object.rotation.y += 0.15 * this.direction;
					this.object.position.x += 2.5 * this.direction;

					if (Math.abs(this.object.position.x) > 500) {
						this.direction = -this.direction;
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

				this.object.position.x = Math.random() * 1000 - 500;
				this.object.position.z = Math.random() * 1000 - 500;

				if (this.player.object.position.distanceToSquared(this.object.position) < 1000) {
					this.object.position.add(this.player.object.position.clone().sub(this.object.position).normalize().multiplyScalar(100));
				}


				this.object.rotateX(THREE.Math.degToRad(-90));

			}

				break;
			case 1: {
				this.pointValue = 22;

				let material = new THREE.MeshBasicMaterial({
					color: 0x33ff00,
					wireframe: true,
					wireframeLinewidth: 2.5
				});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(
					new THREE.Vector3(0, -10, 0),
					new THREE.Vector3(30, 0, 0),
					new THREE.Vector3(0, 10, 0)
				);
				geometry.faces.push(new THREE.Face3(0, 1, 2));
				geometry.computeBoundingBox();
				this.object = new THREE.Mesh(geometry, material);

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

				if (this.player.object.position.distanceToSquared(this.object.position) < 1000) {
					this.object.position.add(this.player.object.position.clone().sub(this.object.position).normalize().multiplyScalar(100));
				}


				this.object.rotateX(THREE.Math.degToRad(-90));

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

					this.object.rotation.z += Math.max(0.2, Math.min(0.01, 5000000 / (distance * distance))) * this.direction;

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

				this.object.position.x = Math.random() * 1000 - 500;
				this.object.position.z = Math.random() * 1000 - 500;
				this.object.position.add(this.object.position.clone().normalize().multiplyScalar(1000));

				this.object.rotateX(THREE.Math.degToRad(-90));
			}
				break;
			case 100: {

				this.pointValue = 24;

				let material = new THREE.MeshBasicMaterial({
					color: 0x4400ff,
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
					// this.object.rotation.x += 0.07 * this.direction;
					this.object.position.add(this.vDirection);

					let nPos = this.object.position;
					if (Math.abs(nPos.x) > 500) {
						this.vDirection.x = -this.vDirection.x;
						this.object.lookAt(this.object.position.clone().add(this.vDirection));
					}
					if (Math.abs(nPos.z) > 500) {
						this.vDirection.z = -this.vDirection.z;
						this.object.lookAt(this.object.position.clone().add(this.vDirection));
					}
				};

			}
				break;

			case 102: {
				this.pointValue = 13;

				let material = new THREE.MeshBasicMaterial({
					color: 0xaaaa00,
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

				this.object.rotateX(THREE.Math.degToRad(-90));
			}
				break;
		}

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
			color: 0xff11ff,
			colorRandomness: 20,
			turbulence: 2,
			lifetime: 2,
			size: 25,
			sizeRandomness: 1
		};

		this.tick = 0;

	};

	Enemy.prototype = {

		destroy: function (by) {

			if ((!this.death || this.death < 0) && !this.invincibleTime) {
				this.psOptions.position.x = this.object.position.x;
				this.psOptions.position.y = 5;
				this.psOptions.position.z = this.object.position.z;

				for (let j = 0; j < 50; j++) {
					this.particleSystem.spawnParticle(this.psOptions);
				}
				this.particleSystem.update(this.tick)

				this.object.visible = false;
				this.death = 5;

				if (by.scoreboard) {
					by.scoreboard.points += this.pointValue;
					by.scoreboard.pointsChanged = true;
				}

				console.log(by.object.name);
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
					this.object.position.x = Math.random() * 1000 - 500;
					this.object.position.z = Math.random() * 1000 - 500;

					if (this.type === 2) {
						this.object.position.add(this.object.position.clone().normalize().multiplyScalar(1000));
					}
				}

			}

			this.particleSystem.update(tick)


		},

		render: function () {
		},


	};

	global.Enemy = Enemy;


})(typeof window !== 'undefined' ? window : this);
