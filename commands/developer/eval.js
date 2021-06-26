const Discord = require('discord.js');

module.exports = {
    name: 'eval',
    description: "Eval Command",
    usage: '<Code>',
    aliases: ['eval'],
    categories: 'Developer',
    developerOnly: true,
    example: 'eval sime.guilds.cache.size'
}
module.exports.run = async(sime, message, args) => {
        let process = args.join(' ');
        if (!process) {
            return message.lineReply('Please give a code to evaluate!');
        }
        let e;
        try {
            e = eval(process);
        } catch (err) {
            e = err;
        }
        let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .addField('Input', `\`\`\`${process}\`\`\``)
            .addField('Output', `\`\`\`${e}\`\`\``)
            .addField('Type', `\`\`\`${typeof e}\`\`\``);
        message.lineReply(embed);
    }