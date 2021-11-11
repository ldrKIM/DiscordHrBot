import Command from '../command';

export class PingCommand extends Command {
    constructor() {
        super('ping', {
            description: 'Pong!'
        });
    }

    async excute(message) {
        const msg = await message.channel.send('Pinging...');
    }
}