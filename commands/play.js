const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción o playlist')
    .addStringOption(opt =>
      opt.setName('cancion')
        .setDescription('Nombre o URL de la canción')
        .setRequired(true)
    ),

  async execute(interaction, player) {
    await interaction.deferReply();
    const query = interaction.options.getString('cancion');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.editReply('❌ Debes estar en un canal de voz!');
    }

    const p = useMainPlayer();
    const result = await p.play(channel, query, {
      nodeOptions: {
        metadata: { channel: interaction.channel },
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 30000,
      }
    });

    if (!result || !result.track) {
      return interaction.editReply('❌ No encontré esa canción.');
    }

    await interaction.editReply(`🎵 Buscando: **${query}**...`);
  }
};