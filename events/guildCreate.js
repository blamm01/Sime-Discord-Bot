const sime = require('../index');
const channel = '849497466284933131';
const prefix = require('../config.json').prefix
const moment = require('moment')
const owner1 = '736636650796351559'
const { MessageEmbed } = require('discord.js')
let channelList = []

module.exports = async(sime, guild) => {
  await guild.channels.cache.filter(c => c.permissionsFor(sime.user.id).has(["SEND_MESSAGES"]) && c.permissionsFor(sime.user.id).has(["VIEW_CHANNEL"])).map(ch => {
    channelList.push(ch.id)
  })
    const channelIndex = Math.floor(Math.random() * channelList);
    const randomChannel = channelList[channelIndex]
    const channelToSend = await guild.channels.cache.find(c => c.id == randomChannel);
    if(channelToSend) {
      await channelToSend.send(new MessageEmbed().setTitle(`Thank you`)
      .setColor("#00fff2")
      .setDescription(`Thank you for invite **${sime.user.username}** to this server. My Default prefix is **${prefix}**. If you want to change it,use the \`prefix\` command. Use \`help\` for all commands`)
      )
    }
    let owner = await sime.users.cache.find(c => c.id == owner1)
    let addRemoveChannel = await sime.channels.cache.find(c => c.id == channel)
    if(!addRemoveChannel) { 
        addRemoveChannel = owner.dmChannel 
    }
    await addRemoveChannel.send(new MessageEmbed().setTitle(`Server Added`).setColor("GREEN").setFooter(`Currently: ${sime.guilds.cache.size} servers`).setDescription(`
	Server Name: **${guild.name}**\n
	Server ID: **${guild.id}**\n
	Server Created At: **${moment(guild.createdTimestamp).format("LT")} ${moment(guild.createdTimestamp).format("LL")} ${moment(guild.createdTimestamp).fromNow()}**\n
	Server Region: **${guild.region}**\n
	Server Owner: **${guild.owner.user.tag} (${guild.owner.user.id})**\n
	Server Rules Channel: **${guild.rulesChannel || "No Rules Channel"} (${guild.rulesChannelID || "No Rules Channel"})**\n
	Server Vanity URL: **${guild.vanityURLCode || "No Vanity"}**\n
	Server Verification Level: **${guild.verificationLevel}**\n
	Server has been verified ? **${guild.verified}**\n
	Humans | Bot | Total: **${guild.members.cache.filter(u => !u.user.bot).size} | ${guild.members.cache.filter(u => u.user.bot).size} | ${guild.memberCount}**
`).setThumbnail(guild.iconURL({ dynamic: true })))
}