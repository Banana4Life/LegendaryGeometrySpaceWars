
(function(global) {

	const Grid = function(data, scene, camera, player) {

		let states = Object.assign({}, data);

		this.deathRing = 1;
		this.updateDeath = true;


		this._frames = 0;
		this._last   = null;
		this._start  = null;

		this.divisions = states.divisions || 100;
		this.size      = states.size || 1000;

		this.player = player || null;

		let pMaterial = new THREE.PointsMaterial({
			vertexColors: THREE.VertexColors,
			size: 70,
			map: new THREE.TextureLoader().load("images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			alphaTest: 0.5
		});

		this.geometry = new THREE.Geometry();
		let zero = new THREE.Vector3(0, 0, 0);
		let defColor = new THREE.Color(0x000055);
		this.size /= this.divisions;
		this.divisions++;
		this.size *= this.divisions;

		for (let i = 0; i < this.divisions * this.divisions; i++) {
			this.geometry.vertices.push(zero.clone());
			this.geometry.colors.push(defColor);
		}

		this.object = new THREE.Points(this.geometry, pMaterial);


		this.geometry.vertices.forEach((pos, p) => {

			let steps = (this.size / this.divisions);
			let z = Math.ceil(-1 / 2 * this.size / steps) * steps + steps * (p % this.divisions);
			let x = Math.ceil(-1 / 2 * this.size / steps) * steps + steps * Math.floor(p / this.divisions);

			pos._x = x;
			pos._z = z;
			pos.x = x;
			pos.z = z;

		});


		this.geometry.verticesNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;


		this.object.userData = { entity: this};


		scene.add(this.object);


		this.object.name = 'Grid';

	};


	Grid.prototype = {

		update: function() {

			if (this.updateDeath) {
				this.updateDeath = false;
				console.log("DeathRing is: " + this.deathRing);
				let color = new THREE.Color(0xff0000);
				this.geometry.vertices.forEach((pos, i) => {
					if (500 - Math.abs(pos._x) <= this.deathRing) {
						this.geometry.colors[i] = color;
					} else if (500 - Math.abs(pos._z) <= this.deathRing) {
						this.geometry.colors[i] = color;
					}
				});

				this.geometry.colorsNeedUpdate = true;
			}

			let clock = Date.now();

			if (this._last === null) {
				this._last  = Date.now();
				this._start = Date.now();
				return;
			}


			let t = (clock - this._start) / 5000;
			if (t <= 1) {

			} else {
				this._start = Date.now();
			}


			this._last = clock;
			this._frames++;

		}

	};


	global.Grid = Grid;

})(typeof window !== 'undefined' ? window : this);

