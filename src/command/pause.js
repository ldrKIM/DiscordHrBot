import Command from './../command.js'

export default class PauseCommand extends Command {
    constructor() {
        super('pause', {
            description: 'Pauses the currently playing song.',
            category: 'Music',
            aliases: ['pu'],
        });
    }

    async execute(message) {
        const { guild, channel } = message;
        const serverQueue = this.client.queue.get(guild.id);
        if (!serverQueue) return channel.send('There is currently no queue for this guild.');
        if (!this.client.util.canModifyQueue(message)) return;
        if (!serverQueue.playing) return channel.send('The music is already paused.');
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        channel.send('⏸️ Now paused the music.');
    }
}