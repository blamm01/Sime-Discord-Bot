const message = require("../../events/message");
const ms = require('ms')

module.exports = {
    name: 'gstart',
    description: "Starts a giveaway",
    categories: "Giveaway",
    example: 'gstart #giveaways 3d 2 Tester',
    usage: '<Channel> <Duration> <Winners> <Prize>',
    userPerms: ['MANAGE_MESSAGES']
}

module.exports.run = async(sime, message, args) => {
 
 // Giveaway Channel
 let giveawayChannel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(f => f.name == args[0])
        
 // if no channel is mentioned
 if (!giveawayChannel) {
     return message.lineReply(':x: You need mention channel first !')
 }


 let giveawayDuration = args[1];

 if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
     return message.lineReply(':x: You need provide valid duration | Like: 3d , 1w')
 }

 let giveawayNumberWinners = args[2];

 if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
     return message.lineReply(':x: You need provide winners count')
 }

 let giveawayPrize = args.slice(3).join(' ');

 if(!giveawayPrize) {
     return message.lineReply(':x: You need provide prize for the giveaway')
 }

 // Start the giveaway
  await sime.giveaways.start(giveawayChannel, {
    time: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: parseInt(args[2]),
    messages: {
        giveaway: "**🎉 New Giveaway 🎉**",
        giveawayEnded: "**🎉 Giveaway Ended 🎉**",
        timeRemaining: `Time left: **{duration}**!\nHosted by: ${message.author}\nTotal Winner(s): ${parseInt(args[2])}`,
        inviteToParticipate: "React with 🎉 to enter this giveaway",
        winMessage: "🎉 Congratulations, {winners}! You won **{prize}**! 🎉",
        embedFooter: `Created In: ${message.channel.name}`,
        noWinner: `:x: There are no correct participations\nHosted by: ${message.author}`,
        winners: `Winner(s)`,
        endedAt: "Ended at",
        units: {
            seconds: "seconds",
            minutes: "minutes",
            hours: "hours",
            days: "days",
            pluralS: false
        }
    }
});
if(giveawayChannel == message.channel) return;
message.channel.send(`✅ Giveaway **${giveawayPrize}** is starting in **${giveawayChannel}**`)

}

