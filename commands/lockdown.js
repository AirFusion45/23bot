const ms = require('ms');
exports.run = function (client, message, args) {
    let guild = message.guild;
    client.logger.log('info', `lockdown command used by ${message.author.username} Time: ${Date()} Guild: ${guild}`)
    const Discord = require('discord.js');
    let member = message.author;
    const config = client.config
    const embed1 = new Discord.MessageEmbed()
        .setColor("#f0ffff")
        .setDescription("**Command: **" + `${config.prefix}lockdown`)
        .addField("**Usage:**", `${config.prefix}lockdown <time for ex: 1m, 1h etc>`)
        .addField("**Example:**", `${config.prefix}lockdown 1m`)
        .addField("**Expected Result From Example:**", "All Channels should enter a lockdown mode, all moderators and above should not be affected.")
    if (args.join(' ') == "") return message.channel.send({ embed: embed1 })

    if (!message.guild.member(message.author).hasPermission('MANAGE_CHANNELS')) return message.reply('Insufficant Permissions').catch(console.error)
    if (!client.lockit) client.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');
    const embed = new Discord.MessageEmbed()
        .setColor('##cb4154')
        .setTimestamp()
        .setThumbnail(message.author.avatarURL)
        .addField('Action:', "Lockdown")
        .addField('Duration/Time:', time)
        .addField("Moderator:", message.author.username + "#" + message.author.discriminator)

    if (validUnlocks.includes(time)) {
        message.channel.createOverwrite("748319651150168164", {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        }).then(() => {
            message.channel.send('Lockdown lifted.');
            clearTimeout(client.lockit[message.channel.id]);
            delete client.lockit[message.channel.id];
        }).catch(error => {
            console.log(error);
        });
    } else {
        message.channel.createOverwrite("748319651150168164", { // message.guild.id
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true
        }).then(() => {
            message.channel.createOverwrite(config.botid, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            }).then(() => {
                message.channel.send(`Channel locked down for ${ms(ms(time), { long: true })}`).then(() => {

                    client.lockit[message.channel.id] = setTimeout(() => {
                        message.channel.createOverwrite("748319651150168164", {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true
                        }).then(message.channel.send('Lockdown lifted.')).catch(console.error);
                        delete client.lockit[message.channel.id];
                    }, ms(time));

                }).catch(error => {
                    console.log(error);
                });
            })
        });
    }

    try {
        guild.channels.cache.find(val => val.name === "modlog").send({ embed: embed }).catch(err => console.error(err));
    } catch (err) {
        // message.channel.send(`No modlog`)
    }
};
