import {
  ActionRowBuilder,
  ActivityType,
  ButtonStyle,
  Client,
  ComponentType,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import "dotenv/config";

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

client.on(Events.MessageCreate, async (message) => {
  if (message.content === "!ekle") {
    // Show the modal to the user
    await message.reply({
      content: "Paylaşım ekleme ekranını açmak için butona tıklayın.",
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              label: "Diyalog Aç",
              customId: "sendContent",
            },
          ],
        },
      ],
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Ensure this is a button interaction
  if (!interaction.isButton()) return;

  // Check which button was clicked based on customId
  if (interaction.customId === "sendContent") {
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("addContentModal")
      .setTitle("Paylaşım Ekle");

    // Create the title input
    const titleInput = new TextInputBuilder()
      .setCustomId("titleInput")
      .setPlaceholder("Başlık")
      .setLabel("Başlık")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    // Create the description input
    const descriptionInput = new TextInputBuilder()
      .setCustomId("descriptionInput")
      .setPlaceholder("Açıklama")
      .setLabel("Açıklama")
      .setStyle(TextInputStyle.Short);

    const codeInput = new TextInputBuilder()
      .setCustomId("codeInput")
      .setPlaceholder("Kod")
      .setLabel("Kod")
      .setStyle(TextInputStyle.Paragraph);

    // Create action rows for the inputs
    const titleActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const descriptionActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

    const codeActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);

    // Add the action rows to the modal
    modal.addComponents(titleActionRow, descriptionActionRow, codeActionRow);

    await interaction.showModal(modal);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "addContentModal") {
    const title = interaction.fields.getTextInputValue("titleInput");
    const description =
      interaction.fields.getTextInputValue("descriptionInput");
    console.log({ title, description });
    const data = {
      title: title,
      description: description,
    };
    await interaction.reply({
      content: `İçerik paylaşıldı! ${data.title}`,
    });
  }
});
