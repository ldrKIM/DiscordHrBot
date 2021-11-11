import { Intents } from 'discord.js';
import secret from '../secret.js';
import DiscordClient from './client.js';

const CustomClient = new DiscordClient({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES]
});

CustomClient.start(secret.BOT_LOGIN_TOKEN);

