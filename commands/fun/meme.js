/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const axios = require('axios');
const { Client, Message } = require("discord.js");

module.exports = {
	name: 'meme',
	aliases: [],
    categories: "Fun",
    description: "Meme :D",
};

module.exports.run = async (sime, message, args) => {
	// nuggetapi pog :LMFAO:
	axios.get('https://api.nuggetdev.com/api/meme')
		.then(function(response) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${response.data.title}`)
				.setURL(`${response.data.url}`)
				.setImage(response.data.image)
				.setColor('RANDOM')
				.setFooter(`👍 ${response.data.upvotes} 👎 ${response.data.downvotes} 💬 ${response.data.comments}`);
			message.lineReply(embed);
		});
};