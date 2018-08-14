(function (global) {

	const _on_click = function(event, state) {

		state = state === true;

		if (event.button === 0) {
			this.input.fire = state;
		}

		event.preventDefault();

		return false;

	};

	const _on_mouse_move = function(event) {

		this.mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	};

	const _on_touch_start = function(event) {

		event.preventDefault();

		this.input.fire = true;

		return false;

	};

	const _on_touch_move = function(event) {

		let touch = event.touches[0] || null;
		if (touch !== null) {
			this.mouse.x =  (touch.clientX / window.innerWidth)  * 2 - 1;
			this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
		}

		event.preventDefault();

		this.input.fire = true;

		return false;

	};

	const _on_touch_end = function(event) {

		this.input.fire = false;

		event.preventDefault();

		return false;

	};



	const Player = function (scene, camera, plane, wormhole, scoreboard) {

		//this.immune = true;

		this.defaultFireRate = 200;
		this.fireRate = this.defaultFireRate;
		this.scoreboard = scoreboard;
		this.scene = scene;
		this.camera = camera;
		this.plane = plane;

		this.listener = new THREE.AudioListener();
		camera.add(this.listener);

		let soundSource = new THREE.Audio(this.listener);

		this.weaponParticle = new WeaponParticle(scene, wormhole, soundSource, scoreboard, this);

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


		this.cursor = new Cursor(scene);

		let transform = new THREE.Matrix4();
		transform.makeScale(20, 10, 30);
		geometry.applyMatrix(transform);
		transform.makeTranslation(-10, 0, 0);
		geometry.applyMatrix(transform);
		transform.makeRotationX(THREE.Math.degToRad(180));
		geometry.applyMatrix(transform);

		this.object = new THREE.Mesh(geometry, material);

		this.input = { left: false, right: false, up: false, down: false, fire: false };
		this.speed = 250;


		if ('ontouchstart' in window) {
			window.addEventListener('touchstart', e => _on_touch_start.call(this, e), false);
			window.addEventListener('touchmove',  e => _on_touch_move.call(this, e),  false);
			window.addEventListener('touchend',   e => _on_touch_end.call(this, e),   false);
		} else {
			window.addEventListener('mousedown', e => _on_click.call(this, e, true),  false);
			window.addEventListener('mousemove', e => _on_mouse_move.call(this, e),   false);
			window.addEventListener('mouseup',   e => _on_click.call(this, e, false), false);
		}

		if ('onkeydown' in window) {
			window.addEventListener('keydown', e => this.onKey(e, e.key, true),  false);
			window.addEventListener('keyup',   e => this.onKey(e, e.key, false), false);
		}


		window.addEventListener('contextmenu', e => {
			e.preventDefault();
			return false;
		}, false);


		this.lastUpdate = Date.now();
		this.lastFire = this.lastUpdate;

		this.object.userData = { entity: this };

		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		this.lastDeltaVector = new THREE.Vector3(0, 0, 0);

		scene.add(this.object);

		this.object.name = "Player";

		this.lastReward = 1000;
		this.rewardTime = 0;

		this.particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 5000
		});

		this.rocketParticles = new THREE.GPUParticleSystem({
			maxParticles: 5000
		});

		scene.add(this.particleSystem);
		scene.add(this.rocketParticles);

		this.psOptions = {
			position: new THREE.Vector3(),
			positionRandomness: 25,
			velocity: new THREE.Vector3(),
			velocityRandomness: 0.5,
			color: 0xffffff,
			colorRandomness: 0,
			turbulence: 20,
			lifetime: 2,
			size: 20,
			sizeRandomness: 1
		};

		this.rocketParticlesOptions = {
			position: new THREE.Vector3(),
			positionRandomness: 1,
			velocity: new THREE.Vector3(),
			velocityRandomness: 1,
			color: 0x990000,
			colorRandomness: 0.2,
			turbulence: 5,
			lifetime: 2,
			size: 10,
			sizeRandomness: 2
		};

	};

	Player.prototype = {

		destroy: function (by) {

			if (this.immune || (this.lastDeath > 0 && this.scene.grid.deathRing <= 50)) {
				return;
			}

			this.lastDeath = 1;

			this.scene.grid.deathTimerMax /= 2;
			this.scene.grid.deathTimer = Math.min(this.scene.grid.deathTimer, this.scene.grid.deathTimerMax);
			this.scene.grid.deathRing++;
			this.scene.grid.updateDeath = true;

			this.scoreboard.lives--;
			this.scoreboard.needsUpdate = true;

			this.psOptions.position = this.object.position;
			this.psOptions.velocity = this.lastDeltaVector.clone().normalize();

			if (this.scene.grid.deathRing <= 50) {
				for (let i = 0; i < 5000; i++) {
					this.particleSystem.spawnParticle(this.psOptions);
				}
			}

			if (this.scoreboard.lives > 0) {
				this.scene.children.forEach(child => {
					if (child.name.startsWith("Enemy")) {
						child.userData.entity.destroy(this);
						child.userData.entity.death = 3;
					}
				});

				this.object.position.x = 0;
				this.object.position.z = 0;
				this.camera.position.x = 800;
				this.camera.position.y = 1000;
				this.camera.position.z = 0;
			} else {
				this.scoreboard.gameOver = true;
				this.scoreboard.update();
			}




		},

		activateReward: function () {
			if (this.scoreboard.points > this.lastReward * 2) {
				this.lastReward = Math.floor(this.scoreboard.points / 1000) * 1000;
				this.fireRate = 50;
				this.scoreboard.rewardActive = true;
				this.scoreboard.nextReward = this.lastReward * 2;
				this.scoreboard.needsUpdate = true;
				this.rewardTime = 5;
			}
		},

		update: function (delta, tick) {

			this.lastDeath -= delta;

			if (this.scene.grid.allowedRadius() <= 0) {
				this.destroy(this);
			}

			this.particleSystem.update(tick);
			this.rocketParticles.update(tick);
			let now = Date.now();
			this.rewardTime -= delta;
			if (this.scoreboard.rewardActive && this.rewardTime < 0) {
				this.fireRate = this.defaultFireRate;
				this.scoreboard.rewardActive = false;
				this.scoreboard.needsUpdate = true;
			}

			let dX = 0;
			let dZ = 0;
			this.rocketParticlesOptions.position = this.object.position;
			if (this.input.left) {
				dZ += 1;
				for (let i = 0; i < 50; i++) {
					this.rocketParticles.spawnParticle(this.rocketParticlesOptions);
				}
			}
			if (this.input.right) {
				dZ -= 1;
				for (let i = 0; i < 50; i++) {
					this.rocketParticles.spawnParticle(this.rocketParticlesOptions);
				}
			}
			if (this.input.up) {
				dX -= 1;
				for (let i = 0; i < 50; i++) {
					this.rocketParticles.spawnParticle(this.rocketParticlesOptions);
				}
			}
			if (this.input.down) {
				dX += 1;
				for (let i = 0; i < 50; i++) {
					this.rocketParticles.spawnParticle(this.rocketParticlesOptions);
				}
			}

			if (this.input.fire && (now - this.lastFire) > this.fireRate) {
				this.weaponParticle.fire(this, this.target);
				this.lastFire = now;
			}

			let direction = new THREE.Vector3(dX, 0, dZ).normalize();
			let deltaVector = direction.multiplyScalar(this.speed * delta);

			if (Math.abs(this.object.position.x + deltaVector.x) < this.scene.grid.allowedRadius() &&
				Math.abs(this.object.position.z + deltaVector.z) < this.scene.grid.allowedRadius()) {
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

			this.cursor.pointAt(this.target);

			/*
			if (deltaVector.lengthSq() === 0) {
				deltaVector = this.lastDeltaVector;
			}
			*/

			this.lastDeltaVector = deltaVector;

			let newPos = this.target; // this.object.position.clone().add(deltaVector);

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
			console.log(key);

				switch (key) {
				case 'w':
				case 'ArrowUp':
					this.input.up = pressed;
					ev.preventDefault();
					break;
				case 'a':
				case 'ArrowLeft':
					this.input.left = pressed;
					ev.preventDefault();
					break;
				case 's':
				case 'ArrowDown':
					this.input.down = pressed;
					ev.preventDefault();
					break;
				case 'd':
				case 'ArrowRight':
					this.input.right = pressed;
					ev.preventDefault();
					break;
				case ' ':
					this.input.fire = pressed;
					ev.preventDefault();
					break;
			}
		}

	};

	global.Player = Player;


})(typeof window !== 'undefined' ? window : this);
