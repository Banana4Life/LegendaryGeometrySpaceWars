
(function(global) {

	const Scoreboard = function(data, scene, points) {
		this.scene = scene;
		this.pointsChanged = true;
		this.points = points;
		this.states = Object.assign({}, data);
		this.createText();
	};

	Scoreboard.prototype = {
		createText: function() {
			let loader = new THREE.FontLoader();

			loader.load('external/three/fonts/helvetiker_regular.typeface.json', (font) => {
				let geometry = new THREE.TextGeometry('Points: ' + this.points, {
					font: font,
					size: 30,
					height: 5,
					curveSegments: 1,
					bevelEnabled: false,
					bevelThickness: 1,
					bevelSize: 1,
					bevelSegments: 1
				});

				let oldObject = this.object;
				let material = new THREE.MeshBasicMaterial({ color: 0x990000 });
				this.object = new THREE.Mesh(geometry, material);
				this.object.geometry.computeBoundingBox();

				let zDelta = (this.object.geometry.boundingBox.max.x - this.object.geometry.boundingBox.min.x) / 2;
				this.object.position.set(this.states.position.x, this.states.position.y, this.states.position.z + zDelta);
				this.object.rotation.x = -Math.PI / 2;
				this.object.rotation.y = Math.PI / 2.25;
				this.object.rotation.z = Math.PI / 2;
				this.object.userData = { entity: this };
				this.scene.add(this.object);
				this.scene.remove(oldObject);
				this.pointsChanged = false;
			});
		},

		updateText: function() {
			this.createText(this.points);
		},

		update: function() {
			if (this.pointsChanged) {
				this.updateText(this.points);
			}
		}
	};

	global.Scoreboard = Scoreboard;

})(typeof window !== 'undefined' ? window : this);
