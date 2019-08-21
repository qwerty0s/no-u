var Discord = require('discord.js');
var auth = require('./auth.json');
var fs = require('fs');
var path = require('path');

var bot = new Discord.Client();

bot.once('ready', function(evt){

	console.log("Connected as " + bot.user.username + " (" + bot.user.id + ")");

	bot.user.setActivity("Uno™", {type: "PLAYING" });

});

bot.on('message', function(message){

	if(message.author.bot == true){return;}

	getLastAuthorID(message).then(function(id) {

		var at = "<@" + id + ">";

		var mess = message.content.toLowerCase().split(/\W+/gi);
		var hasNoU = false;

		for(var i = 0; i < mess.length; i++){

			if(mess[i] == "u" || mess[i] == "you"){

				if(i == 0){return;}

				if(mess[i - 1] == "no"){

					hasNoU = true;

				}

			}

		}

		if(hasNoU){

			playReverse(message, at);

		}

	});

});

function playReverse(message, at, attachment){

	var revFolder = path.join(__dirname, 'reverse');

	fs.readdir(revFolder, function(err, files){

		if(err){

			console.log("error in func reverse: " + err);
			return;

		}

		var card = "./reverse/" + files[Math.floor(Math.random() * files.length)];

		message.channel.send(at, {

			files:[{

				attachment: card,
				name: card.substring(10, card.length)

			}]

		});

	});

}

function getLastAuthorID(message){

	var id = message.channel.fetchMessages({limit: 50}).then(function(messages){

		var Filtered = messages.filter(msg => !(msg.author.id == bot.user.id || msg.author.id == message.author.id || msg.createdTimestamp > message.createdTimestamp));

		if(Filtered.first()){

			return Filtered.first().author.id;

		}else{

			return bot.user.id;

		}

	});

	return id;

}

bot.login(auth.token);
