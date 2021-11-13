import {Client, Collection} from 'discord.js';
import YouTube from 'simple-youtube-api';
import secret from '../secret.js';
import fs from 'fs';
import path from 'path';
import {onMessage, onReady} from "./msgeventhandler.js";

export default class DiscordClient extends Client {
    constructor(options) {
        super(options);

        this.queue = new Map();
        this.commands = new Collection();
        this.youtube = new YouTube(secret.YOUTUBE_TOKEN);
        this.setCommand('command');
        this.once('ready', () => onReady(this));
        this.on("messageCreate",msg => onMessage(this, msg));
    }

     setCommand() {
        const FilePath = './src/command';
        const commandFileList = fs.readdirSync(FilePath).filter(file => file.endsWith('.js'));
        //this.getCommand(commandFileList, 'command');

        if (commandFileList.length) {
            commandFileList.forEach(async (file) => {
                const srcDir = './command/' + file;
                let module;
                console.log(srcDir);
                await import(srcDir)
                    .then((s) => {
                        console.log(s);
                        module = new s.default();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                console.log(module)
                this.commands.set(module.name, module);
            });
        }
    }

    async getCommand(commandFileList, directory) {
        if (commandFileList.length) {
            const srcDir = 'file://' + path.resolve() + '/src';
            console.log(`${srcDir}/${directory}/`);
            const commandModuleList = commandFileList.map(filename => import(`${srcDir}/${directory}/${filename}`));
            const resolvedModules = await Promise.all(commandModuleList);
            const ready = resolvedModules.map(module => {
                const { name, action, description = '' } = module.default;
                if (name && action) return [name, { action, description }];
            });

            return Client.Collection()
        }
    }

    start(token) {
        this.login(token);
    }
}

