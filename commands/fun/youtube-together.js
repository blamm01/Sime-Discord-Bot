const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const akinator = require('discord.js-akinator')

module.exports = {
    name: 'youtube-together',
    description: "Plays akinator game",
    aliases: ["yt-together","ytt"],
    botPerms: ["EMBED_LINKS","MANAGE_MESSAGES"],
    userPerms: [],
    categories: 'Fun',
}

module.exports.run = async(sime, message, args) => {
    if(!message.member.voice.channel) return message.channel.send(`You must be in voice channel first.`)
    sime.discordTogether.createTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
    return message.channel.send(new MessageEmbed().setTitle(`Youtube Together`).setDescription(`[Click this link to start Youtube Together](${invite.code})`).setColor("RANDOM"));
});
}