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

module.exports.run = async (sime, message, args, lang) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(lang == "en") {
  if(da == false) return message.channel.send(`${sime.emoji.error} This server is not enabled Anti Raid module`)
  const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!member) return message.channel.send(`${sime.emoji.error} You need mention member first !`)
  if(message.member.roles.highest.position <= message.guild.me.roles.highest.position && message.author.id !== message.guild.owner.id) return message.channel.send(`${sime.emoji.error} You can't use this command because your highest role is lower or equal Sime's highest role`)
   let trustedusers = await sime.mongo.get(`trustedusers_${message.guild.id}`)
  if(trustedusers && trustedusers.find(find => find.user == member.id)) {
        return message.channel.send(`${sime.emoji.error} **${member.user.tag}** is in Trusted List already`)
  }
  let data = {
    user: member.id
}
  await sime.mongo.push(`trustedusers_${message.guild.id}`,data)
  message.channel.send(`${sime.emoji.success} I have added **${member.user.tag}** to Trusted List`)
  } else if(lang == "vi") {
  if(da == false) return message.channel.send(`${sime.emoji.error} Máy chủ này chưa bật \`Anti Raid\``)
  const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!member) return message.channel.send(`${sime.emoji.error} Bạn phải đề cập tới một thành viên`)
  if(message.member.roles.highest.position <= message.guild.me.roles.highest.position && message.author.id !== message.guild.owner.id) return message.channel.send(`${sime.emoji.error} Bạn không thể sử dụng lệnh này vì vai trò cao nhát của bạn thấp hơn hoặc bằng vai trò cao nhất của tôi`)
   let trustedusers = await sime.mongo.get(`trustedusers_${message.guild.id}`)
  if(trustedusers && trustedusers.find(find => find.user == member.id)) {
        return message.channel.send(`${sime.emoji.error} **${member.user.tag}** đã là thành viên được tin tưởng`)
  }
  let data = {
    user: member.id
}
  await sime.mongo.push(`trustedusers_${message.guild.id}`,data)
  message.channel.send(`${sime.emoji.success} Tôi đã thêm **${member.user.tag}** vào Danh sách tin tưởng`)
}
}