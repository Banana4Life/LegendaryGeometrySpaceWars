
(function(global) {

	const _in_out_sine = function(t, b, c, d) {
		return -1 / 2 * c * (Math.cos(Math.PI * t / d) - 1) + b;
	};

	const Ripple = function(data, scene, camera) {

		let states = Object.assign({}, data);

		this.geometry  = new THREE.CircleGeometry(1, 36);
		this.position  = new THREE.Vector3(states.x || 0, states.y || 0, states.z || 0);
		this.influence = new THREE.Vector3();
		this.sphere    = new THREE.Sphere(this.position, 0);

		this.geometry.vertices.shift();
		this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

		this.material = new THREE.LineBasicMaterial({
			transparent: true
		});


		this.strength  = 100 + Math.random() *  75;
		this.threshold = 100 + Math.random() *  75;
		this.growth    = 0.2 + Math.random() * 0.5;

		this.life = 1;

	};


	Ripple.prototype = {

		getInfluence: function(vector) {

			this.influence.set(0, 0, 0);

			let distance = this.sphere.distanceToPoint(vector);
			if (distance <= this.threshold) {

				let ease  = _in_out_sine(this.threshold - distance, 0, 1, this.threshold);
				let power = (this.strength * ease * this.life);

				this.influence.addVectors(vector, this.sphere.center).multiplyScalar(power);

			}

			return this.influence;

		},

		update: function(delta, tick) {

			let d = delta * 1000 / (1000 / 60);

			this.sphere.radius += (this.growth * this.life) * d;
			this.life -= 0.01 * d;

		},

		destroy: function() {

			this.geometry.dispose();
			this.material.dispose();

		}

	};


	global.Ripple = Ripple;

})(typeof window !== 'undefined' ? window : this);

