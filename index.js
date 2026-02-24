const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;
  if (!msg.content.startsWith("!play")) return;

  const url = msg.content.split(" ").slice(1).join(" ");
  if (!url) return msg.reply("YouTube link daal.");
  if (!msg.member.voice.channel) return msg.reply("VC join kar pehle.");

  try {
    const stream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

    player.play(resource);
    connection.subscribe(player);

    msg.reply("🎵 Gaana baj raha hai!");

  } catch (e) {
    console.error(e);
    msg.reply("❌ Song play nahi hua.");
  }
});

client.login(process.env.TOKEN);
