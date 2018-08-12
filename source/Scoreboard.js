
(function(global) {

	const Scoreboard = function(data, scene) {

		let states = Object.assign({}, data);

		let loader = new THREE.FontLoader();
		let geometry;
		loader.load('external/three/fonts/helvetiker_regular.typeface.json', function (font) {
			geometry = new THREE.TextGeometry('Hallo ihr Nutten', {
				font: font,
				size: 80,
				height: 40,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelSegments: 5
			});
		});
		let material = new THREE.MeshBasicMaterial({ color: 0xffffff});
		this.object = new THREE.Mesh(geometry, material);
		this.object.position.set(states.position.x, states.position.y, states.position.z);
		scene.add(this.object);
	};



	Scoreboard.prototype = {

		destroy: function() {
		},

		update: function() {
		}
	};

	global.Scoreboard = Scoreboard;

})(typeof window !== 'undefined' ? window : this);
