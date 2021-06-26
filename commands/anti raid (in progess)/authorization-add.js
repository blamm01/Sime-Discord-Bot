const messageembed = require('discord.js').MessageEmbed;

module.exports = {
  name: 'authorization-add',
  description: "Add a member to Trusted List (whitelisted from bot)",
  categories: "Anti Raid",
  example: 'authorization-add 736636650796351559',
  usage: '<Member>',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-add']
}

module.exports.run = async (sime, message, args) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(da == false) return message.channel.send("This server is not enabled Anti Raid module")
  const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!member) return message.channel.send(`You need mention member first !`)
  if(message.member.roles.highest.position <= message.guild.me.roles.highest.position && message.author.id !== message.guild.owner.id) return message.channel.send(`You can't use this command because your highest role is lower or equal Sime's highest role`)
   let trustedusers = await sime.mongo.get(`trustedusers_${message.guild.id}`)
  if(trustedusers && trustedusers.find(find => find.user == member.id)) {
        return message.channel.send(`**${member.user.tag}** is in Trusted List already`)
  }
  let data = {
    user: member.id
}
  await sime.mongo.push(`trustedusers_${message.guild.id}`,data)
  message.channel.send(`I have added **${member.user.tag}** to Trusted List`)
}