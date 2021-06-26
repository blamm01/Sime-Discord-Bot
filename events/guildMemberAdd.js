const muteDatabase = require('../models/punishment')
const muteRole = require('../models/muteRole')
const createCaptcha = require('./captcha');
const captchaSystem = require('../models/captcha')
const db = require('quick.db')
const fs = require('fs')

const sime = require('../index');

module.exports = async(sime, member) => {
    muteDatabase.findOne({ Guild : member.guild.id, User: member.id}, async(err,data1) => {
        if(!data1) return;
            muteRole.findOne({ Guild: member.guild.id }, async(err,data) => {
                let roleMember;
                if(!data) {
                roleMember = 'null'
                } else if(data) {
                    roleMember = member.guild.roles.cache.get(data.Role)
                    if(!roleMember) roleMember = 'null';
                }
                if(roleMember !== 'null') {
                    member.roles.add(roleMember, `This member is muted but he/she left and rejoined. Punishment ID: ${data1.ID}`)
                }
            })
    })
    captchaSystem.findOne({ Guild: member.guild.id }, async(err, data) => {
    if(!data) return;
    const roleVerified = member.guild.roles.cache.get(data.Role)
    if(!roleVerified) return;
    const captcha = await createCaptcha();
    try {
        const msg = await member.send('Enter the captcha below.', {
            files: [{
                attachment: `${__dirname}/captchas/${captcha}.png`,
                name: `${captcha}.png`
            }]
        });
        try {
            const filter = m => m.author.id == member.id
            const response = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']});
            if(response.first().content == captcha) {
                await member.send(':white_check_mark: You entered correct captcha ! Just wait me a second');
                await member.roles.add(roleVerified, `Captcha Correct`);
                await fs.unlink(`${__dirname}/captchas/${captcha}.png`)
                  .catch(err => console.log(err));
            } else if(response.first().content !== captcha) {
                await member.send(`:x: You entered incorrect captcha ! Kicking...`)
                await member.kick(`Captcha Incorrect`)
                return;
            }
        } catch(err) {
            console.log(`Oops ${member.id} didn't enter the code. But it's ok !`)
        }
    } catch(err) {
        await console.log(`I can't DM that user`)
    }
})
if(db.has(`autorole_${member.guild.id}`)) {
  const role = await member.guild.roles.cache.find(r => r.id == db.get(`autorole_${member.guild.id}`))
  if(!role) return;
  if(member.roles.cache.get(role.id)) return;
  try {
    member.roles.add(role)
  } catch(err) {
    member.send(new MessageEmbed()
      .setTitle(`An error occured`)
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
      .setFoooter(`An error occured when I'm trying to give you role`)
  )
  }
}
}
