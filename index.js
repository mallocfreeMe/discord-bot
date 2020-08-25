'use strict';
const Discord = require('discord.js');

const bot = new Discord.Client();

// add your own token 
const token = '#';

const PREFIX = '.';

bot.on('ready', () => {
    console.log("This bot is online!");
    bot.user.setActivity("Assassin's Creed");
});

bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

bot.on('message', message => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case 'hello':
            message.channel.send(`Hey ${message.author} how's it going?`);
            break;
        case 'ping':
            message.channel.send('pong!');
            break;
        case '7':
            let number = getRandomInt(3);
            let seven;

            if (number == 0) {
                seven = new Discord.MessageAttachment('https://tenor.com/view/scissor-seven-gif-18050872.gif');
            } else if (number == 1) {
                seven = new Discord.MessageAttachment('https://tenor.com/view/scissor-seven-cute-butterfly-animation-scratching-head-gif-17754890.gif');
            } else {
                seven = new Discord.MessageAttachment('https://tenor.com/view/scissor-seven-seven-dancing-moonwalk-fuck-you-gif-17598548.gif');
            }
            message.channel.send(seven);
            break;
        case 'rip':
            const rip = new Discord.MessageAttachment('https://i.imgur.com/w3duR07.png');
            message.channel.send(rip);
            break;
        case 'poll':
            const Embed = new Discord.MessageEmbed()
                .setColor(0xFFC300)
                .setTitle("Inititate Poll")
                .setDescription(".poll to initiate a simple yes or no poll");

            if (!args[1]) {
                message.channel.send(Embed);
            }

            let msgArgs = args.slice(1).join(" ");

            message.channel.send(msgArgs).then(messageReaction => {
                messageReaction.react("👍");
                messageReaction.react("👎");
            }).catch(console.error);
            break;
        case 'ls':
            const help = new Discord.MessageEmbed()
                .setColor(0xFFC300)
                .setTitle("All Commands")
                .setDescription(".ding -- dong!\n.poll -- start a poll.\nls -- show the help doc\n .7 -- show random gif\n .iam -- add a role\n .iamn --remove a role\n .newrole -- create a new role");

            message.channel.send(help);
            break;
        case 'newrole':
            const emptyNewRoleEmbed = new Discord.MessageEmbed()
                .setColor(0xFFC300)
                .setTitle("Add A New Roll")
                .setDescription(".newrole to initiate a new role");

            if (!args[1]) {
                message.channel.send(emptyNewRoleEmbed);
            }

            let newRole = args.slice(1).join(" ");

            const repeatedRoleEmbed = new Discord.MessageEmbed()
                .setColor(0xFFC300)
                .setTitle("This role already exist")
                .setDescription(`Calling .iam ${newRole} will add it to you.`);

            let repeated = false;

            message.guild.roles.cache.forEach((role) => {
                if (role.name === newRole) {
                    message.channel.send(repeatedRoleEmbed);
                    repeated = true;
                }
            });

            if (repeated == false) {
                message.guild.roles.create({
                    data: { name: newRole }
                }).then(role => console.log(`Created new role with name ${role.name}`)).catch(console.error);

                const newRoleEmbed = new Discord.MessageEmbed()
                    .setColor(0xFFC300)
                    .setTitle("Add A New Roll")
                    .setDescription(`You have successfully created role ${newRole}.\n Calling .iam ${newRole} will add it to you.`);

                message.channel.send(newRoleEmbed);
            }

            break;
        case 'iam':
            let userInput = args.slice(1).join(" ");

            let registerRole = message.guild.roles.cache.find(role => role.name === userInput);

            if (registerRole) {

                let hasThisRole = false;

                if (message.member.roles.cache.find(role => role.name === userInput)) {
                    const hasThisRoleEmbed = new Discord.MessageEmbed()
                        .setColor(0xFFC300)
                        .setTitle("Dude STAAAHP!!")
                        .setDescription(`You've already got the role dude`);

                    message.channel.send(hasThisRoleEmbed);
                    hasThisRole = true;
                }

                if (hasThisRole == false) {
                    message.member.roles.add(registerRole);

                    const registerRoleEmbed = new Discord.MessageEmbed()
                        .setColor(0xFFC300)
                        .setTitle("Done")
                        .setDescription(`You have successfully been added to role ${userInput}.`);

                    message.channel.send(registerRoleEmbed);
                }

            } else {

                const repeatedRegisterEmbed = new Discord.MessageEmbed()
                    .setColor(0xFFC300)
                    .setTitle("Fail")
                    .setDescription(`Role ${userInput} doesn't exist.\nCalling .newrole ${userInput}`);

                message.channel.send(repeatedRegisterEmbed);
            }

            break;
        case 'iamn':
            let removeRole = args.slice(1).join(" ");

            let canRemove = true;

            if (!message.member.roles.cache.find(role => role.name === removeRole)) {
                const cannotRemoveEmbed = new Discord.MessageEmbed()
                    .setColor(0xFFC300)
                    .setTitle("Boop Beep??")
                    .setDescription(`You don't have the role, so how am I gonna remove it????`);

                message.channel.send(cannotRemoveEmbed);
                canRemove = false;
            }

            if (canRemove == true) {
                const role1 = message.member.roles.cache.find(role => role.name === removeRole);
                message.member.roles.remove(role1);

                const canRemoveEmbed = new Discord.MessageEmbed()
                    .setColor(0xFFC300)
                    .setTitle("Done")
                    .setDescription(`You have successfully been removed from role ${removeRole}`);

                message.channel.send(canRemoveEmbed);
            }

            break;
        case 'clear':
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.messages.fetch()
                    .then(function (list) {
                        message.channel.bulkDelete(list);
                    }, function (err) { message.channel.send("ERROR: ERROR CLEARING CHANNEL.") })
            }
            break;
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

bot.login(token);