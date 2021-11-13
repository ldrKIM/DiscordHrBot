import Command from '../command.js';

export default class PlayCommand extends Command {
    constructor() {
        super('play', {
            description: 'Play!'
        });
    }

    async execute(message) {
        const msg = await message.channel.send('Play...');
    }
}