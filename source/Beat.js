
(function(global) {

	const _SAMPLE_SIZE = 43 * (256 / 2);



	/*
	 * HELPERS
	 */

	const _load_buffer = function(url, callback) {

		callback = callback instanceof Function ? callback : function() {};


		let request = new XMLHttpRequest();

		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		request.onload = _ => {

			this.context.decodeAudioData(request.response, buffer => {
				this.buffer = buffer;
				callback();
			}, error => {
				console.error(error);
			});

		};

		request.onerror = err => {
			console.error(err);
		};

		request.send();

	};



	/*
	 * IMPLEMENTATION
	 */

	const Beat = function(data) {

		let states = Object.assign({}, data);


		this.analyser = null;
		this.buffer   = null;
		this.context  = new global.AudioContext();
		this.history  = new Array(_SAMPLE_SIZE).fill(1);

		this.__previous_time = 0;


		if (typeof states.url === 'string') {

			_load_buffer.call(this, states.url, _ => {

				this.analyser = this.context.createAnalyser();
				this.analyser.connect(this.context.destination);
				this.analyser.minDecibels = -140;
				this.analyser.maxDecibels = 0;

				this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);
				this.times       = new Uint8Array(this.analyser.frequencyBinCount);

				this.source        = this.context.createBufferSource();
				this.source.buffer = this.buffer;
				this.source.loop   = true;
				this.source.connect(this.analyser);

				this.source.start(0);

				console.log('buffer?', this);

			});

		}

	};


	Beat.prototype = {

		getIntensity: function() {

			let context     = this.context;
			let analyser    = this.analyser;
			let frequencies = this.frequencies;

			if (context !== null && analyser !== null && frequencies !== null) {

				analyser.getByteFrequencydata(frequencies);


				let energy = 0;

				for (let f = 0, fl = frequencies.length; f < fl; f++) {
					this.history.push(frequencies[f]);
					energy += frequencies[f];
				}


				if (this.history.length >= _SAMPLE_SIZE) {

					energy = energy / (_SAMPLE_SIZE * (256 / 2));


					let average = 0;

					for (let h = 0; h < this.history.length; h++) {
						average += this.history[h];
					}

					average = average / this.history.length;


					let delta = context.currentTime - this.__previous_time;
					if (delta > 0 && this.bpm_table.length > 0) {

						for (let b = 0; b < this.bpm_table.length; b++) {

							let bpm   = this.bpm_table[b];
							let check = Math.round((delta / bpm['time'])) * 1000;
							if (check % (Math.round(bpm['time']) * 1000) === 0) {
								delta = bpm['time'];
							}

						}

					}


					// XXX: WTF does this do?
					if (delta > 3) {
						this.__previous_time = delta = 0;
					}

				}


				this.__previous_time = context.currentTime;

			}

		}

	};


	global.Beat = Beat;

})(typeof window !== 'undefined' ? window : this);

