import Command from '../command.js';

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            description: 'Skip!'
        });
    }

    async execute(message) {
        const msg = await message.channel.send('skip...');
    }
}