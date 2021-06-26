const messageembed = require('discord.js').MessageEmbed;
const schema = require('../../models/authorization-roles')

module.exports = {
  name: 'authorization-list',
  description: "List all roles on whitelisted roles (whitelisted from bot)",
  categories: "Anti Make Changes",
  example: 'authorization-list',
  usage: '<Role>',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-list']
}

module.exports.run = async (sime, message, args) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(da == false) return message.channel.send("This server is not enabled Anti Make Changes module")
  schema.findOne({ Guild: message.guild.id }, async(err, data) => {
  if(!data || data.Role.length == 0) return message.channel.send(`There is no role in Authorization Roles`)
    message.channel.send(new messageembed().setTitle(`Authorization Roles`).setColor("RANDOM").setDescription(`<@&${data.Role.join("> | <@&")}>`))
  })
}