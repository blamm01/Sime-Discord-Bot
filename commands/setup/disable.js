const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'disable',
    usage: '<Command>',
    description: "Disable a command",
    example: `disable role`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args, lang) => {
  if(lang == "en") {
    const choice = args[0];
    if(!choice) return message.lineReply("You need to provide command name");
    const command = await sime.commands.get(choice.toLowerCase())
    if(!command) return message.lineReply(`There is no command called **${choice.toLowerCase()}**`)
    if(command.name == "disable" || command.name == "enable") return message.lineReply("`disable` and `enable` command can't be disabled or enabled")
    const disableList = await sime.mongo.get(`disabled_${message.guild.id}`)
    if(disableList && disableList.find(c => c == command.name)) return message.lineReply(`**${command.name}** command is disabled already`);
    await sime.mongo.push(`disabled_${message.guild.id}`, command.name);
    message.lineReply(`**${command.name}** command has been disabled`)
  } else if (lang == "vi") {
    const choice = args[0];
    if(!choice) return message.lineReply("Bạn phải ghi lệnh cần tắt");
    const command = await sime.commands.get(choice.toLowerCase())
    if(!command) return message.lineReply(`Tôi không tìm thấy lệnh nào gọi là **${choice.toLowerCase()}**`)
    if(command.name == "disable" || command.name == "enable") return message.lineReply("Bạn không thể tắt hoặc bật lệnh `disable` và `enable`")
    const disableList = await sime.mongo.get(`disabled_${message.guild.id}`)
    if(disableList && disableList.find(c => c == command.name)) return message.lineReply(`Lệnh **${command.name}** đã bị tắt trước đó`);
    await sime.mongo.push(`disabled_${message.guild.id}`, command.name);
    message.lineReply(`Lệnh **${command.name}** đã được tắt thành công`)
  }
}