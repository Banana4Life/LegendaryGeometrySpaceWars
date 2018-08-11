(function (global) {

	const Player = function (scene, camera, plane, wormhole) {

		this.scene = scene;
		this.camera = camera;
		this.plane = plane;

		let listener = new THREE.AudioListener();
		camera.add(listener);

		let soundSource = new THREE.Audio(listener);

		this.weaponParticle = new WeaponParticle(scene, wormhole, soundSource);

		let geometry = new THREE.BoxGeometry(20, 0, 20);
		let material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load("images/Ship.png"),
			transparent: true,
			alphaTest: 0.5
		});

		this.object = new THREE.Mesh(geometry, material);

		this.input = { left: false, right: false, up: false, down: false, fire: false };
		this.speed = 100;

		document.addEventListener('keydown', (ev) => this.onKey(ev, ev.key, true));
		document.addEventListener('keyup', (ev) => this.onKey(ev, ev.key, false));

		document.addEventListener('mousedown', (ev) => this.onClick(ev, false, true), false);
		document.addEventListener('mouseup', (ev) => this.onClick(ev, false, false), false);
		document.addEventListener('contextmenu', (ev) => this.onClick(ev, true), false);

		document.addEventListener('mousemove', (ev) => this.onMove(ev), false);

		this.lastUpdate = Date.now();
		this.lastFire = this.lastUpdate;

		this.object.userData = { entity: this };

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		this.lastDeltaVector = new THREE.Vector3(0, 0, 0);

		scene.add(this.object);

		this.object.name = "Player";

	};

	Player.prototype = {

		destroy: function () {
		},

		update: function () {
			let now = Date.now();
			let delta = (now - this.lastUpdate) / 1000;
			this.lastUpdate = now;

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

			this.object.position.add(deltaVector);

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
						console.log("COLLIDE with player!");
						this.scene.remove(c);
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
