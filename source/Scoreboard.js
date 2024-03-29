
(function(global) {

	const Scoreboard = function(data, scene) {
		this.scene = scene;
		this.points = 0;
		this.needsUpdate = true;
		this.lives = 50;
		this.states = Object.assign({}, data);
		this.rewardActive = false;
		this.nextReward = 2000;
		this.gameOver = false;
		this.createText();
	};

	Scoreboard.prototype = {
		createText: function() {
			let loader = new THREE.FontLoader();

			loader.load('external/three/fonts/helvetiker_regular.typeface.json', (font) => {
				let scoreValue = 'Score: ' + this.points;
				let score = this.gameOver ? "You ran out of space! Total " + scoreValue : scoreValue + "/" + (this.nextReward);
				let hype = !this.gameOver && this.rewardActive ? " | HYPER MODE ACTIVE" : "";
				let geometry = new THREE.TextGeometry(score + hype, {
					font: font,
					size: 30,
					height: 5,
					curveSegments: 1,
					bevelEnabled: false,
					bevelThickness: 1,
					bevelSize: 1,
					bevelSegments: 1
				});

				let material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
				this.object = new THREE.Mesh(geometry, material);
				this.object.geometry.computeBoundingBox();

				let zDelta = (this.object.geometry.boundingBox.max.x - this.object.geometry.boundingBox.min.x) / 2;
				this.object.position.set(this.states.position.x, this.states.position.y + 30, this.states.position.z + zDelta);
				this.object.rotation.x = -Math.PI / 2;
				this.object.rotation.y = Math.PI / 2.25;
				this.object.rotation.z = Math.PI / 2;
				this.object.userData = { entity: this };
				this.scene.add(this.object);
				this.needsUpdate = false;
				this.needsUpdate = false;
			});
		},

		updateText: function() {
			this.scene.remove(this.object);
			this.createText(this.points);
		},

		update: function() {
			if (this.needsUpdate) {
				this.updateText(this.points);
			}
		}
	};

	global.Scoreboard = Scoreboard;

})(typeof window !== 'undefined' ? window : this);
