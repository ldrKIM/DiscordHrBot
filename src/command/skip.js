import Command from '../command.js';

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            description: 'Skip!',
            aliases: ['fs']
        });
    }

    async execute(client, msg) {
        const { guild, channel } = msg;
        const serverQueue = this.client.queue.get(guild.id);
        if (!serverQueue) return channel.send('There is currently no guild in this guild.');
        if (!this.client.util.canModifyQueue(msg)) return;
        serverQueue.connection.dispatcher.end();
        channel.send('⏭️ Skipped the current playing song.');
    }
}