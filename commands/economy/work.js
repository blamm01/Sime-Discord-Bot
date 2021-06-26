const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'work',
    categories: 'Economy',
    description: "Go to work !",
    cooldown: 30,
    example: 'work'
}

module.exports.run = async(sime, message, args) => {
    const member = message.member
    const coins = Math.floor(Math.random() * 1000) + 1;
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) {
        await sime.mongo.set(`currency_${message.guild.id}`, `🪙`)
        currency = await sime.mongo.get(`currency_${message.guild.id}`)
    }
    const jobs = ['Developer','Youtuber','Waiter','Builder','Taxi Driver','Bus Driver','Doctor','Mechanic','Nurse','Murderer']
    const jobIndex = Math.floor(Math.random() * jobs.length);
    const randomJob = jobs[jobIndex]
    let oldBal = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0';
    if(oldBal == 0) {
        let coinadd = await sime.mongo.set(`balance_${member.id}_${message.guild.id}`, coins)
    } else {
        let coinadd = await sime.mongo.add(`balance_${member.id}_${message.guild.id}`, coins)
    }
    let newBal = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`)
    let message1 = [`Congrats ! You worked as **${randomJob}** and the manager gave you **${currency} ${coins}**. Now, you have **${currency} ${newBal}**`, `You are **${randomJob}** and the Manager gave you **${currency} ${coins}**. I hope you happy because your balance is **${currency} ${newBal}**`, `You worked very hard so you were given **${currency} ${coins}**. And, You have **${currency} ${newBal}**`]
    const messageIndex = Math.floor(Math.random() * message1.length);
    const randomMessage = message1[messageIndex] 
    message.lineReply(new MessageEmbed().setTitle(`Work Successfully`).setDescription(randomMessage).setColor("GREEN").setTimestamp().setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}