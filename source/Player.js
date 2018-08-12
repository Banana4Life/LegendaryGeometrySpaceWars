(function (global) {

	const Player = function (scene, camera, plane, wormhole, scoreboard) {

		this.hp = 100;
		this.scene = scene;
		this.camera = camera;
		this.plane = plane;

		let listener = new THREE.AudioListener();
		camera.add(listener);

		let soundSource = new THREE.Audio(listener);

		this.weaponParticle = new WeaponParticle(scene, wormhole, soundSource, scoreboard);

		// let geometry = new THREE.BoxGeometry(20, 0, 20);
		// let material = new THREE.MeshBasicMaterial({
		// 	map: new THREE.TextureLoader().load("images/Ship.png"),
		// 	transparent: true,
		// 	alphaTest: 0.5
		// });

		let geometry = new THREE.Geometry();
		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true,
			wireframeLinewidth: 2
		});

		geometry.vertices = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 1, 0),
			new THREE.Vector3(1, 1, 0),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(0.5, 0.5, 1)
		];

		geometry.faces = [
			new THREE.Face3(0, 1, 2),
			new THREE.Face3(0, 2, 3),
			new THREE.Face3(1, 0, 4),
			new THREE.Face3(2, 1, 4),
			new THREE.Face3(3, 2, 4),
			new THREE.Face3(0, 3, 4)
		];


		let transform = new THREE.Matrix4();
		transform.makeScale(20, 10, 30);
		geometry.applyMatrix(transform);
		transform.makeTranslation(-10, 0, 0);
		geometry.applyMatrix(transform);
		transform.makeRotationX(THREE.Math.degToRad(180));
		geometry.applyMatrix(transform);

		this.object = new THREE.Mesh(geometry, material);

		this.input = {left: false, right: false, up: false, down: false, fire: false};
		this.speed = 250;

		document.addEventListener('keydown', (ev) => this.onKey(ev, ev.key, true));
		document.addEventListener('keyup', (ev) => this.onKey(ev, ev.key, false));

		document.addEventListener('mousedown', (ev) => this.onClick(ev, false, true), false);
		document.addEventListener('mouseup', (ev) => this.onClick(ev, false, false), false);
		document.addEventListener('contextmenu', (ev) => this.onClick(ev, true), false);

		document.addEventListener('mousemove', (ev) => this.onMove(ev), false);

		this.lastUpdate = Date.now();
		this.lastFire = this.lastUpdate;

		this.object.userData = {entity: this};

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		this.lastDeltaVector = new THREE.Vector3(0, 0, 0);

		scene.add(this.object);

		this.object.name = "Player";

	};

	Player.prototype = {

		destroy: function (by) {
			console.log("Player killed by: " + by.object.name);
		},

		update: function (delta) {
			let now = Date.now();

			let dX = 0;
			let dZ = 0;

			if (this.input.left) {
				dZ += 1;
			}
			if (this.input.right) {
				dZ -= 1;
			}
			if (this.input.up) {
				dX -= 1;
			}
			if (this.input.down) {
				dX += 1;
			}

			if (this.input.fire && (now - this.lastFire) > 150) {
				this.weaponParticle.fire(this, this.target);
				this.lastFire = now;
			}

			let direction = new THREE.Vector3(dX, 0, dZ).normalize();
			let deltaVector = direction.multiplyScalar(this.speed * delta);

			if (Math.abs(this.object.position.x + deltaVector.x) < 500 &&
				Math.abs(this.object.position.z + deltaVector.z) < 500) {
				this.object.position.add(deltaVector);
				this.camera.position.add(deltaVector);
			}


			this.raycaster.setFromCamera(this.mouse, this.camera);

			let intersects = this.raycaster.intersectObjects(this.scene.children);
			intersects.forEach(intersect => {
				if (intersect.object.name === "Plane") {
					this.target = intersect.point;
				}

			});

			if (deltaVector.lengthSq() === 0) {
				deltaVector = this.lastDeltaVector;
			}
			this.lastDeltaVector = deltaVector;

			let newPos = this.object.position.clone().add(deltaVector);

			this.object.lookAt(newPos);

			this.object.rotateY(THREE.Math.degToRad(180));

			this.object.geometry.computeBoundingSphere();

			let playerBs = this.object.geometry.boundingSphere;
			let playerBsRadiusSq = playerBs.radius * playerBs.radius;

			this.scene.children.forEach(c => {
				if (c.geometry && c.name.startsWith("Enemy")) {
					c.geometry.computeBoundingSphere();
					let bs = c.geometry.boundingSphere;
					let distanceSq = c.position.distanceToSquared(this.object.position);
					if (distanceSq < bs.radius * bs.radius || distanceSq < playerBsRadiusSq) {
						c.userData.entity.dealDamage(this);
					}
				}

			});

		},

		render: function () {
		},

		onKey: function (ev, key, pressed) {
			switch (key) {
				case 'w':
					this.input.up = pressed;
					ev.preventDefault();
					break;
				case 'a':
					this.input.left = pressed;
					ev.preventDefault();
					break;
				case 's':
					this.input.down = pressed;
					ev.preventDefault();
					break;
				case 'd':
					this.input.right = pressed;
					ev.preventDefault();
					break;
				case ' ':
					this.input.fire = pressed;
					ev.preventDefault();
					break;
			}
		},

		onClick: function (event, isContextMenu, isDown) {
			event.preventDefault();

			if (event.button === 0) {
				if (isDown) {
					this.input.fire = true;
				} else {
					this.input.fire = false;
				}
			}

			return false;
		},

		onMove: function (event) {
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		}

	};

	global.Player = Player;


})(typeof window !== 'undefined' ? window : this);
