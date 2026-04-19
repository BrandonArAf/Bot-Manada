const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción')
    .addStringOption(opt =>
      opt.setName('cancion')
        .setDescription('Nombre o URL de la canción')
        .setRequired(true)
    ),

  async execute(interaction, kazagumo) {
    await interaction.deferReply();
    const query = interaction.options.getString('cancion');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.editReply('❌ Debes estar en un canal de voz!');
    }

    const result = await kazagumo.search(query, { requester: interaction.user });

    if (!result || !result.tracks.length) {
      return interaction.editReply('❌ No encontré esa canción.');
    }

    let player = kazagumo.players.get(interaction.guild.id);
    if (!player) {
      player = await kazagumo.createPlayer({
        guildId: interaction.guild.id,
        voiceId: channel.id,
        textId: interaction.channel.id,
        deaf: true,
      });
    }

    if (result.type === 'PLAYLIST') {
      for (const track of result.tracks) player.queue.add(track);
      await interaction.editReply(`✅ Playlist **${result.playlistName}** agregada (${result.tracks.length} canciones)`);
    } else {
      player.queue.add(result.tracks[0]);
      await interaction.editReply(`✅ Agregado: **${result.tracks[0].title}**`);
    }

    if (!player.playing && !player.paused) player.play();
  }
};