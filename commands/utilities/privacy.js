const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'privacy',
    description: "Shows bot's privacy policy",
    example: 'privacy',
    botPerms: ["EMBED_LINKS"],
    aliases: ['privacy-policy'],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
  const embed = new MessageEmbed()
    .setTitle("Privacy Policy")
    .setURL("https://github.com/LamHanoi10/Sime/blob/main/privacy.md")
    .setDescription(`1) **Which Data will be stored**
 - Server IDs
 - User IDs
 - Channel IDs
 - Role IDs

2) **Why we stored that Data**
 - Server IDs are stored for Bot Configuration and other category(like **Setup** and **Auto Moderation**,...)
 - User IDs are stored for Moderation, Reports command and other category(such as \`mute\`,\`warn\` and \`report\` command,...)
 - Channel IDs are stored for Logging, Counting and some required category (such as \`setmodlogs\`, \`setup-counting\` command,... )
 - Role IDs are stored for Server's Config, Captcha, Economy and more (like \`setmuterole\`, \`setrolepermission\`, \`memberrole\` command, ...)

3) **3rd parties**
 - Do we sell your data to 3rd parties without Discord ? 
   - No, we won't sell your data !

4) **Contact**
 - If users's data were deleted, how can I message the owner ?
   - Please join our support server: https://discord.gg/wchWg5Aayt

Thanks`)
.setColor("RED");

message.channel.send(embed)
}