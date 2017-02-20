const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;

/*** IPC Listeners ***/
ipc.on('watch-path-change', function(event, data){
	vm.watch_path = data;
});

ipc.on('config-reply', function(event, data){
	vm.watch_path = data.watch_path;
});

ipc.on('keyboard-shortcut', function(event, data){
	vm[data]();
});

/*** Renderer ***/
let vm = new Vue({
	el: '#app',
	data: {
		seconds: 0,
		timeout_id: null,
		timer_running: false,
		watch_path: null,
		highlights: [],
		notification: null
	},
	computed: {
		time_string: function(){		
			let m = Math.floor(this.seconds/60) % 60;
			let s = this.seconds % 60;
			let h = Math.floor(this.seconds/3600);

			s = (s < 10) ? `0${s.toString()}` : s.toString();
			m = (m < 10) ? `0${m.toString()}` : m.toString();

			let timeString = `${m}:${s}`;
			if(h > 0) timeString = `${h}:${timeString}`;

			return timeString;
		},
		toggleTimerTooltip: function(){	
			if(this.timer_running && this.highlights.length === 0){
				return 'Cancel';
			}else if(this.timer_running){
				return 'Finish and Save Highlights (Shift + PgUp)';
			}else{
				return 'Start Timer (Shift + PgUp)';
			}
		}
	},
	methods: {	
		resumeTimer: function(){
			this.timeout_id = setInterval(() => this.seconds++, 1000);
			this.timer_running = true;
		},

		pauseTimer: function(){
			clearInterval(this.timeout_id);
			this.timer_running = false;
		},

		stopTimer: function(){
			this.pauseTimer();
			this.seconds = 0;
			this.saveHighlights();
			this.highlights = [];
		},

		toggleTimer: function(){
			(this.timer_running) ? this.stopTimer() : this.resumeTimer();
		},

		highlight: function(){
			if(!this.timer_running) return false;
			this.highlights.push(this.time_string);

			document.querySelector('.timer').classList.add('highlight-flash');
			window.setTimeout(() => {
				document.querySelector('.timer').classList.remove('highlight-flash');
			}, 300);
		},

		chooseWatchPath: function(){
			ipc.send('watch-path-change', null);
		},

		saveHighlights: function(){
			if(this.highlights.length === 0) return false;
			this.showNotification('Saving Highlights File...', 1500);
			ipc.send('save-highlights', this.highlights);
		},

		showNotification: function(text, duration){
			this.notification = text;
			window.setTimeout(() => this.notification = null, duration);
		}

	},
	mounted: function(){
		ipc.send('config-request', null);
	}
});