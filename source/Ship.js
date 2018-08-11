
(function(global) {

	const Ship = function(data, scene, camera) {

		let states = Object.assign({}, data);


		let geometry = new THREE.Geometry();

		geometry.vertices = [
			new THREE.Vector3(0, 0, -5),
			new THREE.Vector3(0, 0, 5),
			new THREE.Vector3(0, 10, 5),
			new THREE.Vector3(0, 10, -5),
			new THREE.Vector3(-25, 5, 0)
		];

		geometry.faces = [
			new THREE.Face3(0, 1, 2),
			new THREE.Face3(0, 2, 3),
			new THREE.Face3(1, 0, 4),
			new THREE.Face3(2, 1, 4),
			new THREE.Face3(3, 2, 4),
			new THREE.Face3(0, 3, 4)
		];

		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true,
			wireframeLinewidth: 2
		});

		this.object = new THREE.Mesh(geometry, material);
		this.glow   = new THREE.Vector3(0, 1, 0);


		let glow_geometry = new THREE.CylinderGeometry(1, 10, 20, 32);

		// let glow_geometry  = geometry.clone();
		// let glow_transform = new THREE.Matrix4().makeScale(1.5, 1, 1);

		// glow_geometry.applyMatrix(glow_transform);


		let glow_material = new THREE.ShaderMaterial({
			uniforms: {
				glowVector: {
					type: 'v3',
					value: this.glow
				},
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
				uniform vec3 glowVector;
				varying float intensity;
				void main() {
					vec3 glow = glowVector * intensity;
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

