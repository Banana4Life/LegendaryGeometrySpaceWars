
(function (global) {

    const Particles = function (scene, wormhole) {

    	this.wormhole = wormhole;
        let particleCount = 2000,
            pMaterial = new THREE.PointsMaterial({
                color: 0xFFFFFF,
                size: 20,
                map: new THREE.TextureLoader().load("images/particle.png"),
                blending: THREE.AdditiveBlending,
                transparent: true,
                alphaTest: 0.5
            });

        this.particles = new THREE.Geometry();

		this.velocities = [];

        for (let p = 0; p < particleCount; p++) {

            let pX = Math.random() * 500 - 250,
                pY = Math.random() * 50 ,
                pZ = Math.random() * 500 - 250,
                particle = new THREE.Vector3(pX, pY, pZ);

            this.particles.vertices.push(particle);
        }

        this.object = new THREE.Points(this.particles, pMaterial);
        this.object.sortParticles = true;

        scene.add(this.object);

        this.object.userData = { entity: this}

        this.object.name = "Particles"

    };

    Particles.prototype = {

        destroy: function () {
        },

        update: function () {

            this.particles.vertices.forEach((pos, i) => {
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

                this.particles.vertices[i] = nPos;
				this.velocities[i] = velocity;
			});
            this.particles.verticesNeedUpdate = true;


        },

        render: function () {
        },


    };

    global.Particles = Particles;

})(typeof window !== 'undefined' ? window : this);
