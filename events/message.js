const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json')
const chatBot = require('../models/chatbot')
const ms = require('ms')
const cooldown = new Discord.Collection()
const fetch = require('node-fetch')
const moderatorRole = require('../models/staffRole')

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
    if (!command) return
    try {
      let noPermissionHandler = command.noPermissionHandler
      const database = await sime.mongo.get(`modRole_${message.guild.id}`) || '0'
      const modRole = await message.guild.roles.cache.get(database)
        if(command.developerOnly) {
            if(command.developerOnly == true) {
                if(!(config.developer).includes(message.author.id)) return message.lineReply(`You don't have permission to use this command.Permission Level: \`Developer\``)
                command.run(sime, message, args)
            } else {
        if(command.cooldown) {
              if(command.categories == "Moderation") {
                if(modRole == null) {
                  if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
                  if(cooldown.has(`${command.name}${mesage.author.id}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
                } else {
                  let used = false
                  if(message.member.roles.cache.get(modRole.id)) {
                    used = true
                  } else {
                    if(message.member.permissions.has(command.userPerms || [])) {
                      used = true
                    }
                  }
                  if(used = false) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` or Moderator Role to run this command !`)
                  if(cooldown.has(`${command.name}${amessage.author.iduthorID}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
                }
              } else {
                if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
                  if(cooldown.has(`${command.name}${message.author.id}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
              }
        } else {
          
            if(command.categories == "Moderation") {
                if(modRole == null) {
                  if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
            command.run(sime, message, args)
            } else {
                  let used = false
                  if(message.member.roles.cache.get(modRole.id)) {
                    used = true
                  } else {
                    if(message.member.permissions.has(command.userPerms || [])) {
                      used = true
                    }
                  }
                  if(used = false) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` or Moderator Role to run this command !`)
            command.run(sime, message, args)
                }
              } else {
                if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
            command.run(sime, message, args)
              }
        }
    }
    } else {
        if(command.cooldown) {
            
            if(command.categories == "Moderation") {
                if(modRole == null) {
                  if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
                  if(cooldown.has(`${command.name}${message.author.id}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
                } else {
                  let used = false
                  if(message.member.roles.cache.get(modRole.id)) {
                    used = true
                  } else {
                    if(message.member.permissions.has(command.userPerms || [])) {
                      used = true
                    }
                  }
                  if(used = false) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` or Moderator Role to run this command !`)
                  if(cooldown.has(`${command.name}${message.author.id}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
                }
              } else {
                if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
                  if(cooldown.has(`${command.name}${message.author.id}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown * 1000)
              }
        } else {
            if(command.categories == "Moderation") {
                if(modRole == null) {
                  if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
            command.run(sime, message, args)
            } else {
                  let used = false
                  if(message.member.roles.cache.get(modRole.id)) {
                    used = true
                  } else {
                    if(message.member.permissions.has(command.userPerms || [])) {
                      used = true
                    }
                  }
                  if(used = false) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` or Moderator Role to run this command !`)
            command.run(sime, message, args)
                }
              } else {
                if (!message.member.permissions.has(command.userPerms || [])) return message.lineReply(`You need \`${command.userPerms.join("` `") || []}\` to run this command !`);
                 if (!message.guild.me.permissions.has(command.botPerms || []) && !message.channel.permissionsFor(sime.user.id).has(command.botPerms || [])) return message.lineReply(`I require \`${command.botPerms.join("` `") || []}\` permissions !`);
            command.run(sime, message, args)
              }
        }
    }
    } catch (err) {
        message.lineReply(new Discord.MessageEmbed()
            .setTitle(`An error occured`)
            .setDescription(`\`\`\`${err}\`\`\``)
            .setFooter(`Join support server for help | Run \`support\` command`)
        )
    }
}

async function commandRun(message,command, authorID) {
  if(cooldown.has(`${command.name}${authorID}`)) return message.lineReply(`Current Cooldown for **${command.name}** is \`${ms(command.cooldown * 1000, { long: true })}\``)
            command.run(sime, message, args)
            cooldown.set(`${command.name}${authorID}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${authorID}`)
            }, command.cooldown * 1000)
}