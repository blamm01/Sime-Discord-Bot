const messageembed = require('discord.js').MessageEmbed;

module.exports = {
  name: 'authorization-remove',
  description: "Remove members from Trusted List (whitelisted from bot)",
  categories: "Anti Raid",
  example: 'authorization-remove 736636650796351559',
  usage: '<Member>',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-delete']
}

module.exports.run = async (sime, message, args) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(da == false) return message.channel.send("This server is not enabled Anti Raid module")
  const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!member) return message.channel.send(`You need mention member first !`)
  if(message.member.roles.highest.position <= message.guild.me.roles.highest.position && message.author.id !== message.guild.owner.id) return message.channel.send(`You can't use this command because your highest role is lower or equal Sime's highest role`)
  let database = await sime.mongo.get(`trustedusers_${message.guild.id}`)
  if(!database || !database.length) return message.channel.send(`There is no members in Trusted List`)
  let data = database.find(x => x.user === member.id)
  if(!data) return message.channel.send(`**${member.user.tag}** is not in Trusted List`)
          
  var filterNew = database.filter(x => x.user !== member.id)
  
  await sime.mongo.set(`trustedusers_${message.guild.id}`, filterNew)
  

  message.channel.send(`**${member.user.tag}** was removed from Trusted List`)

}