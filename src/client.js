import {Client, Collection} from 'discord.js';
import YouTube from 'simple-youtube-api';
import secret from '../secret.js';
import glob from 'glob';
import FileResolve from 'path';
import {onMessage, onReady} from "./msgeventhandler.js";

export default class DiscordClient extends Client {
    constructor(options) {
        super(options);

        this.queue = new Map();
        this.commands = new Collection();
        this.youtube = new YouTube(secret.YOUTUBE_TOKEN);
        this.setCommand();
        this.once('ready', () => onReady(this));
        this.on("messageCreate",msg => onMessage(this, msg));
    }

    setCommand() {
        const commandFiles = glob.sync('./src/command/*.js');

        for (let commandFilePath of commandFiles) {
            commandFilePath = FileResolve.resolve(commandFilePath);
            console.log(commandFilePath);

            //파일 가져와야 하는 부분
            let File = null;
            import(commandFilePath).then((importedModule) => {
                File = importedModule;
            })

            console.log(File);

            const command = new File(this);
            command.client = this;
            this.commands.set(command.name, command);
        }
    }

    start(token) {
        this.login(token);
    }
}

