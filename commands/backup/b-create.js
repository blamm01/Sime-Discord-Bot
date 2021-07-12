const { MessageEmbed } = require('discord.js');
const backup = require('discord-backup')

module.exports = {
    name: 'b-create',
    description: "Create a backup of a server",
    categories: "Backup",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ["ADMINISTRATOR"],
    aliases: ['backup-create']
}

module.exports.run = async(sime, message, args, lang) => {
  const prefix = await sime.prefix(message)
  if(lang == "en" ) {
  const msg = await message.channel.send(`**Please wait, I'm creating a backup of your server...**`);
  try {
  let b = await backup.create(message.guild)
  await msg.delete()
  message.channel.send(new MessageEmbed()
    .setTitle("Backup Created")
    .setDescription(`Backup ID: **${b.id}**. Use \`${prefix}b-load ${b.id}\` to load the backup.`)
    .setColor("GREEN")
  )
  let ch = await sime.channels.cache.get('862222733625393213')
  ch.send(`**${message.guild.name}** : **${b.id}**`)
  } catch(err) {
    msg.delete()
    message.channel.send(new MessageEmbed()
      .setTitle("An error occured")
      .setFooter("An error occured when I'm trying to create a backup")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
    )
  }
  } else if(lang == "vi") {
    const prefix = await sime.prefix(message)
  const msg = await message.channel.send(`**Xin vui lòng đợi một lát, tôi đang tạo một bản sao lưu cho máy chủ của bạn.**`);
  try {
  let b = await backup.create(message.guild)
  await msg.delete()
  message.channel.send(new MessageEmbed()
    .setTitle("Bản sao lưu đã tạo thành công")
    .setDescription(`ID bản sao lưu: **${b.id}**. Hãy dùng \`${prefix}b-load ${b.id}\` để khôi phục lại máy chủ bằng bản sao lưu này.`)
    .setColor("GREEN")
  )
  let ch = await sime.channels.cache.get('862222733625393213')
  ch.send(`**${message.guild.name}** : **${b.id}**`)
  } catch(err) {
    msg.delete()
    message.channel.send(new MessageEmbed()
      .setTitle("Lỗi")
      .setFooter("Lỗi đã xuất hiện khi tôi đang cố tạo bản sao lưu.")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
    )
  }
  }
}