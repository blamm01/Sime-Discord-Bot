const { fight } = require('weky')

module.exports = {
    name: 'fight',
    description: "Fight with a user (Under Maintenance)",
    example: `fight @NiceDD`,
    categories: 'Fun',
    usage: '<Member>',
    developerOnly: true,
}

module.exports.run = async(sime, message, args) => {
     const oppenent = await message.mentions.users.first() || message.guild.users.cache.get(args[0])
    if (!oppenent) return message.lineReply(`Please mention who you want to fight`);
    const x = new fight({
    client: sime,
    message: message,
    acceptMessage: `Hey ${oppenent}, ${message.author} want to fight with you !! React with :white_check_mark: to accept`,
    challenger: message.author,
    opponent: oppenent,
    hitButtonText: 'Attack',
    hitButtonColor: 'red',
    healButtonText: 'Protect',
    healButtonColor:  'green',
    cancelButtonText: 'Stop',
    cancelButtonColor: 'blurple',
})
x.start()
}