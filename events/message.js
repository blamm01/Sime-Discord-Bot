const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json')
const chatBot = require('../models/chatbot')
const ms = require('ms')
const cooldown = new Discord.Collection()
const fetch = require('node-fetch')
const moderatorRole = require('../models/staffRole')
const language = require("../function/language").lang

const sime = require('../index');

module.exports = async (sime, message) => {
    if (message.channel.type == 'dm') return;
    const prefix = await sime.prefix(message)
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;
    let command = sime.commands.get(cmd);
    if (!command) command = sime.commands.get(sime.aliases.get(cmd));
    if (!command) return;
    const lang = await language(sime, message.guild, message.channel)
    const disableList = await sime.mongo.get(`disabled_${message.guild.id}`);
    if(disableList && disableList.find(c => c == command.name)) return message.lineReply(new Discord.MessageEmbed()
      .setTitle("Error")
      .setColor("RED")
      .setDescription(`**${command.name}** command was disabled in this server. Please ask Server Administrator to enable this command.`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
    )
    if(!message.guild.me.permissions.has(command.botPerms || [])) return message.channel.send(`I don't have enough permissions! Permissions required: ${command.botPerms.join(",") || "No Permissions Required"}`)
    let timeout = command.cooldown || 0
    timeout = timeout * 1000;
    const modList = await sime.mongo.get(`modRoleList_${message.guild.id}`);
    if(command.modRole == false || !command.modRole) {
        if(!message.member.permissions.has(command.userPerms || [])) return message.channel.send(`You don't have enough permissions!  Permissions required: ${command.userPerms.join(",") || "No Permissions Required"}`)
        commandRun(sime, message, command, message.author.id, timeout, cooldown, args, lang)
      } else {
        let able_to_use = false
        if(!modList || modList.size == 0) {
          if(!message.member.permissions.has(command.userPerms || [])) return message.channel.send(`You don't have enough permissions!  Permissions required: ${command.userPerms.join(",") || "No Permissions Required"}`)
          commandRun(sime, message, command, message.author.id, timeout, cooldown, args, lang)
          return;
        }
        await message.member.roles.cache.map(ro => {
          console.log(ro.id)
          if(able_to_use == true) return;
          if(modList && modList.find(r => r == ro.id)) {
            able_to_use = true
            commandRun(sime, message, command, message.author.id, timeout, cooldown, args, lang)
          } else {

          }
          console.log(able_to_use)
        })
        if(able_to_use == false) {
          if(!message.member.permissions.has(command.userPerms || [])) return message.channel.send(`You don't have enough permissions!
          Permissions required: ${command.userPerms.join(",") || "No Permissions Required"}`)
          commandRun(sime, message, command, message.author.id, timeout, cooldown, args, lang)
        }
      }
}

async function commandRun(sime, message,command, authorID, timeout, cooldown, args,lang) {
  if(lang == "vi") {
    if(cooldown.has(`${command.name}${authorID}`)) return message.lineReply(`Bạn chưa thể dùng lệnh này bây giờ`)
            command.run(sime, message, args, lang)
            cooldown.set(`${command.name}${authorID}`, Date.now() + timeout)
            setTimeout(() => {
                cooldown.delete(`${command.name}${authorID}`)
  }, timeout)
  } else {
  if(cooldown.has(`${command.name}${authorID}`)) return message.lineReply(`You are on cooldown !`)
            command.run(sime, message, args, lang)
            cooldown.set(`${command.name}${authorID}`, Date.now() + timeout)
            setTimeout(() => {
                cooldown.delete(`${command.name}${authorID}`)
  }, timeout)
  }
}