
(function (global) {

    const Particles = function (scene, wormhole) {

    	this.scene = scene;
    	this.wormhole = wormhole;
        let particleCount = 1200,
            pMaterial = new THREE.PointsMaterial({
                color: 0x00FFFF,
                size: 20,
                map: new THREE.TextureLoader().load("images/particle.png"),
                blending: THREE.AdditiveBlending,
                transparent: true,
                alphaTest: 0.5
            });

        this.particles = new THREE.Geometry();

		this.velocities = [];
		this.lastAffected = [];

        for (let p = 0; p < particleCount; p++) {

            let pX = this.scene.grid.randomPos(),
                pY = Math.random() * 50 ,
                pZ = this.scene.grid.randomPos(),
                particle = new THREE.Vector3(pX, pY, pZ);

            this.particles.vertices.push(particle);
        }

        this.object = new THREE.Points(this.particles, pMaterial);
        this.object.sortParticles = true;

        scene.add(this.object);

        this.object.userData = { entity: this}

        this.object.name = "Particles"

		this.particleSystem = new THREE.GPUParticleSystem({
			maxParticles: 5000
		});

		scene.add(this.particleSystem);

		this.psOptions = {
			position: new THREE.Vector3(),
			positionRandomness: .3,
			velocity: new THREE.Vector3(),
			velocityRandomness: .5,
			color: 0xaa88ff,
			colorRandomness: .2,
			turbulence: .5,
			lifetime: 2,
			size: 5,
			sizeRandomness: 1
		};

		this.particles.vertices.forEach((pos, i) => {

			this.lastAffected[i] = 0;
		});

    };

    Particles.prototype = {

        destroy: function () {
        },

        update: function (delta, tick) {


            this.particles.vertices.forEach((pos, i) => {

				this.lastAffected[i] = this.lastAffected[i] - delta;

                let nPos = pos;

                let velocity = this.velocities[i];
                if (!velocity) {
					velocity = new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1).normalize().multiplyScalar(1/5);
                } else {
                    velocity.sub(velocity.clone().normalize().multiplyScalar(1/15));
                }
                velocity.add(new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1).normalize().multiplyScalar(1/10));

                this.wormhole.attract(nPos, velocity);

				nPos.x += velocity.x;
				nPos.y += velocity.y;
				nPos.z += velocity.z;

				if (Math.abs(nPos.x) > this.scene.grid.allowedRadius()
                 || Math.abs(nPos.z) > this.scene.grid.allowedRadius()
				 || velocity.lengthSq() === 0) {

					this.psOptions.position.x = nPos.x;
					this.psOptions.position.y = nPos.y;
					this.psOptions.position.z = nPos.z;

					for (let j = 0; j < 5; j++) {
						this.particleSystem.spawnParticle(this.psOptions);
					}

					nPos.x = this.scene.grid.randomPos();
                    nPos.z = this.scene.grid.randomPos();
                    velocity = new THREE.Vector3(0,0,0);
				}

                this.particles.vertices[i] = nPos;
				this.velocities[i] = velocity;

			});
            this.particles.verticesNeedUpdate = true;

            this.particleSystem.update(tick)


        },

        render: function () {
        },


    };

    global.Particles = Particles;

})(typeof window !== 'undefined' ? window : this);
