
(function(global) {

	const Grid = function(data, scene, camera, player) {

		let states = Object.assign({}, data);


		this.particles = [];
		this._frames   = 0;
		this._last     = null;
		this._start    = null;


		let divisions = states.divisions || 100;
		let size      = states.size || 1000;
		let step      = size / divisions;


		this.object = new THREE.Group();
		this.player = player || null;


		let geometry = new THREE.SphereGeometry(2, 16, 16);
		let material = new THREE.ShaderMaterial({
			uniforms: {
				viewVector: {
					type: 'v3',
					value: camera.position
				}
			},
			vertexShader: `
			uniform vec3 viewVector;
			varying float intensity;
			void main() {
				gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
				vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
				intensity = pow( dot(normalize(viewVector), actual_normal), 6.0 );
			}
			`,
			fragmentShader: `
			varying float intensity;
			void main() {
				vec3 glow = vec3( 0, 1, 0) * intensity;
				gl_FragColor = vec4( glow, 1.0 );
			}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0.5
		});


		for (let x = -1 / 2 * size; x <= 1 / 2 * size; x += step) {

			for (let z = -1 / 2 * size; z <= 1 / 2 * size; z += step) {

				let particle = new THREE.Mesh(geometry, material);


				particle._x = x;
				particle._y = 0;
				particle._z = z;

				particle.position.x = x;
				particle.position.y = 0;
				particle.position.z = z;

				this.particles.push(particle);
				this.object.add(particle);

			}

		}


		scene.add(this.object);

		this.object.name = 'Grid';

	};


	Grid.prototype = {

		update: function() {

			let particles = this.particles;
			let clock     = Date.now();

			if (this._last === null) {
				this._last  = Date.now();
				this._start = Date.now();
				return;
			}


			let t = (clock - this._start) / 5000;
			if (t <= 1) {

				for (let p = 0, pl = particles.length; p < pl; p++) {

					// let particle = particles[p];

					// particle.position.y = 2 * Math.sin(this._frames + particle.position.z) + 2 * Math.cos(this._frames + particle.position.x);

				}

			} else {
				this._start = Date.now();
			}


			this._last = clock;
			this._frames++;

		}

	};


	global.Grid = Grid;

})(typeof window !== 'undefined' ? window : this);

