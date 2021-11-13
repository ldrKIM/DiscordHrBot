import Command from '../command.js';

export default class PingCommand extends Command {
    constructor() {
        super('ping', {
            description: 'Pong!'
        });
    }

    async execute(message) {
        const msg = await message.channel.send('Pinging...');
    }
}