const Discord = require('discord.js');
const auth = require('./auth.json');
const audio = require('./audio.js');
const googleTTS = require('google-tts-api');
//const tts = require('');
const bot = new Discord.Client();
var me = null;
const SamID = '175369449300295680';




var triggerWords = [
	{word: 'gay', emoji: 'robbienet'},
	{word: 'nae nae', emoji: 'RobbieSax'},
	{word: 'yeet', emoji: 'robbiego'}];

var audioPhrases = {
	"oh really": {url: "http://spolack1.weebly.com/uploads/2/4/3/6/2436689/skin_a_cat.mp3", len: 5},
	"you can\'t milk those": {url: "https://vignette.wikia.nocookie.net/leagueoflegends/images/4/4a/Alistar.joke.ogg/revision/latest?cb=20121127051655", len: 3},
	"lol": {url: "https://vignette.wikia.nocookie.net/leagueoflegends/images/1/10/Teemo.laugh3.ogg/revision/latest?cb=20140105155426", len: 3},
	"test": {url: "https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20World&tl=en&total=1&idx=0&textlen=11&tk=477162.80083&client=t&prev=input&ttsspeed=1", len: 5}
};
	
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.fetchUser('200041042299322379').then(user => {me = user;});
  //console.log(me);
  //console.log(bot.guilds);
  audio.addServers(bot.guilds);
});

var noiseOn = false;
var ttsOn = false;

bot.on('message', msg => {
	//console.log(bot.voiceConnections);
	console.log(`${msg.author.username} : ${msg.content}`);
	if (msg.content.substring(0,5).toLowerCase() === '//tts' && ttsOn) {
		console.log('tts detected');
		if (msg.guild) {
			//console.log('guild')
			if (msg.member.voiceChannel) {
				googleTTS(msg.content.substring(5,msg.content.length), 'ru', 1).then(function (url) {audio.play(url, 5, msg.member.voiceChannel);}).catch(function (err) {console.error(err.stack);});
			}
		}
	}
	if (msg.author == me) {
		if (msg.content === 'off') {
			noiseOn = false;
		} 
		if (msg.content === 'on') {
			noiseOn = true;
		}
		if (msg.content === 'ttsoff') {
			ttsOn = false;
		} 
		if (msg.content === 'ttson') {
			ttsOn = true;
		}
	}
	triggerWords.forEach(function(i) {
		if (msg.content.toLowerCase().indexOf(i.word) != -1) {
			msg.react(bot.emojis.find("name", i.emoji));
		}
	});
	if (noiseOn) {
		for(phraseText in audioPhrases) {
			phrase = audioPhrases[phraseText];
			if (msg.content.toLowerCase().indexOf(phraseText) != -1) {
				if (!msg.guild) return;
				if (msg.member.voiceChannel) {
					console.log(phrase);
					audio.play(phrase.url, phrase.len, msg.member.voiceChannel);
				}
			}
		}
	}
});

bot.on('messageDelete', msg => {
	console.log('deletion detected');
	//console.log(msg.author);
	me.send(`**${msg.author.username}** just deleted the following message:\n${msg.content}`)
	if (me.id != msg.author.id){
		msg.author.send(`Hey, you just deleted the message: \n*${msg.content}* \nWhat are you trying to hide?`);
	}
});

var samCooldown = true;
var joinCooldown = true;
var accents = ['en', 'en-gb', 'en-ca', 'zh', 'en-au', 'sw', 'es', 'is', 'ar', 'ko', 'ja', 'ru'];

bot.on('voiceStateUpdate', (userOld,user) => {
	//console.log(user);
	if (user.id == SamID && user.voiceChannel && user.voiceChannel != userOld.voiceChannel && samCooldown) {
		audio.play("C:/Users/Ryan/Desktop/DiscordBot/audio/STHUSam.ogg", 8, user.voiceChannel);
		samCooldown = false;
		setTimeout(() => {samCooldown = true}, 1000*60*30);
	}
	if (user.id != SamID && user.voiceChannel && user.voiceChannel != userOld.voiceChannel && !user.user.bot) {
		/*if (joinCooldown) { //Oh, hello there!
			audio.play("./audio/hellothere.wav", 3, user.voiceChannel);
		}*/
		googleTTS(user.nickname + " is here!", 'ru', 1).then(function (url) {audio.play(url, 4, user.voiceChannel);}).catch(function (err) {console.error(err.stack);});
		joinCooldown = false;
		setTimeout(() => {joinCooldown = true}, 5000);
	}
});



bot.login(auth.token);




//googleTTS('Hello World', 'en', 1).then(function (url) {console.log(url);}).catch(function (err) {console.error(err.stack);});

/*const fpcalc = require("fpcalc");
fpcalc("./audio/hellothere.wav", function(err, result) {
  if (err) throw err;
  console.log(result.file, result.duration, result.fingerprint);
});*/