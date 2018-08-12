(function (global) {

	const WeaponParticle = function (scene, wormhole, soundSource) {

		this.scene = scene;
		this.audioLoader = new THREE.AudioLoader();

		this.soundSource = soundSource;

		this.wormhole = wormhole;
		let pMaterial = new THREE.PointsMaterial({
			color: 0xFF0000,
			size: 70,
			map: new THREE.TextureLoader().load("images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			alphaTest: 0.5
		});

		this.geometry = new THREE.Geometry();
		let zero = new THREE.Vector3(0, 0, 0);
		for (let i = 0; i < 500; i++) {
			this.geometry.vertices.push(zero);
		}

		this.object = new THREE.Points(this.geometry, pMaterial);

		this.velocities = [];

		this.object.sortParticles = true;

		scene.add(this.object);

		this.object.userData = {entity: this}

		this.lastParticle = 0;
		this.speed = 5
		;

		this.particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 250000
		});

		scene.add(this.particleSystem);

		this.psOptions = {
			position: new THREE.Vector3(),
			positionRandomness: .3,
			velocity: new THREE.Vector3(),
			velocityRandomness: .5,
			color: 0xff0000,
			colorRandomness: .2,
			turbulence: .5,
			lifetime: 0.5,
			size: 35,
			sizeRandomness: 1
		};

		this.tick = 0;

	};

	WeaponParticle.prototype = {

		destroy: function () {
		},

		update: function (delta) {

			this.tick += delta;
			if (this.tick < 0) {
				this.tick = 0;
			}

			this.geometry.vertices.forEach((pos, i) => {

				let velocity = this.velocities[i];

				this.scene.children.forEach(c => {
					if (c.geometry && c.name.startsWith("Enemy")) {
						c.geometry.computeBoundingSphere();
						let bs = c.geometry.boundingSphere;
						let distanceSq = c.position.distanceToSquared(pos);
						if (distanceSq < bs.radius * bs.radius) {
							console.log("COLLIDE with weapon!");
							this.scene.remove(c);
							this.velocities[i] = null;
						}
					}
					if (velocity && c.position && c.name === "Particles") {
						c.geometry.vertices.forEach((pos2, i) => {
							let velocity2 = velocity.clone().normalize().multiplyScalar(30);
							let pos3 = pos2.clone().add(velocity2);
							let distanceSq = pos3.distanceToSquared(pos);
							if (distanceSq < 1500) {
								velocity2 = velocity.clone().multiplyScalar(0.8);
								let pVelocity = c.userData.entity.velocities[i];
								pVelocity.x = (velocity2.x + pVelocity.x * 10) / 11;
								pVelocity.y = (velocity2.y + pVelocity.y * 10) / 11;
								pVelocity.z = (velocity2.z + pVelocity.z * 10) / 11;
							}
						});

					}
				});

				let nPos = pos;
				if (velocity) {

					// TODO deltaTime
					this.wormhole.attract(nPos, velocity);

					nPos.x += velocity.x;
					nPos.y += velocity.y;
					nPos.z += velocity.z;

					this.geometry.vertices[i] = nPos;

					if (Math.abs(nPos.x) > 500) {
						this.psOptions.position.x = nPos.x;
						this.psOptions.position.y = nPos.y;
						this.psOptions.position.z = nPos.z;

						for (let j = 0; j < 50; j++) {
							this.particleSystem.spawnParticle(this.psOptions);
						}

						velocity.x = -velocity.x;
					}
					if (Math.abs(nPos.z) > 500) {

						this.psOptions.position.x = nPos.x;
						this.psOptions.position.y = nPos.y;
						this.psOptions.position.z = nPos.z;

						for (let j = 0; j < 50; j++) {
							this.particleSystem.spawnParticle(this.psOptions);
						}

						velocity.z = -velocity.z;
					}
					// TODO wormhole stuck

					this.velocities[i] = velocity;

				}



			});
			this.geometry.verticesNeedUpdate = true;


			this.particleSystem.update(this.tick)

		},

		render: function () {
		},

		fire: function (player, target) {
			// console.log("Fire!");
			this.lastParticle++;
			if (this.lastParticle > 500) {
				this.lastParticle = 0;
			}

			let playerPos = player.object.position;

			this.velocities[this.lastParticle] = new THREE.Vector3((target.x - playerPos.x), 0, (target.z - playerPos.z)).normalize().multiplyScalar(this.speed);

			this.object.geometry.vertices[this.lastParticle] = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
			this.object.geometry.verticesNeedUpdate = true;

			this.audioLoader.load( 'sounds/laser_middle.wav', (buffer) => {
				if (this.soundSource.isPlaying) {
					this.soundSource.stop();
				} else {

				}
				this.soundSource.setBuffer( buffer );
				this.soundSource.setLoop( false );
				this.soundSource.setVolume( 1 );
				this.soundSource.play();

			});

		}


	};

	global.WeaponParticle = WeaponParticle;

})(typeof window !== 'undefined' ? window : this);
