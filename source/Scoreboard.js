
(function(global) {

	const Scoreboard = function(data, scene, points) {

		let states = Object.assign({}, data);
		let geometry;
		let loader = new THREE.FontLoader();

		loader.load('external/three/fonts/helvetiker_regular.typeface.json', function (font) {
			geometry = new THREE.TextGeometry('Punktestatus: ' + points, {
				font: font,
				size: 30,
				height: 5,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 1,
				bevelSize: 1,
				bevelSegments: 2
			});
			let material = new THREE.MeshBasicMaterial({ color: 0x990000/*, envMap: scene.background*/ });
			let mesh = new THREE.Mesh(geometry, material);
			mesh.geometry.computeBoundingBox();

			console.log(mesh.geometry.boundingBox);

			let zDelta = (mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x) / 2;
			mesh.position.set(states.position.x, states.position.y, states.position.z + zDelta);
			mesh.rotation.x = -Math.PI / 2;
			mesh.rotation.y = Math.PI / 2.25;
			mesh.rotation.z = Math.PI / 2;
			scene.add(mesh);
		});


	};



	Scoreboard.prototype = {

		destroy: function() {
		},

		update: function() {
		}
	};

	global.Scoreboard = Scoreboard;

})(typeof window !== 'undefined' ? window : this);
