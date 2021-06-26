const schema = require('../../models/muteRole');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'muterole',
    usage: '<Set/Check/Delete>',
    description: "Sets Mute Role",
    example: `muterole set 843172355891396619`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args) => {
    const option = args[0];
    if(!option) return message.lineReply(`You need provide option first ! Option: set | check | delete`);
    if(!["set","check","delete"].includes(option.toLowerCase())) return message.lineReply(`You need provide option first ! Option: set | check | delete`);
    const guild = { Guild: message.guild.id }
    if(option.toLowerCase() == 'set') {
        const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name == args[1])
        if(!role) return message.lineReply(`You need mention role to continue.`)
        schema.findOne(guild, async(err, data) => {
            if(err) throw new error(err);
            if(data) await data.delete();
            new schema({
                Guild: message.guild.id,
                Role: role.id
            }).save()
            .catch(err => message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED")))
            message.lineReply(`Mute Role Set: **${role.name}**`)
        })
    } else if(option.toLowerCase() == 'delete') {
        schema.findOne(guild, async(err, data) => {
            if(err) throw new error(err);
            if(!data) return message.lineReply(`There is no mute role set.`)
            data.delete()
            .catch(err => message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED")))
            message.lineReply(`Mute Role Deleted`)
        })
    } else if(option.toLowerCase() == 'check') {
        schema.findOne(guild, async(err, data) => {
            if(err) throw new error(err);
            if(!data) return message.lineReply(`There is no mute role set.`)
            const role = await message.guild.roles.cache.find(r => r.id == data.Role);
            if(!role) return message.lineReply(`There is no Role found with ID: \`${data.Role}\``)
            message.lineReply(`Mute Role: **${role.name}**`)
        })
    }
}