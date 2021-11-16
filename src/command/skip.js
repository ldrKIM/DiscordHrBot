import Command from '../command.js';

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            description: 'Skip!',
            aliases: ['fs']
        });
    }

    async execute(client, msg) {
    }
}