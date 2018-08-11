(function (global) {

    const Player = function (data, scene) {

        let states = Object.assign({}, data);
        console.log('new player!', states);

        let geometry = new THREE.BoxGeometry(20, 20, 20);
        let material = new THREE.MeshBasicMaterial({color: 0x00ffff});

        this.object = new THREE.Mesh(geometry, material);

        this.input = {left: false, right: false, up: false, down: false};
        this.speed = 1;

        document.addEventListener('keydown', (ev) => this.onKey(ev, ev.key, true));
        document.addEventListener('keyup', (ev) => this.onKey(ev, ev.key, false));

        document.addEventListener('click', (ev) => this.onClick(ev, false), false);
        document.addEventListener('contextmenu', (ev) => this.onClick(ev, true), false);

    };

    Player.prototype = {

        destroy: function () {
        },

        update: function () {
            if (this.input.left) {
                this.object.position.z += this.speed;
            }
            if (this.input.right) {
                this.object.position.z -= this.speed;
            }
            if (this.input.up) {
                this.object.position.x -= this.speed;
            }
            if (this.input.down) {
                this.object.position.x += this.speed;
            }
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


