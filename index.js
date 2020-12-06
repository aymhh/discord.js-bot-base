const Discord = require('discord.js') // brings in the discord elements
const fs = require('fs') // allows the code to read files
const bot = new Discord.Client() // discord originally uses "client" to relate it the bot itself, what this is does is basiclly renamed the client to bot variable.
bot.commands = new Discord.Collection(); // brings in the instance of allowing the bot ot read messages
const { prefix, tokenID, botHandlerID, mainColor, errorColor, logChannelName, commandsChannelName, errorChannelName }  = require("./priv/config.json"); // private info for the bot itself and other misc information.
/*
prefix: set's the prefix for the bot to be triggered by and to pick up
tokenID: set's it to the unique identifier for the bot, get it from the discord developers portal
botHandlerID: set's it the the owner of the bot's ID, get it by setting your user ID
mainColor: set it to the color of the what you want the bot to use for embeds
errorColor: set it to the color of what you want the bot to use for embeds that return errors
logChannelName: set it to the name of the channel without "#", used for event's such as: deleted messages, edited messages, users joining the server, users leaving the server and etc.
errorChannelName: set it to the name of the channel without "#", used to log messages in the event of an error occuring
commandsChannelName: set it to the name of the channel without "#", used to restrict bot usage to specifically that channel
*/

// file Loaders (imports .js files from the specified directory, used to reduce cluter in the index.js file.)
fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      return console.log("There are no .js files in the commands directory...");
    }

    jsfile.forEach((f) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
      return console.log("all files have been loaded! ✅")
    });
  });

// command candlers & anti-dming
bot.on('message', message => {

    const messageArray = message.content.split(" ");
    const cmd = messageArray[0];
    const args = messageArray.slice(1);
    const commandFile = bot.commands.get(cmd.slice(prefix.length));
    const botCommands = bot.channels.cache.find(channel => channel.name === commandsChannelName)

    const noCommandEmbed = new Discord.MessageEmbed()
        .setColor(errorColor)
        .setTitle("error!")
        .addField("command doesn't exist!", `\`${prefix}help\` in ${botCommands} to see what you can do!\n*keep in mind these commands are all case sensitive*`)
        .setThumbnail(message.guild.iconURL({dynamic: true, size: 2048}))
        .setTimestamp()
        .setFooter(message.author.tag + " | " + bot.user.username, message.author.displayAvatarURL({dynamic: true, size: 1024}))
    ;

    if(message.author.bot) return ; // this is simply ignoring all messages sent by any bot.
    if(message.channel.type === "dm") return ; // this is simply ignoring all the images the bot is receiving in DM's! Be careful with this as users can type in commands in the DM channel and that will cause the bot to throw out errors.

    // this here will read the messages starting with the set prefix, and will tell the users if the command does not exist if they tried to enter a command that doesn't exist, else if it exists it'll excute it.
    if(message.content.startsWith(prefix) && !commandFile) {
        return message.channel.send(noCommandEmbed).then(message => message.delete({timeout: 7000}));
    } else if(message.content.startsWith(prefix) && commandFile) {
        return commandFile.run(bot, message, args)
    };
});

// error catching and handling, very useful to make sure the bot is still up and running in the event of an error and for you to be able to see what happened without logging on to console/terminal
process.on('unhandledRejection', (error) => {

    const botHandler = bot.users.cache.get(botHandlerID)
    const loggingChannel = bot.channels.cache.find(channel => channel.name === errorChannelName)
    if(!loggingChannel) {
        botHandler.send("an error has occured however I couldn't of been able to send it to the error logging channel as I couldn't find it.\n make sure you done all the steps mentioned in the README file on the github repo and have made a channel with the name coresponding to what you put in the `config.json` file.\nthe error has been sent to console/terminal.")
        return console.error(`unhandled promise rejection:`, error)
    }
    const errorEmbed = new Discord.MessageEmbed()
        .setColor(errorColor)
        .setTitle("error!")
        .setDescription("an error has occured!")
        .addField("error: ", `\`\`\`${error}\`\`\``)
        .setTimestamp()
        .setFooter(bot.user.id + " | " + bot.user.username, bot.user.displayAvatarURL({dynamic: true, size: 1024}))
    ;

    loggingChannel.send(errorEmbed)
    return console.error('Unhandled promise rejection:', error)
});

// brings the bot online
bot.login(tokenID).then(console.log("bot have been brought online! ✅"))

// everything below this line is going to be examples and optional events that can be used.
// take everything below as a reference and if you wish to remove it you can do so easily but remove the whole function

// when the bot detects the message "what is my avatar?" it'll send a embed with the file image of it, this will ignore the command channel restrictions has we have never specificed it
bot.on("message", async message => {   // calling the "message" event listener and collecting the message object

    const avatarEmbed = new Discord.MessageEmbed()     // Setting up the embeded message
        .setColor(mainColor)                            // Calling our set up color (very useful if we were to ever change the color in the future, you'd simply edit the .json file value than all the embeded fields)
        .setTitle("here is your avatar as you requested!")  
        .setImage(message.author.displayAvatarURL({dynamic: true, size: 1024}))  // getting the avatar URL from the message author, and passing in options to allow users with animated pfps and making the file full size.
        .setTimestamp()
        .setFooter(`${message.guild.name} | ${message.author.username}`, message.guild.iconURL())  
    ;

    if(message.content === 'whats my avatar?') return message.reply(avatarEmbed) // if the message content is "whats my avatar?" then it'll reply with the embed we just made
    
}); 

