const Discord = require('discord.js');
const { token } = require('../../config.json')

module.exports = {
    name: 'restart',
    description: "Restart the bot",
    aliases: ['reset'],
    categories: 'Developer',
    developerOnly: true,
}
module.exports.run = async(sime, message, args) => {
       let msg = await message.channel.send(new Discord.MessageEmbed().setTitle(`Restart Confirmation`).setDescription(`My Developer, You sent a restart request. You have 2 choices\n\n🟢 Restart ${sime.user.username}\n🔴 Cancel the request\n\n**Remember, You have 60 seconds**`).setColor("ORANGE"));
    await msg.react('🔴')
    await msg.react('🟢')
    const filter = (reaction, user) => user.id === message.author.id;
    let collector = await msg.createReactionCollector(filter, { time: 60000 })
    collector.on('collect', async(r) => {
            if(r.emoji == '🔴') {
                await message.channel.send(`Confirmed. Goodbye, I will be online soon...`)
                collector.stop('done')
                await sime.destroy()
                await sime.login(token)
            } else if(r.emoji == '🔴') {
                message.channel.send(`Cancelled. I won't be offline`)
                 collector.stop('done')
            }
    })
    }