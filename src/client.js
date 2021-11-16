import {Client, Collection} from 'discord.js';
import YouTube from 'simple-youtube-api';
import ClientUtil from './clientutil';
import secret from '../secret.js';
import fs from 'fs';
import config from "../config.js";

export default class DiscordClient extends Client {
    constructor(options) {
        super(options);

        this.queue = new Map();
        this.commands = new Collection();
        this.youtube = new YouTube(secret.YOUTUBE_TOKEN);
        this.util = new ClientUtil(this);
        this.setCommand('command');
        this.once('ready', () => this.onReady(this));
        this.on("messageCreate",msg => this.onMessage(this, msg));
    }

     setCommand() {
        const FilePath = './src/command';
        const commandFileList = fs.readdirSync(FilePath).filter(file => file.endsWith('.js'));

        if (commandFileList.length) {
            commandFileList.forEach(async (file) => {
                const srcDir = './command/' + file;
                let module;
                await import(srcDir)
                    .then((s) => {
                        module = new s.default();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                this.commands.set(module.name, module);
            });
        }
    }

    async onReady(client) {
        await console.log(`Logged in as ${client.user.username}!`);
    }

    async onMessage(client, msg) {
        if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;

        const [commandType, ...commandArgs] = msg.content.slice(config.prefix.length).trim().toLowerCase().split(' ');
        const command = this.commands.get(commandType) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandType));

        if (!command) return;
        try {
            await command.execute(client, msg, commandArgs);
        }
        catch (e) {
            console.error(e);
            msg.reply('there was an error trying to execute that command!');
        }
    }

    checkSameChannel(message, member) {
        const channelID = member ? member.voice : message.member.voice;
        const botChannel = message.member.guild.me.voice.channelId;

        if (channelID !== botChannel) {
            message.channel.send('You need to be in the same channel as the bot to use this command.');
            return undefined;
        }

        return true;
    }

    start(token) {
        this.login(token);
    }
}

