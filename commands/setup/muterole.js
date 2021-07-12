const schema = require('../../models/muteRole');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'muterole',
    usage: '<Set/Check/Delete/Create>',
    description: "Sets Mute Role",
    example: `muterole set 843172355891396619`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args) => {
    const option = args[0];
    if(!option) return message.lineReply(`You need provide option first ! Option: set | check | delete | create`);
    if(!["set","check","delete","create"].includes(option.toLowerCase())) return message.lineReply(`You need provide option first ! Option: set | check | delete | create`);
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
    } else if(option.toLowerCase() == 'create') {
      message.channel.send("Now, specify mute role name")
      const filter = (msg) => msg.author.id == message.author.id;
      const option = {
        max: 1
      }
      let roleAwait = await message.channel.awaitMessages(filter, option)
      const roleName = roleAwait.first().content
      const roleE = await message.guild.roles.create({
        data: {
          name: roleName,
          permissions: []
        }
      })
      const role = await message.guild.roles.cache.find(r => r.name == roleName)
      await message.guild.channels.cache.filter(c => c.type == "text").map(c => {
        c.updateOverwrite(role.id, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        })
      })
      await message.guild.channels.cache.filter(c => c.type == "voice").map(c => {
        c.updateOverwrite(role.id, {
          SPEAK: false
        })
      })

        schema.find(guild, async(err, data) => {
            data.map(d => d.delete())
        })
        new schema({
                Guild: message.guild.id,
                Role: role.id
        }).save()
        message.lineReply(`I have created Mute Role: ${role}`)
    }
}