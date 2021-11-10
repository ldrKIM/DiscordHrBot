import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import secret from '../secret.js';
import config from '../config.js';
import { onMessage, onReady } from "./msgeventhandler.js";

dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES]
});

client.login(secret.BOT_LOGIN_TOKEN);

client.on('ready', () => onReady(client));
client.on("messageCreate",msg => onMessage(client, msg));

