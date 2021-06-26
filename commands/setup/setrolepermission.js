const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'setrolepermission',
    usage: '<Staff/Moderator || (No Provide = Delete)>',
    description: "Settings role permission",
    example: `setrolepermission Moderator @Server Moderators`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args) => {
    const option = args[0];
    if(!option) return message.lineReply(`There are role permission\n\n **Staff - Can chat in locked channel which locked by Sime\nModerator - Able to use ALL Moderation Commands \n**`);
    if(!["staff","moderator"].includes(option.toLowerCase())) return message.lineReply(`You need provide role permission ! Permission: Staff | Helper | Moderaor | Admin`);
    const guild = { Guild: message.guild.id }
    if(option.toLowerCase() == 'staff') {
      const oldDatabase = await sime.mongo.get(`staffRole_${message.guild.id}`) || '0'
        const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name == args[1])
      if(!role) {
        await sime.mongo.delete(`staffRole_${message.guild.id}`)
        return message.channel.send(`Deleted Staff Role`)
      }
        await sime.mongo.set(`staffRole_${message.guild.id}`, role.id)
        .catch(err => message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED")))
        .then(message.channel.send(new MessageEmbed().setDescription(`Staff Role Set: ${role}`).setColor("GREEN")))
    } else if(option.toLowerCase() == 'moderator') {
        const oldDatabase = await sime.mongo.get(`helperRole_${message.guild.id}`) || '0'
        const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name == args[1])
      if(!role) {
        await sime.mongo.delete(`modRole_${message.guild.id}`)
        return message.channel.send(`Deleted Moderator Role`)
      }
        await sime.mongo.set(`modRole_${message.guild.id}`, role.id)
        .catch(err => message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED")))
        .then(message.channel.send(new MessageEmbed().setDescription(`Moderator Role Set: ${role}`).setColor("GREEN")))
    }
}