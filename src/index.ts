import { createClient } from "@supabase/supabase-js";
import { ActivityType, Client, EmbedBuilder, Events } from "discord.js";
import "dotenv/config";
import { Tables } from "../supabase";

console.log("Starting the bot...");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL or SUPABASE_KEY is not defined.");
  throw new Error("SUPABASE_URL or SUPABASE_KEY is not defined.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {});

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  presence: {
    status: "online",
    activities: [
      {
        name: "with TypeScript",
        type: ActivityType.Playing,
      },
    ],
  },
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);

const commands = [
  {
    name: "komutlar / commands",
    description: "Botun kullanabileceğiniz komutları",
  },
  {
    name: "ping",
    description: "Botun çalışıp çalışmadığını kontrol etmek için kullanılır.",
  },
  {
    name: "kullanicilar / users",
    description: "Sunucudaki kullanıcıları listeler.",
  },
  {
    name: "icerikler / contents",
    description: "Sunucudaki içerikleri listeler.",
  },
  {
    name: "ekle / add",
    description: "Yeni içerik eklemek için kullanılır.",
  },
];
client.on(Events.MessageCreate, async (message) => {
  if (message.content === "!komutlar" || message.content === "!commands") {
    const embed = new EmbedBuilder()
      .setTitle("Komutlar")
      .setDescription("Botun kullanabileceğiniz komutları")
      .setColor("DarkBlue")
      .setTimestamp()
      .setFooter({
        text: "CodeNest Discord Bot",
      })
      .addFields(
        commands.map((command) => ({
          name: command.name,
          value: command.description,
        }))
      );
    await message.reply({ embeds: [embed] });
  }

  if (message.content === "!ping") {
    await message.reply("Pong!");
  }
  if (message.content === "!pong") {
    await message.reply("Ping!");
  }
  if (message.content === "!kullanicilar" || message.content === "!users") {
    let { data, error } = await supabase.from("profiles").select("full_name");
    if (error) {
      console.error(error);
      return;
    }
    data = data as Tables<"profiles">[];
    const userListEmbed = new EmbedBuilder()
      .setTitle("Toplam Kullanıcı Sayısı: " + data?.length)
      .setDescription(data?.map((user) => user.full_name).join("\n"))
      .setColor("DarkBlue")
      .setTimestamp()
      .setFooter({
        text: "CodeNest Discord Bot",
      });
    await message.reply({ embeds: [userListEmbed] });
  }

  if (message.content === "!icerikler" || message.content === "!contents") {
    let { data, error } = await supabase
      .from("files")
      .select("title, created_at, description, content_id")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    data = data as Tables<"files">[];
    const contentListEmbed = new EmbedBuilder()
      .setTitle("Toplam İçerik Sayısı: " + data?.length)
      .setColor("DarkBlue")
      .setTimestamp()
      .setFooter({
        text: "CodeNest Discord Bot",
      })
      .setURL(`https://code-nest-web.vercel.app/explore`)
      .addFields(
        data?.slice(0, 10).map((content) => ({
          name: content.title,
          value: content.description,
        }))
      );
    await message.reply({ embeds: [contentListEmbed] });
  }

  if (message.content === "!ekle" || message.content === "!add") {
    const addEmbed = new EmbedBuilder()
      .setTitle("İçerik Ekleme")
      .setDescription(
        "Bot üzerinden paylaşım şu an desteklenmemektedir. Lütfen web sitemizi ziyaret edin."
      )
      .setColor("DarkBlue")
      .setTimestamp()
      .setFooter({
        text: "CodeNest Discord Bot",
      })
      .setURL("https://code-nest-web.vercel.app/new")
      .setImage("https://code-nest-web.vercel.app/images/default_avatar.png")
      .setAuthor({
        name: "CodeNest",
        iconURL: "https://code-nest-web.vercel.app/icons/favicon.ico",
        url: "https://code-nest-web.vercel.app",
      });

    await message.reply({ embeds: [addEmbed] });
  }
});
