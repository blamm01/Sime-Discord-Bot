const messageembed = require('discord.js').MessageEmbed;

module.exports = {
  name: 'authorization-list',
  description: "List all members on Trusted List (whitelisted from bot)",
  categories: "Anti Raid",
  example: 'authorization-list',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-list']
}

module.exports.run = async (sime, message, args) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(da == false) return message.channel.send("This server is not enabled Anti Raid module")
  let data = await sime.mongo.get(`trustedusers_${message.guild.id}`)
  if(!data || data.length == 0) return message.channel.send(`There is no members in Authorization Members`)
  const array = [];
  data.forEach(async(mem) => array.push(`<@${mem.user}>`))
  message.channel.send(new messageembed().setTitle("Authorization Members").setColor("RANDOM").setDescription(array.join(" | ")).setThumbnail(message.guild.iconURL({ dynamic: true })))
}