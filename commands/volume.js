const { SlashCommandBuilder } = require('discord.js');

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

  async execute(interaction, kazagumo) {
    const player = kazagumo.players.get(interaction.guild.id);
    if (!player) return interaction.reply('❌ No hay música reproduciéndose.');
    const vol = interaction.options.getInteger('nivel');
    player.setVolume(vol);
    await interaction.reply(`🔊 Volumen: **${vol}%**`);
  }
};