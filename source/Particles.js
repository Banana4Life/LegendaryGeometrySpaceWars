
(function (global) {

    const Particles = function (scene) {
        let particleCount = 1800,
            pMaterial = new THREE.PointsMaterial({
                color: 0xFFFFFF,
                size: 20,
                map: new THREE.TextureLoader().load("images/particle.png"),
                blending: THREE.AdditiveBlending,
                transparent: true,
                alphaTest: 0.5
            });

        this.particles = new THREE.Geometry();

        for (let p = 0; p < particleCount; p++) {

            let pX = Math.random() * 500 - 250,
                pY = Math.random() * 500 - 250,
                pZ = Math.random() * 500 - 250,
                particle = new THREE.Vector3(pX, pY, pZ);

            this.particles.vertices.push(particle);
        }

        this.object = new THREE.Points(this.particles, pMaterial);
        this.object.sortParticles = true;

        scene.add(this.object);

        this.object.userData = { entity: this}

    };

    Particles.prototype = {

        destroy: function () {
        },

        update: function () {
            this.particles.vertices.forEach((v, i) => {
                let nV = v;
                let dV = new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 2) - 1, (Math.random() * 2) - 1).normalize();
                nV.x += dV.x / 5;
                nV.y += dV.y / 5;
                nV.z += dV.z / 5;
                this.particles.vertices[i] = nV;
            });
            this.particles.verticesNeedUpdate = true;
        },

        render: function () {
        },


    };

    global.Particles = Particles;

})(typeof window !== 'undefined' ? window : this);
