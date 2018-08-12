
(function(global) {

	const Grid = function(data, scene, camera, player) {

		let states = Object.assign({}, data);


		this._frames = 0;
		this._last   = null;
		this._start  = null;


		let divisions = states.divisions || 100;
		let size      = states.size || 1000;


		this.player = player || null;

		let pMaterial = new THREE.PointsMaterial({
			color: 0xFF0000,
			size: 70,
			map: new THREE.TextureLoader().load("images/particle.png"),
			blending: THREE.AdditiveBlending,
			transparent: true,
			alphaTest: 1
		});

		this.geometry = new THREE.Geometry();
		let zero = new THREE.Vector3(0, 0, 0);
		for (let i = 0; i < divisions * divisions; i++) {
			this.geometry.vertices.push(zero.clone());
		}

		this.object = new THREE.Points(this.geometry, pMaterial);


		this.geometry.vertices.forEach((pos, p) => {

			let z = (-1 / 2 * size) + (size / divisions) * (p % divisions);
			let x = (-1 / 2 * size) + (size / divisions) * Math.floor(p / divisions);

			pos._x = x;
			pos._z = z;
			pos.x = x;
			pos.z = z;

		});


		this.geometry.verticesNeedUpdate = true;



		scene.add(this.object);

		this.object.name = 'Grid';

	};


	Grid.prototype = {

		update: function() {

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

