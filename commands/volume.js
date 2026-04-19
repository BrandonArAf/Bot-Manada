const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Cambia el volumen (0-100)')
    .addIntegerOption(opt =>
      opt.setName('nivel')
        .setDescription('Volumen entre 0 y 100')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) return interaction.reply('❌ No hay música reproduciéndose.');
    const vol = interaction.options.getInteger('nivel');
    queue.node.setVolume(vol);
    await interaction.reply(`🔊 Volumen cambiado a **${vol}%**`);
  }
};