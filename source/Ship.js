
(function(global) {

	const Ship = function(data, scene, camera) {

		let states = Object.assign({}, data);


		let geometry = new THREE.SphereGeometry(100, 50, 50);
		let material = new THREE.MeshPhongMaterial({
			color: 0x00ff33
		});

		this.object = new THREE.Mesh(geometry, material);


		let glow_geometry = new THREE.SphereGeometry(120, 50, 50);
		let glow_material = new THREE.ShaderMaterial({
			uniforms: {
				viewVector: {
					type: 'v3',
					value: camera.position
				}
			},
			vertexShader: `uniform vec3 viewVector;
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
					vec3 glow = vec3(0, 1, 0) * intensity;
					gl_FragColor = vec4( glow, 1.0 );
				}
			`,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		let glow = new THREE.Mesh(glow_geometry, glow_material);

		this.object.glow = glow;
		this.object.add(glow);

		console.log('new Ship', states);

	};


	Ship.prototype = {
	};


	global.Ship = Ship;

})(typeof window !== 'undefined' ? window : this);

