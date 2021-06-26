const schema = require('../../models/items')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'add-item',
    categories: 'Economy',
    aliases: ['additem','makeitem'],
    description: "Make an item",
    example: 'add-item',
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    let currency = db.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await db.set(`currency_${message.guild.id}`, `🪙`); 
    currency = db.get(`currency_${message.guild.id}`) 
}
    const filter = msg => msg.author.id == message.author.id;
    const options = {
         max: 1
    };
    message.lineReply(`Please provide item name.`)
    let name = await message.channel.awaitMessages(filter, options);
    let data1 = await schema.findOne({ Guild: message.guild.id, Name: name.first().content })
    if(data1) return message.lineReply(`There is a item called **${name.first().content}**`)
    message.lineReply(`Please provide item price`)
    let price = await message.channel.awaitMessages(filter, options);
    if(!Number(price.first().content)) return message.lineReply(`Price is not a number !`);
    
    message.lineReply(`Please provide item description`)
    let description = await message.channel.awaitMessages(filter, options);
    
    message.lineReply(`Please provide role the user will claim. Type \`null\` if you don't want to set`)
    let rolegive = await message.channel.awaitMessages(filter, options);
    const role = await message.guild.roles.cache.find(role => role.name === rolegive.first().content) || message.guild.roles.cache.find(role => role.id === rolegive.first().content) || rolegive.first().mentions.roles.first() || '0'
    message.lineReply(`Please provide role the user required to have. Type \`null\` if you don't want to set`)
    let rolerequire = await message.channel.awaitMessages(filter, options);
    const role1 = await message.guild.roles.cache.find(role => role.name === rolerequire.first().content) || message.guild.roles.cache.find(role => role.id === rolerequire.first().content) || rolerequire.first().mentions.roles.first() || '0'
    message.lineReply(`Please provide role the user will lost. Type \`null\` if you don't want to set`)
    let roleremove = await message.channel.awaitMessages(filter, options);
    const role2 = await message.guild.roles.cache.find(role => role.name === roleremove.first().content) || message.guild.roles.cache.find(role => role.id === roleremove.first().content) || roleremove.first().mentions.roles.first() || '0'
    if(!role) role.id = '0';
    if(!role1) role1.id = '0';
    if(!role2) role2.id = '0'
    new schema({
        Guild: message.guild.id,
        Name: name.first().content,
        Price: parseInt(price.first().content),
        Description: description.first().content,
        RoleGive: role.id,
        RoleRequire: role1.id,
        RoleRemove: role2.id
    }).save()
    message.lineReply(new MessageEmbed().setColor("GREEN").setTitle(`Item Information`).addField(`Name`, name.first().content, true).addField(`Description`, description.first().content, true).addField(`Price`, `${currency} ${price.first().content}`, true).addField(`Role Require`, `${role1}`, true).addField(`Role Give`, `${role}`, true).addField(`Role Remove`, `${role2}`, true).setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}