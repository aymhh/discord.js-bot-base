const Discord = require("discord.js");
const { prefix, tokenID, botHandlerID, mainColor, errorColor, logChannelName, commandsChannelName, errorChannelName }  = require("../priv/config.json"); // private info for the bot itself and other misc information.

// **REMEMBER TO USE THE VARIABLES ABOVE TO MAKE YOUR LIFE MUCH EASIER IN THE EVENT OF YOU WANTING TO EDIT THE BOT'S DEPENDANCES IN THE FUTURE, THIS IS SUPER HELPFUL!**
// **REMEMBER TO USE THE VARIABLES ABOVE TO MAKE YOUR LIFE MUCH EASIER IN THE EVENT OF YOU WANTING TO EDIT THE BOT'S DEPENDANCES IN THE FUTURE, THIS IS SUPER HELPFUL!**

module.exports.run = async (bot, message, args) => {
    // Restricts bot usages to the set bot commands channel above, this will be triggered if the user is NOT the server owner and is NOT using the bot inside the set-commands channel.
    const botCommandsChannel = message.guild.channels.cache.find(channel => channel.name === commandsChannelName)
    const wrongChannelEmbed = new Discord.MessageEmbed()
        .setColor(errorColor) 
        .setTitle("error!")
        .setDescription("wrong channel!")
        .addField("i live in:", `<#${botCommandsChannel.id}>`)
        .setTimestamp()
        .setFooter(message.author.tag + " | " + bot.user.username, message.author.displayAvatarURL({dynamic: true, size: 1024}))
    ;

    if(message.channel != botCommandsChannel && message.author.id != message.guild.owner.id) {
        message.delete()
        return message.channel.send(wrongChannelEmbed).then(msg => msg.delete({timeout: 7000}))
    };
    
    // This is a super basic starter command file that all it does is reply with "Hello!" and add a reaction the message if someone triggered this command
    message.react("👋") 
    return message.reply("hello there!")
    
};

module.exports.help = {
    name: "hello"
};