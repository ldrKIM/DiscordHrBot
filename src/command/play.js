import Command from '../command.js';
import ClientUtil from "../clientutil";
import ytdl from 'ytdl-core';
import ytdlDiscord from 'ytdl-core-discord';

export default class PlayCommand extends Command {
    constructor() {
        super('play', {
            description: 'Play!',
            aliases: ['p']
        });
    }

    async execute(client, msg, commandArgs) {
        const { voice, guild } = msg.member;
        let queue = client.queue.get(guild.id);
        if (queue && !client.util.canModifyQueue(msg)) return;
    }


}