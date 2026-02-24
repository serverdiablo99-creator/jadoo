const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

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
    const query = msg.content.split(" ").slice(1).join(" ");

    if (!query) return msg.reply("Song name ya link daal bhai 😅");
    if (!msg.member.voice.channel) return msg.reply("Pehle VC join kar!");

    try {
      let stream;

      // agar YouTube link hai
      if (play.yt_validate(query) === "video") {
        stream = await play.stream(query);
      } else {
        // warna search karke first result chalao
        const results = await play.search(query, { limit: 1 });
        if (!results.length) return msg.reply("❌ Gaana nahi mila");

        stream = await play.stream(results[0].url);
      }

      const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(stream.stream, { inputType: stream.type });

      player.play(resource);
      connection.subscribe(player);

      msg.reply("🎵 Gaana baj raha hai!");
    } catch (err) {
      console.log(err);
      msg.reply("❌ Song play nahi ho paaya, doosra try kar.");
    }
  }
});

client.login(process.env.TOKEN);
