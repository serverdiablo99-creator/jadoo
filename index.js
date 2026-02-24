const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on("ready", () => {
  console.log("Music bot online!");
});

client.on("messageCreate", async (msg) => {
  if (!msg.guild) return;

  if (msg.content.startsWith("!play")) {
    const url = msg.content.split(" ").slice(1).join(" ");

    if (!url) return msg.reply("YouTube link daal bhai 😅");
    if (!msg.member.voice.channel) return msg.reply("Pehle VC join kar!");

    if (!ytdl.validateURL(url)) {
      return msg.reply("❌ Sirf YouTube link kaam karega (abhi).");
    }

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
      const resource = createAudioResource(stream);

      player.play(resource);
      connection.subscribe(player);

      msg.reply("🎵 Gaana baj raha hai!");
    } catch (err) {
      console.log(err);
      msg.reply("❌ Link se gaana nahi baja paaya.");
    }
  }
});

client.login(process.env.TOKEN);
