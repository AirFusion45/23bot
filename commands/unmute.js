exports.run = function (client, message, args) {
    if (!message.guild.members.cache.get(message.author.id).hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true })) return message.reply('Insufficant Permissions').catch(console.error)
    var guild = message.guild;
    client.logger.log('info', `unmute command used by ${message.author.username} Time: ${Date()} Guild: ${guild}`)
    const Discord = require('discord.js');
    const config = require("../config.json");
    let user = message.mentions.users.first()
    let member = message.guild.member(user)
    const embed19 = new Discord.MessageEmbed()
        .setColor("#f0ffff")
        .setDescription("**Command: **" + `${config.prefix}unmute`)
        .addField("**Usage:**", `${config.prefix}unmute <@username>`)
        .addField("**Example:**", `${config.prefix}unmute @AirFusion`)
        .addField("**Expected Result From Example:**", "Mentioned user should be unmuted.")
    if (args.join(' ') == "") return message.channel.send({ embed: embed19 })
    let muteRole = guild.roles.cache.find(val => val.name === `Mute`)
    let verifiedRole = guild.roles.cache.find(val => val.name === `Verified`)
    if (!muteRole) return message.reply("Mute Role required")
    if (message.mentions.users.size < 1) return message.reply("You must mention someone to mute them.").catch(console.error)
    if (user === message.author) return message.reply("You cannot unmute yourself")
    if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply('Bot has insufficant Perms').catch(console.error)
    if (message.guild.member(user).roles.cache.has(muteRole.id)) {
        message.guild.member(user).roles.remove(muteRole).catch(err => console.log(err))
        message.guild.member(user).roles.add(verifiedRole).catch(err => console.error(err))
    }

    const embed = new Discord.MessageEmbed()
        .setColor('#00008b')
        .setTimestamp()
        .setThumbnail(user.avatarURL)
        .addField('Action:', "UnMute")
        .addField('User:', user.username + '#' + user.discriminator)
        .addField("User ID:", user.id)
        .addField("Moderator:", message.author.username + "#" + message.author.discriminator)
        .addField("Server:", message.guild)


    const embed1 = new Discord.MessageEmbed()
        .setColor('#00008b')
        .setTimestamp()
        .setThumbnail(user.avatarURL)
        .addField('Action:', "UnMute")
        .addField('User:', user.username + '#' + user.discriminator)
        .addField("User ID:", user.id)
        .addField("Moderator:", message.author.username + "#" + message.author.discriminator)

    message.channel.send({ embed: embed1 })
    user.send({ embed: embed })
    try {
        guild.channels.cache.find(val1 => val1.name === "modlog").send({ embed: embed1 }).catch(err => console.error(err));
    } catch (err) {
        console.log(err)
    }
};