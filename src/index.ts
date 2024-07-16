import { createClient } from "@supabase/supabase-js";
import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  EmbedBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
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
    name: "komutlar",
    description: "Botun kullanabileceğiniz komutları",
  },
  {
    name: "ping",
    description: "Botun çalışıp çalışmadığını kontrol etmek için kullanılır.",
  },
  {
    name: "users",
    description: "Sunucudaki kullanıcıları listeler.",
  },
  {
    name: "icerikler",
    description: "Sunucudaki içerikleri listeler.",
  },
  {
    name: "ekle",
    description: "Yeni içerik eklemek için kullanılır.",
  },
];
client.on(Events.MessageCreate, async (message) => {
  if (message.content === "!komutlar") {
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
  if (message.content === "!users") {
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

  if (message.content === "!icerikler") {
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

  if (message.content === "!ekle") {
    // Show the modal to the user
    await message.reply({
      content:
        "Bot üzerinden paylaşım şu an desteklenmemektedir. Lütfen web sitemizi ziyaret edin.",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Link,
              emoji: "🌐",
              label: "Ziyaret Et",
              url: "https://code-nest-web.vercel.app/new", // Replace with your actual URL
            },
          ],
        },
      ],
    });
  }
});
