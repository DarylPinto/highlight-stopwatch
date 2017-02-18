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
		highlights: []
	},
	computed: {
		time_string: function(){		
			let m = Math.floor(this.seconds/60) % 60;
		  let s = this.seconds % 60;
		  let h = Math.floor(this.seconds/3600);
 
		  s = (s < 10) ? `0${s}` : s.toString();
		  m = (m < 10) ? `0${m}` : m.toString();
 
		  let timeArray = [m, s];
		  if(h > 0) timeArray.unshift(h.toString());

		  return timeArray.join(':');
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

		highlight: function(){
			this.highlights.push(this.time_string);
		},

		chooseWatchPath: function(){
			ipc.send('watch-path-change', null);
		},

		saveHighlights: function(){
			ipc.send('save-highlights', this.highlights);
		}

	},
	mounted: function(){
		ipc.send('config-request', null);
	}
});