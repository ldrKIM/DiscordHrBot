import { Client, Intents } from 'discord.js';
import config from '../config.js';

export function onMessage(client, msg) {
    if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;

    const commandBody = msg.content.slice(config.prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
}

export async function onReady(client) {
    await console.log(`Logged in as ${client.user.username}!`);
}