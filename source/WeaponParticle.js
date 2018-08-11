(function (global) {

    const WeaponParticle = function (scene) {
        let pMaterial = new THREE.PointsMaterial({
            color: 0x00FF00,
            size: 70,
            map: new THREE.TextureLoader().load("images/particle.png"),
            blending: THREE.AdditiveBlending,
            transparent: true,
            alphaTest: 0.5
        });

        this.geometry = new THREE.Geometry();
        let zero = new THREE.Vector3(0, 0, 0);
        for (let i = 0; i < 500; i++) {
            this.geometry.vertices.push(zero);
        }

        this.object = new THREE.Points(this.geometry, pMaterial);

        this.direction = [500];

        this.object.sortParticles = true;

        scene.add(this.object);

        this.object.userData = {entity: this}

        this.lastParticle = 0;
        this.speed = 5;

    };

    WeaponParticle.prototype = {

        destroy: function () {
        },

        update: function () {
            this.geometry.vertices.forEach((v, i) => {
                let nV = v;
                let dir = this.direction[i];
                if (dir) {
                    // TODO deltaTime
                    nV.x += dir.x * this.speed;
                    nV.y += dir.y * this.speed;
                    nV.z += dir.z * this.speed;
                    this.geometry.vertices[i] = nV;
                }

            });
            this.geometry.verticesNeedUpdate = true;
        },

        render: function () {
        },

        fire: function (player) {
            // console.log("Fire!");
            this.lastParticle++;
            if (this.lastParticle > 500) {
                this.lastParticle = 0;
            }

            this.direction[this.lastParticle] = new THREE.Vector3(Math.random(), 0, Math.random()).normalize(); // TODO directions based on player direction

            this.object.geometry.vertices[this.lastParticle] = new THREE.Vector3(player.object.position.x, player.object.position.y, player.object.position.z);
            this.object.geometry.verticesNeedUpdate = true;

        }


    };

    global.WeaponParticle = WeaponParticle;

})(typeof window !== 'undefined' ? window : this);
