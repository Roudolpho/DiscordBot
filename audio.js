module.exports = {
	queue: [],
	
	addServers: function(servers) {//initially adds a queue for all servers
		servers.forEach(server => {
			//console.log(server);
			this.queue.push({id:server.id, queue:[]});
		});
		//console.log(this.queue);
	},
	
	play: function(file, fileLength, channel) {//adds a audio file to a server's queue
		//console.log(channel.guild.id);
		this.queue.forEach(server => {//This decides what server's queue to add the audio to
			if (server.id === channel.guild.id) {
				server.queue.push([file, fileLength, channel]);
				//console.log(server.queue.length);
				if (server.queue.length == 1) {
					this.playNext(channel.guild.id);
				}
			}
		});
	},
	
	playNext: function(guildID) {//plays the next file
		queue = this.queue.filter(server => server.id == guildID)[0].queue;
		if (queue.length > 0) {
			//console.log(queue.length, queue[0].length, typeof queue, typeof queue[0], typeof queue[0][2]);
			queue[0][2].join().then(connection => { // Connection is an instance of VoiceConnection
				//msg.reply('I have successfully connected to the channel!');
				connection.playArbitraryInput(queue[0][0]);
				setTimeout(() => {
					if (queue.length == 1) {
						queue[0][2].leave();
					}
					queue = queue.splice(1);
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].id == guildID) this.queue[i].queue = queue;
					}
					if (queue.length > 0) {
						this.playNext(guildID);
					}
					//console.log("LENGTH HERE+D_A+D_A+_+", queue.length);
				}, queue[0][1]*1000);
			})
			.catch(err => {
				console.log(err.toString().split('\n')[0]);
				if (queue.length == 1) {
					queue[0][2].leave();
				}
				queue = queue.splice(1);
				for (i = 0; i < this.queue.length; i++) {
					if (this.queue[i].id == guildID) this.queue[i].queue = queue;
				}
				if (queue.length > 0) {
					this.playNext(guildID);
				}
			});
		}
	}
};