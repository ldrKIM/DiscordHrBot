import Command from '../command.js';

export default class PingCommand extends Command {
    constructor() {
        super('ping', {
            description: 'Pong!'
        });
    }

    async execute(client, msg) {
        console.log(client);
        await msg.channel.send("Your Ping is " + msg.createdTimestamp + ", Bot's ping is " + client.ws.ping);

    }
}