(function (global) {

    const Player = function (data, scene) {

        let states = Object.assign({}, data);
        console.log('new player!', states);

        let geometry = new THREE.BoxGeometry(20, 20, 20);
        let material = new THREE.MeshBasicMaterial({color: 0x00ffff});

        this.object = new THREE.Mesh(geometry, material);

        this.input = {left: false, right: false, up: false, down: false};
        this.speed = 100;

        document.addEventListener('keydown', (ev) => this.onKey(ev, ev.key, true));
        document.addEventListener('keyup', (ev) => this.onKey(ev, ev.key, false));

        document.addEventListener('click', (ev) => this.onClick(ev, false), false);
        document.addEventListener('contextmenu', (ev) => this.onClick(ev, true), false);

        this.lastUpdate = Date.now();

        this.object.userData = { entity: this}

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
                dZ += 1
            }
            if (this.input.right) {
                dZ -= 1
            }
            if (this.input.up) {
                dX -= 1;
            }
            if (this.input.down) {
                dX += 1;
            }

            let direction = new THREE.Vector3(dX, 0, dZ).normalize();

            this.object.position.x += direction.x * this.speed * delta;
            this.object.position.z += direction.z * this.speed * delta;

        },

        render: function () {
        },

        onKey: function (ev, key, pressed) {

            console.log(key);
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
            }
        },

        onClick: function (event, isContextMenu) {
            console.log(event);
            event.preventDefault();
            return false;
        }

    };

    global.Player = Player;


})(typeof window !== 'undefined' ? window : this);


