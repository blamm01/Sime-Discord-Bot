const ms = require('ms')
const schema = require('../../models/lockdown')
const memberRoleSchema = require('../../models/memberRole')
const {
    MessageEmbed,
    WebhookClient
} = require('discord.js')
const logging = require('../../models/logging')

module.exports = {
    name: "lockdown",
    usage: '<On/Off> [Time] [Reason]',
    description: "Enable/Disable Lockdown Channels",
    example: `on 6h Bot is Offline !`,
    botPerms: ['ADMINISTRATOR'],
    userPerms: ['ADMINISTRATOR'],
    categories: 'Moderation',
}

module.exports.run = async (sime, message, args) => {
    const option = args[0]
    if (!option) return message.lineReply(`You need provide option first ! Option: on | off`);
    if(!(["on","off"]).includes(option.toLowerCase()))return message.lineReply(`You need provide option first ! Option: on | off`);
    if(option.toLowerCase() == "on") {
    const ti1 = args[0] || 'null'
    const time = ms(ti1) || "null";
    if (!Number(time)) {
        schema.find({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
            try {
                let role;
                data.map((d) => {
                    memberRoleSchema.findOne({
                        Guild: message.guild.id
                    }, async (err, data) => {
                        if (data) {
                            const role1 = message.guild.roles.cache.get(data.Role)
                            if (!role1) role = message.guild.roles.everyone
                            if (role1) role = role1
                        } else if (!data) {
                            role = message.guild.roles.everyone;
                        }
                        const channel = message.guild.channels.cache.get(d.Channel);
                        channel.updateOverwrite(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        }, `Lockdown Enabled - ${message.author.tag}`)
                    })
                })
                message.lineReply(`🔨 Locked Down All Channels in Lockdown Channel`)
                const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Lockdown",
            description: `**${message.author.tag}** locked down all the channels in Lockdown Channels`,
            color: "RED",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
            } catch (err) {
                message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"));
            }
        })
    } else if (Number(time)) {
        schema.find({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
            try {
                let role;
                data.map(async (d) => {
                    await memberRoleSchema.findOne({
                        Guild: message.guild.id
                    }, async (err, data) => {
                        if (data) {
                            const role1 = message.guild.roles.cache.get(data.Role)
                            if (!role1) role = message.guild.roles.everyone
                            if (role1) role = role1
                        } else if (!data) {
                            role = message.guild.roles.everyone;
                        }
                        const channel = await message.guild.channels.cache.get(d.Channel);
                        await channel.updateOverwrite(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        }, `Lockdown Enabled - ${message.author.tag}`)
                    })
                })
                message.lineReply(`🔨 Locked Down All Channels in Lockdown Channel for **${ms(time, { long: true })}**`)
            } catch (err) {
                message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"));
            }
            const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Lockdown",
            description: `**${message.author.tag}** locked down all the channels in Lockdown Channels for **${ms(time, { long: true })}**`,
            color: "RED",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
        })
        setTimeout(async () => {
            schema.find({
                Guild: message.guild.id
            }, async (err, data) => {
                if (!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
                try {
                    data.map(async (d) => {
                        await memberRoleSchema.findOne({
                            Guild: message.guild.id
                        }, async (err, data) => {
                            if (data) {
                                const role1 = message.guild.roles.cache.get(data.Role)
                                if (!role1) role = message.guild.roles.everyone
                                if (role1) role = role1
                            } else if (!data) {
                                role = message.guild.roles.everyone;
                            }
                        })
                        const channel = await message.guild.channels.cache.get(d.Channel);
                        await channel.updateOverwrite(role, {
                            SEND_MESSAGES: null,
                            ADD_REACTIONS: null
                        }, `Lockdown Duration Expired - ${message.author.tag}`)
                    })
                } catch (err) {
                    console.log(err)
                }
            })
        })
    }
} else if(args[0].toLowerCase() == 'off') {
    schema.find({
        Guild: message.guild.id
    }, async (err, data) => {
        if (!data) return message.lineReply(`:x: There is no channel in Lockdown Channel`)
        try {
            let role;
            data.map((d) => {
                memberRoleSchema.findOne({
                    Guild: message.guild.id
                }, async (err, data) => {
                    if (data) {
                        const role1 = message.guild.roles.cache.get(data.Role)
                        if (!role1) role = message.guild.roles.everyone
                        if (role1) role = role1
                    } else if (!data) {
                        role = message.guild.roles.everyone;
                    }
                    const channel = message.guild.channels.cache.get(d.Channel);
                    channel.updateOverwrite(role, {
                        SEND_MESSAGES: null,
                        ADD_REACTIONS: null
                    }, `Lockdown Disabled - ${message.author.tag}`)
                })
            })
            message.lineReply(`🔨 Unlocked Down All Channels in Lockdown Channel`)
            
        } catch (err) {
            message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"));
        }
        const data1 = await logging.findOne({ Guild: message.guild.id })
    if(!data1 || !data1.Channel || !data1.WebhookID || !data1.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data1.WebhookID,
        data1.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Unlockdown",
            description: `**${message.author.tag}** unlocked all the channels in Lockdown Channels`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data1.delete() })
    })
}
}