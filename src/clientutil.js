export default class ClientUtil {
    constructor(client) {
        this.client = client;
    }

    canModifyQueue(message, member) {
        const { channelID } = member ? member.voice : message.member.voice;
        const botChannel = message.member.guild.me.voice.channelID;

        if (channelID !== botChannel) {
            message.channel.send('You need to be in the same channel as the bot to use this command.');
            return undefined;
        }

        return true;
    }
}