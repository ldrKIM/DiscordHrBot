import Command from '../command.js';
import secret from '../secret.js';
import ytdl from 'ytdl-core';
import ytdlDiscord from 'ytdl-core-discord';
import YoutubeSearch from 'youtube-node'

export default class PlayCommand extends Command {
    constructor() {
        super('play', {
            description: 'Play!',
            aliases: ['p']
        });
    }

    async execute(client, msg, commandArgs) {
        const { voice, guild } = msg.member;
        let serverQueue = client.queue.get(guild.id);
        if (serverQueue && !client.util.canModifyQueue(msg)) return;

        const searchString = commandArgs.join(' ');
        if (!searchString) return msg.channel.send(' ');

        const handleVideo = async(url, playlist = false) => {
            try {
                let songInfo = await ytdl.getBasicInfo(url);

                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds
                };

                if (!serverQueue) {
                    const queueConstruct = {
                        guild: guild,
                        voiceChannel: voice.channel,
                        songs: [song],
                        connection: null,
                        volume: 100,
                        playing: true,
                        loop: null,
                        message: null,
                    };

                    this.client.queue.set(guild.id, queueConstruct);
                    play(queueConstruct.songs[0]);
                }
                else {
                    serverQueue.songs.push(song);
                    if (!playlist) msg.channel.send(`♬${song.title}`);
                }
            }
            catch (e) {
                console.log(e);
            }

        }

        const play = async(song) => {
            serverQueue = this.client.queue.get(guild.id);

            if (!song) {
                await serverQueue.voiceChannel.leave();
            }

            let dispatcher = null;
            let connection = null;
            try {
                connection = await voice.channel.join();
                const stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
                dispatcher = connection.play(stream, { type: 'opus' });
                dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
                serverQueue.connection = connection;
            }
            catch (error) {
                console.log(error);
                return msg.channel.send('There was an error while trying to play a song.');
            }

            try {
                let msg = await msg.channel.send(`🎶 Started Playing: **${song.title}**`);
                await msg.react('⏸️');
                await msg.react('▶️');
                await msg.react('⏹️');
                await msg.react('⏩');
                await msg.react('🔁');
            }
            catch (error) {
                console.log(error);
            }

            const filter = (reaction, user) => user.id === msg.author.id;
            const collector = msg.createReactionCollector(filter, {time: song.duration * 1000 });

            collector.on('collect', ((reaction, user) => {
                const member = msg.guild.member(user);
                if (!this.client.util.canModifyQueue(msg, member)) return;

                switch (reaction.emoji.name) {
                    case '⏸️':
                        if (!serverQueue.playing) return;
                        serverQueue.playing = false;
                        return serverQueue
                    case '▶️':
                        if (serverQueue.playing) return;
                        serverQueue.playing = true;
                        return dispatcher.resume();
                    case '⏹️':
                        this.client.queue.delete(guild.id);
                        return voice.channel.leave();
                    case '⏩':
                        return dispatcher.end();
                    case '🔁':
                        return serverQueue.loop = !serverQueue.loop;
                    default:
                        return null;
                }
            }));

            collector.on('end', () => {
                msg.reactions.removeAll().catch(err => console.log(err));
            });

            serverQueue.message = msg;
            dispatcher.on('finish', () => {
                if (serverQueue.loop) {
                    const lastSong = serverQueue.songs.shift();
                    serverQueue.songs.push(lastSong);
                    serverQueue.message.delete().catch(error => console.log(error));
                }
                else {
                    serverQueue.songs.shift();
                    serverQueue.message.delete().catch(error => console.log(error));
                }
                play(serverQueue.songs[0]);
            });

            dispatcher.on('error', (error) => console.warn(error));
            connection.on('disconnect', () => this.client.queue.delete(guild.id));
        }

        if (searchString.match(/^https?:\/\/(www\.youtube\.com|youtube\.com)\/playlist(.*)$/)) {
            try {
                const playlist = await this.client.youtube.getPlaylist(searchString);
                const videos = await playlist.getVideos();
                msg.channel.send(`✅ Added playlist **${playlist.title}** to the queue.`);
                for (const video of videos) {
                    await handleVideo(video.id, true);
                }
            }
            catch (error) {
                console.log(error);
                return msg.channel.send('There was an issue when fetching this playlist.');
            }
        }
        else if (searchString.match(/^https?:\/\/(www\.youtube\.com|youtube\.com)\$/)) {

            const youtube = new YoutubeSearch();
            youtube().setKey(secret.YOUTUBE_TOKEN);
            let songInfo = null;
            try {
                // eslint-disable-next-line no-var
                songInfo = await this.client.youtube.getVideo(searchString);
                await handleVideo(songInfo.id);
            }
            catch (error) {
                if (error && !error.message.startsWith('No video ID found in URL:')) console.warn(error);
                try {
                    songInfo = await this.client.youtube.searchVideos(searchString, 1);
                    if (!songInfo.length) return msg.channel.send('No search results found.');
                    await handleVideo(songInfo[0].id);
                }
                catch (err) {
                    console.log(err);
                    return msg.channel.send('There seems to have been an error while fetching the video.');
                }
            }
        }
    }


}