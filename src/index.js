const { Client, Intents } = require('discord.js');
const config = require("../config.json");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES]
});

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.BOT_TOKEN);