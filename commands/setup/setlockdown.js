const schema = require('../../models/lockdown');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'setlockdown',
    usage: '<Add/Remove/View/RemoveAll/AddAll>',
    description: "Settings Lockdown Channel",
    example: `setlockdown addall`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async (sime, message, args) => {
    const option = args[0]
    if (!option) return message.lineReply(`You need provide option first ! Option: add | remove | view | addall | removeall`);
    if(!(["add", "remove", "view", "removeall", "addall"]).includes(option.toLowerCase()))return message.lineReply(`You need provide option first ! Option: add | remove | view | addall | removeall`);
    const guild = {
        Guild: message.guild.id
    }
    if (option.toLowerCase() == "add") {
        const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.channel
        schema.findOne({ Guild: message.guild.id, Channel: channel.id }, async (err, data) => {
            if (!data) {
                new schema({
                    Guild: message.guild.id,
                    Channel: channel.id
                }).save()
                message.lineReply(`✅ Added ${channel} to Lockdown Channel`)
            } else if(data) {
                message.lineReply(`:x: ${channel} is already in Lockdown Channel`)
            }
        })
    } else if (option.toLowerCase() == "remove") {
        const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.channel
        schema.findOne({ Guild: message.guild.id, Channel: channel.id }, async (err, data) => {
            if (!data) return message.lineReply(`:x: ${channel} is not in Lockdown Channel`)
            data.delete()
            message.lineReply(`✅ Removed ${channel} from Lockdown Channel`)
        })
    } else if(option.toLowerCase() == "view") {
        schema.find(guild, async (err, data) => {
            if (!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
            const embed = new MessageEmbed().setTitle(`Lockdown Channel`).setColor("BLUE")
            let amount = 1
            data.map((d) => {
                embed.addField(`${amount} | Channel:`,`<#${d.Channel}>`);
                amount = amount + 1
            })
            message.lineReply(embed)
        })
    } else if (option.toLowerCase() == "addall") {
        schema.find(guild, async (err, data) => {
        data.map((d) => d.delete())
        message.guild.channels.cache.filter(c => c.type == 'text').forEach(c => {
            new schema({
                Guild: message.guild.id,
                Channel: c.id
            }).save()
        })
        message.lineReply(`✅ Added All Channels to Lockdown Channel`)
        })
    } else if (option.toLowerCase() == "removeall") {
        schema.find(guild, async (err, data) => {
        if(!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
        data.map((d) => d.delete())
        message.lineReply(`✅ Removed All Channels to Lockdown Channel`)
        })
    }
}