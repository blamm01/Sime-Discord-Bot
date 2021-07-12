const schema = require('../../models/lockdown');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'modrole',
    usage: '<Add/Remove/View/RemoveAll>',
    description: "Settings Moderator Role",
    example: `setlockdown addall`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async (sime, message, args) => {
    const option = args[0]
    if (!option) return message.lineReply(`You need provide option first ! Option: add | remove | view | removeall`);
    if(!(["add", "remove", "view", "removeall"]).includes(option.toLowerCase()))return message.lineReply(`You need provide option first ! Option: add | remove | view | removeall`);
    const modList = await sime.mongo.get(`modRoleList_${message.guild.id}`)
    if(option.toLowerCase() == "add") {
      const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.name == args.slice(1).join(" "))
      if(!role) return message.channel.send("You need to mention role")
      if(modList && modList.find(r => r == role.id)) return message.channel.send(`Role **${role.name}** is in Moderator Role already`)
      await sime.mongo.push(`modRoleList_${message.guild.id}`, role.id);
      message.channel.send(`**${role.name}** has been added to Moderator Role.`)
    } else if(option.toLowerCase() == "view") {
      if(!modList || modList.size == 0) return message.channel.send("There is no role in Moderator Role")
      message.channel.send(new MessageEmbed()
        .setTitle("Moderator Role")
        .setDescription(`<@&${modList.join("> <@&")}>`)
        .setColor("RANDOM")
      )
    } else if(option.toLowerCase() == "remove") {
      const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.name == args.slice(1).join(" "))
      if(!role) return message.channel.send("You need to mention role")
      if(modList && (role.id).includes(modList)) return message.channel.send(`Role **${role.name}** is not in Moderator Role`)
      const newFilter = modList.filter(r => r !== role.id)

      await sime.mongo.set(`modRoleList_${message.guild.id}`, newFilter)
      message.channel.send(`**${role.name}** has been removed from Moderator Role.`)
    } else if(option.toLowerCase() == "removeall") {
      if(!modList || modList.size == 0) return message.channel.send(`There is no role on Moderator Role`)
      
      await sime.mongo.delete(`modRoleList_${message.guild.id}`)
      message.channel.send(`I have deleted all roles on Moderator Role`)
    }
}