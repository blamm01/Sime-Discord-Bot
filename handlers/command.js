const { readdirSync } = require('fs');
const sime = require('..');
module.exports = (sime) => {
readdirSync('./commands/').forEach(dir => {
    let commands = readdirSync(`./commands/${dir}`).filter(files => files.endsWith('.js'));
    for(let file of commands) {
        let pull = require(`../commands/${dir}/${file}`);
        if(pull.name) {
            sime.commands.set(pull.name, pull);
            console.log(`${file}: Loaded command with name: ${pull.name}`)
        } else {
            console.log(`${file}: No command name set !`);
        }
        if(pull.aliases && Array.isArray(pull.aliases)) { 
        pull.aliases.forEach(alias => { 
        sime.aliases.set(alias, pull.name)
        console.log(`${file}: Loaded command aliases: ${alias}`)
        })
        }
    }
})
}