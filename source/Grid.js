
(function(global) {

	const Grid = function(data, scene, camera, player) {

		let states = Object.assign({}, data);

		scene.grid = this;

		this.deathRing = 1;
		this.deathTimer = 60;
		this.deathTimerMax = 30;
		this.ripples = [];
		this.velocities = [];

		this.updateDeath = true;


		this._scene = scene;

		this.divisions = states.divisions || 100;
		this.size      = states.size || 1000;

		this.mapRadius = this.size / 2;

		this.player = player || null;

		let pMaterial = new THREE.PointsMaterial({
			vertexColors: THREE.VertexColors,
			size: 70,
			map: new THREE.TextureLoader().load("images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			alphaTest: 0.5
		});

		this._distance = new THREE.Vector3(0, 0, 0);

		this.geometry = new THREE.Geometry();
		let zero = new THREE.Vector3(0, 0, 0);
		let defColor = new THREE.Color(0x000055);
		this.size /= this.divisions;
		this.divisions++;
		this.size *= this.divisions;

		for (let i = 0; i < this.divisions * this.divisions; i++) {
			this.geometry.vertices.push(zero.clone());
			this.geometry.colors.push(defColor);
			this.velocities.push(zero.clone());
		}

		this.object = new THREE.Points(this.geometry, pMaterial);

		this.steps = (this.size / this.divisions);
		this.geometry.vertices.forEach((pos, p) => {

			let z = Math.ceil(-1 / 2 * this.size / this.steps) * this.steps + this.steps * (p % this.divisions);
			let x = Math.ceil(-1 / 2 * this.size / this.steps) * this.steps + this.steps * Math.floor(p / this.divisions);

			pos._x = x;
			pos._z = z;
			pos.x = x;
			pos.z = z;

		});


		this.geometry.verticesNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;


		this.object.name = 'Grid';
		this.object.userData = { entity: this };

		scene.add(this.object);

	};


	Grid.prototype = {

		rip: function(position) {

			if (position === undefined) {
				position = {
					x: -1 / 2 * this.size + Math.random() * this.size,
					z: -1 / 2 * this.size + Math.random() * this.size
				};
			}

			this.ripples.push(new Ripple({
				x: position.x,
				y: -0.2,
				z: position.z
			}, this._scene));

		},

		update: function(delta, tick) {

			this.deathTimer -= delta;

			if (this.deathTimer < 0) {
				this.deathTimer = this.deathTimerMax;
				this.updateDeath = true;
				this.deathRing++;
			}

			if (this.updateDeath) {
				this.updateDeath = false;
				let color = new THREE.Color(0x880000);
				this.geometry.vertices.forEach((pos, i) => {
					if (500 - Math.abs(pos._x) < this.deathRing * this.steps) {
						this.geometry.colors[i] = color;
					} else if (500 - Math.abs(pos._z) < this.deathRing * this.steps) {
						this.geometry.colors[i] = color;
					}
				});

				this.geometry.colorsNeedUpdate = true;
			}


			let particles = this.geometry.vertices;
			let ripples   = this.ripples;

			for (let r = 0, rl = ripples.length; r < rl; r++) {

				let ripple = ripples[r];

				ripple.update(delta, tick);

				if (ripple.life <= 0) {
					ripple.destroy();
					ripples.splice(r, 1);
					rl--;
					r--;
				}

			}


			if (ripples.length > 0) {

				let distance = this._distance;

				for (let p = 0, pl = particles.length; p < pl; p++) {

					let particle = particles[p];
					let velocity = this.velocities[p];

					distance.x = particle._x;
					distance.y = 0;
					distance.z = particle._z;


					for (let r = 0, rl = ripples.length; r < rl; r++) {

						let ripple    = ripples[r];
						let influence = ripple.getInfluence(distance);

						influence.setX(0);
						influence.setZ(0);
						velocity.add(influence);

					}


					velocity.y += (0 - particle.y) * 0.3;

					velocity.multiplyScalar(0.3);
					particle.add(velocity);

				}

				this.geometry.verticesNeedUpdate = true;

			}

		},

		allowedRadius: function() {
			return this.mapRadius - this.deathRing * this.steps;
		}

		,
		randomPos: function() {
			return Math.random() * this.allowedRadius() * 2 - this.allowedRadius()
		}

	};


	global.Grid = Grid;

})(typeof window !== 'undefined' ? window : this);

