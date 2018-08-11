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

	};

	WeaponParticle.prototype = {

		destroy: function () {
		},

		update: function () {
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
						}
					}
					if (velocity && c.position && c.name === "Particles") {
						c.geometry.vertices.forEach((pos2, i) => {
							let distanceSq = pos2.distanceToSquared(pos);
							let pVelocity = velocity.clone().multiplyScalar(0.05);
							if (distanceSq < 2000) {
								c.userData.entity.velocities[i].add(pVelocity);
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
					this.velocities[i] = velocity;
				}

			});
			this.geometry.verticesNeedUpdate = true;



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
