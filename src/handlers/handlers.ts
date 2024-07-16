
// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isButton()) return;
//   if (interaction.customId === "sendContent") {
//     const modal = new ModalBuilder()
//       .setCustomId("addContentModal")
//       .setTitle("Paylaşım Ekle");

//     const titleInput = new TextInputBuilder()
//       .setCustomId("titleInput")
//       .setPlaceholder("Başlık")
//       .setLabel("Başlık")
//       .setRequired(true)
//       .setStyle(TextInputStyle.Short);

//     const descriptionInput = new TextInputBuilder()
//       .setCustomId("descriptionInput")
//       .setPlaceholder("Açıklama")
//       .setLabel("Açıklama")
//       .setStyle(TextInputStyle.Short);

//     const codeInput = new TextInputBuilder()
//       .setCustomId("codeInput")
//       .setPlaceholder("Kod")
//       .setLabel("Kod")
//       .setStyle(TextInputStyle.Paragraph);

//     const titleActionRow =
//       new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
//     const descriptionActionRow =
//       new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

//     const codeActionRow =
//       new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);

//     modal.addComponents(titleActionRow, descriptionActionRow, codeActionRow);

//     await interaction.showModal(modal);
//   }
// });

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isModalSubmit()) return;
//   if (interaction.customId === "addContentModal") {
//     const title = interaction.fields.getTextInputValue("titleInput");
//     const description =
//       interaction.fields.getTextInputValue("descriptionInput");
//     console.log({ title, description });
//     const data = {
//       title: title,
//       description: description,
//     };

//     const { data: content, error } = await supabase.auth.admin.listUsers();

//     console.log({ content, error });

//     await interaction.reply({
//       content: `İçerik paylaşıldı! ${data.title}`,
//     });
//   }
// });