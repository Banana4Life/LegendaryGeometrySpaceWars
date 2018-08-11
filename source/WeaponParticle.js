(function (global) {

	const WeaponParticle = function (scene, wormhole) {

		this.wormhole = wormhole;
		let pMaterial = new THREE.PointsMaterial({
			color: 0x00FF00,
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
				let nPos = pos;
				let velocity = this.velocities[i];
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

		}


	};

	global.WeaponParticle = WeaponParticle;

})(typeof window !== 'undefined' ? window : this);
