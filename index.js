const http          = require('http');
const express       = require('express');
const app           = express();
const Discord       = require("discord.js");
const client        = new Discord.Client();
const DBL           = require("dblapi.js");
const jsonfile      = require("jsonfile");
const Canvas        = require('canvas');
const snekfetch     = require('snekfetch');
const passport      = require("passport");
const oauth         = require("passport-discord").Strategy;
const {obfuscate, clockify, getCommand, forceHTTPS, checkAuth} = require("./util.js");

let ipToUser = {};
process.on("unhandledRejection", e => {
  console.error(e);
});
passport.use(new oauth({
  clientID: "445830911272026113",
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://multi-bot.glitch.me/oauth/return"
}, (access, refresh, profile, cb) => {
  if (!client.users.get(profile.id)) return cb("Not a user of the Multi Bot", null);
  cb(null, profile);
}));
passport.serializeUser((user, cb) => {
 cb(null, user); 
});
passport.deserializeUser((user, cb) => {
 cb(null, user); 
});
app.enable("trust proxy");
app.use((req, res, next) => {
  if (!req.secure) res.redirect("https://multi-bot.glitch.me" + req.url);
  next();
});
app.get("/invite", (req, res) => {
  res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=445830911272026113&permissions=8&redirect_uri=https%3A%2F%2Fmulti-bot.glitch.me%2Foauth%2Freturn&scope=bot");
});
app.use(passport.initialize());
app.use(express.static("webpage"));
app.get("/oauth/login", passport.authenticate("discord", {scope: ["identify"]}));
app.get("/oauth/return", passport.authenticate("discord", {
 failureRedirect: "https://discordapp.com/api/oauth2/authorize?client_id=445830911272026113&permissions=8&redirect_uri=https%3A%2F%2Ffork-foam.glitch.me%2Foauth%2Freturn&scope=bot" 
}), (req, res) => {
  ipToUser[req.ip] = req.user;
  res.redirect("/dashboard");
});
app.get("/oauth/logout", (req, res) => {
  ipToUser[req.ip] = null;
  res.redirect("/");
});
app.get("*", (req, res) => {
  res.redirect("/404");
});
app.listen(8080);
//client.on('guildMemberAdd', async member => {
    //const { body } = await snekfetch.get('https://cdn.glitch.com/2dca3ff8-a892-4531-a885-9bd8ad55ee11%2Fwallpaper.jpg?1529968469324');
    //const channel = member.guild.channels.find(ch => ch.name === 'new-members');
    //if (!channel) return;
// Pass the entire Canvas object because you'll need to access its width, as well its context
    const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        ctx.font = `${fontSize -= 10}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
};

client.on('guildMemberAdd', async member => { 
    //Image Url
    const { body } = await snekfetch.get('https://t6.rbxcdn.com/631a48c3cfb1fcfd2495738be142c3cd');
  
    //Channel to send new member image
    const channel = member.guild.channels.find(ch => ch.name === 'new-members');
  
    //Check if channel doesen't exist
    if (!channel) return;
  
    //Creating Canvas
    const canvas = Canvas.createCanvas(800, 300);
    //Assigning html canvas to 2d context
    const ctx = canvas.getContext('2d');
    
    //Add Background to Canvas
    const background = await Canvas.loadImage(body);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Text Style
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Assign the text
    ctx.font = applyText(canvas, "welcome " + member.displayName);
    ctx.fillStyle = '#ffffff';
    ctx.fillText("welcome " + member.displayName, 150, canvas.height / 2);
    
    //Begin draw
    ctx.beginPath();
    //Properly stretch
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    //Close draw
    ctx.closePath();
    //Copy image to buffer
    ctx.clip();
    //Assign image to attachment
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    
    //Send Image
    channel.send(attachment);
}
          
          )          
client.on('guildMemberAdd', async member => {
 if (member.guild.id == "264445053596991498") {
    const { body } = await snekfetch.get('https://cdn.glitch.com/2dca3ff8-a892-4531-a885-9bd8ad55ee11%2Fpigeon.png?1530000104591');
    const channel = member.guild.channels.find(ch => ch.name === 'bot-hell');
    if (!channel) return;
    const memetext = 'Cool?'
    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(body);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Assign the decided font to the canvas
    ctx.font = applyText(canvas, member.displayName);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 0);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
   // Assign the decided font to the canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillText(memetext, canvas.width / 2.5, canvas.height / 1.8);
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(attachment);
}
}      
          ) 
client.on('message', async message => {
  const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id] 
  if (message.content == prefix + 'join') {
        client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get('http://${process.env.PROJECT_DOMAIN}.glitch.me/')
}, 280000);
//Keeps bot alive
client.on('ready', () => {
 client.user.setActivity(client.users.size + " users | snipers help", { type: 3 });
});
// Client join and leave Discord
client.on("guildCreate", async guild => {
  let guildCreateChannel = client.channels.get("462410109495017472");
  
  let general = guild.channels.find('name', 'general');
  guild.channels.get(general.id).createInvite().then(invite => {
    
    let joinEmbed = new Discord.RichEmbed()
      .setTitle('Guild Joined')
      .setThumbnail(guild.iconURL)
      .setURL(invite.url)
      .setDescription('Join the new Guild')
      .addField('Guild Info', `Name: **${guild.name}** \nID: **${guild.id}**`)
      
    guildCreateChannel.send(joinEmbed);
  });
}); 

client.on("guildDelete", async guild => {
  let guildCreateDelete = client.channels.get("462410109495017472");
  
  let leaveEmbed = new Discord.RichEmbed()
    .setTitle('Guild Left')
    .setThumbnail(guild.iconURL)
    .addField('Guild Info', `Name: **${guild.name}** \nID: **${guild.id}**`)
  
  guildCreateDelete.send(leaveEmbed);
});
exports.run = (client, message, args) => {
    if (args.join(" ") == "") {
        message.reply("you need mention a user for this command! Syntax: !avatar @USER");
        return;
    } else {
        let user = message.mentions.users.first(); // Mentioned user
        let image = user.displayAvatarURL; // Get image URL
        let embed = new Discord.RichEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`) // Set author
            .setColor("#0000000") // Set color (If you don't have ideas or preference, use RANDOM for random colors)
            .setImage(image) // Set image in embed
        message.channel.send(embed); // Send embed
    }
}
client.on('ready', () => {
  console.log('  __  __             _    _      _ ')
  console.log('/|  \/  |          /| | /| |   ((_)')
  console.log('|| \  / |   _   _  || | || |_    ̅ ̅ ')
  console.log('|| |\/| | /| | | | || | || __| /| ̅|')
  console.log('|| | || | || |_| | || | || |__ || |')
  console.log('||_| ||_| \\__,_ | ||_| \\ \__|||_|')    
  console.log(' ̅ ̅ ̅   ̅ ̅ ̅    ̅ ̅ ̅ ̅ ̅ ̅   ̅ ̅ ̅    ̅ ̅ ̅ ̅ ̅  ̅ ̅ ̅ ')
});       
const dbl = new DBL(process.env.DBLTOKEN, client);
client.on('message', message => {
  if (message.author === client.user) return;
   if (message.content.startsWith('snipers checkvoted')) {
     let id = message.author.id;
     dbl.hasVoted(id).then(voted => {if (voted) {
        message.channel.send('You have been given the HONOURED role!')
        console.log(id + ' has voted!')
        message.member.addRole(message.guild.roles.find('name', 'HONOURED'));
     }
                                    })
   }
});
client.on('message', async message => {
  let prefix;
  let res = jsonfile.readFileSync("memory/prefix.json");
  if (!res[message.guild.id]) {
  res[message.guild.id] = "snipers ";
  jsonfile.writeFileSync("memory/prefix.json", res);
  }
     prefix = res[message.guild.id];
    if (message.author.bot) return;
  if (message == prefix + 'tick') {
    message.channel.send('tock');
  }
  if (message == prefix + 'ping') {
    message.channel.send('pong');
  }
  if (message == prefix + 'pong') {
    message.channel.send('???');
  }
  if (message.content === "listemojis") {
  const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
  message.channel.send(emojiList);
  }
    if (message.content.startsWith('allowfurries')) {
    message.channel.send('https://i.imgur.com/lU8TMTS.png');
  }   
  	if(message == prefix + "flip") {
		message.channel.send(`Result: **${Math.floor(Math.random() * 2) == 0 ? "heads" : "tails"}**!`);
	}      
    if(message == prefix + "tock") {
       message.channel.send('???');
  }
    if (message.content.startsWith(prefix + 'annoyeveryone')) {
    message.channel.send(' :regional_indicator_n: :regional_indicator_o: :regional_indicator_p: :regional_indicator_e:    :regional_indicator_m: :eight:.');
  }
    if (message.content.startsWith(prefix + 'serverupdate')) {
    message.channel.send({embed: {
    color: 217237,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "UPDATE TEMPLATE",
    
    description: "",
    fields: [{
        name: "TEMPLATE",
        value: "TEMPLATE"
      },
      {
        name: "TEMPLATE",
        value: "TEMPLATE"
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Bot made by Multi Raxerz (Alpha)"
    }
  }
});
  }
    if (message.content.startsWith('test error')) {
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "It appears the Multi Discord Bot has been faced with an error. (Raxerz doesn't see this message so please join the server and report this error.)",
    url: "",
    description: "",
    fields: [{
        name: "Error.",
        value: "Join this server : https://discord.gg/9g6gqME"
      },
      {
        name: "Report the error.",
        value: "Once you join, type ``report error``."
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Bot made by Multi Raxerz (Alpha)"
    }
  }
});
  }
    if (message.content.startsWith(prefix + "ooferganglol")) {
    message.channel.send({embed: {
    color: 217237,
    author: {
      name: "",
      icon_url: client.user.avatarURL
    },
    title: "CHECK OUT THE NEW BOT GITHUB PAGE! ",
    
    description: "",
    fields: [{
        name: "https:.com/Mg/MultiDiscordBot",
        value: "Enjoy!"
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Bot made by Multi Raxerz (Alpha)"
    }
  }
})
      
//client.on('ready', () => {
  //client.user.setActivity(prefix + 'help | V' + version)

  if (message == prefix + 'invitebot') {
    message.author.send({embed: {
    color: 217237,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Multi Discord Bot!",
    
    description: "",
    fields: [{
        name: "Invite with this link:",
        value: "https://discordapp.com/api/oauth2/authorize?client_id=445830911272026113&permissions=8&scope=bot"
      },
      {
        name: "Enjoy!",
        value: "I hope you enjoy my bot."
      },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Bot made by Multi Raxerz (Alpha)"
    }
  }
});
  }
if (message == "snipers help") {
    message.author.send({embed: {
    color: 3447003,
    author: {
      name: "Sup peeps, want some help?",
      
    },
      //Title
    description: "The prefix is ``" + prefix + "`` peeps.",
    fields: [{                    
    name: "```help```",
    value: "``Brings up this menu``"
      },
      {
    name: "checkvoted",
    value: "``Checks if the user has voted, and if so, gives them the HONOURED role. To vote go to :`` https://discordbots.org/bot/445830911272026113"
      },        
      {
    name: "ping",
    value: "``Responds with the message ''pong''``"
      },
      {
    name: "pong",
    value: "``Responds with the message ''???''``"
      },
      {
    name: "tick",
    value: "``Responds with the message ''tock''``"
      },
         {
    name: "tock",
    value: "``Responds with the message ''???''``"
      },
      {
    name: "annoyeveryone",
    value: "``Responds with the emoji`` :regional_indicator_n: :regional_indicator_o: :regional_indicator_p: :regional_indicator_e:    :regional_indicator_m: :eight:."
      },      
      {
    name: "invitebot",
    value: "``DMs a link to invite the bot to your server.``"
      },    
      {
    name: "serverinfo",
    value: "``Responds with the servers stats``"
      },    
      {
    name: "prefix",
    value: "``Changes the prefix, example : 'snipers prefix oofer gang ~[END] will set the prefix to oofer gang SPACEHERE'``"
      },            
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "Bot made by Multi Raxerz (Alpha)"
    }
  }
});
  }
  if (message.content.startsWith(prefix + "prefix ")) {
   let prefixNew = message.content.slice(prefix.length).match(/prefix ([\s\S]+)~\[END\]/)[1];
    if (!prefixNew) return message.channel.send("Please use the correct syntax!");
    try {
    let res = jsonfile.readFileSync("memory/prefix.json");
    res[message.guild.id] = prefixNew;
    jsonfile.writeFileSync("memory/prefix.json", res);
      message.channel.send("Prefix successfully changed!");
    } catch (e) {
      message.channel.send("An error has occured.")
    }
  }
  if (message.content === "snipers prefix") {
                         message.channel.send(jsonfile.readFileSync("memory/prefix.json")[message.guild.id])
                        }
}
}
                );

client.on('message', message => {
const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id]
  if (message == "snipers help") {
    message.author.send({embed: {
    color: 3447003,
    author: {
      name: "Sup peeps, want some help?",
      
    },
      //Title
    description: "The prefix is ``" + prefix + "`` peeps.",
    fields: [{                    
    name: "```help```",
    value: "``Brings up this menu``"
      },
      {
    name: "checkvoted",
    value: "``Checks if the user has voted, and if so, gives them the HONOURED role. To vote go to :`` https://discordbots.org/bot/445830911272026113"
      },        
      {
    name: "ping",
    value: "``Responds with the message ''pong''``"
      },
      {
    name: "pong",
    value: "``Responds with the message ''???''``"
      },
      {
    name: "tick",
    value: "``Responds with the message ''tock''``"
      },
         {
    name: "tock",
    value: "``Responds with the message ''???''``"
      },
      {
    name: "annoyeveryone",
    value: "``Responds with the emoji`` :regional_indicator_n: :regional_indicator_o: :regional_indicator_p: :regional_indicator_e:    :regional_indicator_m: :eight:."
      },      
      {
    name: "invitebot",
    value: "``DMs a link to invite the bot to your server.``"
      },    
      {
    name: "serverinfo",
    value: "``Responds with the servers stats``"
      },    
      {
    name: "prefix",
    value: "``Changes the prefix, example : 'snipers prefix oofer gang ~[END] will set the prefix to oofer gang SPACEHERE'``"
      },            
    ],
      timestamp: new Date(),
      footer: {
      icon_url: client.user.avatarURL,
      text: "Bot created by Raxerz"
    }
  }
}
                         )
}
})
  
client.on('message', message => {
  const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id]
  if (message.content.startsWith(prefix + "prefix ")) {
   let prefixNew = message.content.slice(prefix.length).match(/prefix ([\s\S]+)~\[END\]/)[1];
    if (!prefixNew) message.channel.send("Please use the correct syntax!");
    try {
    let res = jsonfile.readFileSync("memory/prefix.json");
    res[message.guild.id] = prefixNew;
    jsonfile.writeFileSync("memory/prefix.json", res);
      message.channel.send("Prefix successfully changed!");
    } catch (e) {
      message.channel.send("An error has occured.")
    }
  }
  if (message.content === "snipers prefix") {
                         message.channel.send(jsonfile.readFileSync("memory/prefix.json")[message.guild.id])
                        }
}
)
client.on('message', message => {
  const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id]
  if (message == prefix + 'invitebot') {
    message.author.send({embed: {
    color: 217237,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Multi Discord Bot!",
    
    description: "",
    fields: [{
        name: "Invite with this link:",
        value: "https://discordapp.com/api/oauth2/authorize?client_id=445830911272026113&permissions=8&scope=bot"
      },
      {
        name: "Enjoy!",
        value: "I hope you enjoy my bot."
      },
    ],
      timestamp: new Date(),
      footer: {
      icon_url: client.user.avatarURL,
      text: "Bot created by Raxerz"
    }
  }
});
   }
}
)
client.on('message', message => {
  const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id]
  if (message.author === client.user) return;
  if (message == prefix + 'serverinfo') {
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username + "!    It's pretty cool right?",
      icon_url: client.user.avatarURL
    },
    title: "Welcome to " + message.guild.name + "!",
    url: "",
    description: "There is a total of " + message.guild.memberCount + " members in this server!",
    fields: [{
        name: "Enjoying the bot?",
        value: "Please consider supporting the bot by voting here : https://discordbots.org/bot/445830911272026113",
      },
    ],
      timestamp: new Date(),
      footer: {
      icon_url: client.user.avatarURL,
      text: "Bot created by Raxerz"
    }
  }
});
  }
}
          );
app.get("/dashboard/api/reconstruct", (req, res) => {
  if (checkAuth(req, ipToUser)) return res.send("<h1 class=\"user-title user-blurple\">You are not authenticated!</h1>");
  let channel = client.channels.find(channel => {
    try {
   if (!channel.guild.members.get(ipToUser[req.ip].id).hasPermission("ADMINISTRATOR")) return false;
    if (channel.type !== "text") return false;
      if (channel.name !== req.query.channel) return false;
    } catch (e) {
     return false; 
    }
    return true;
  })
  if (!channel) return res.send("<h1 class=\"user-title user-blurple\">Invalid channel!</h1>");
  channel.fetchMessages({limit: 100}).then(messages => {
    let str;
    for (let message of messages.array().reverse()) {
     str += `${message.author.tag}: ${message.content}
`;
    }
    res.send(`<textarea>${str.replace(/^undefined|undefined$/, "").replace(/<@(\d+)>/, (match, id) => {
      try {
      return "@" + client.users.get(id);
      } catch (e) {
        return match;
      }
    })}</textarea>`);
  });
});

client.on('message', message => {
  const prefix = jsonfile.readFileSync("memory/prefix.json")[message.guild.id]
  if (message.author === client.user) return;
  if (message == prefix + 'dashboard') {
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username + "!    It's pretty cool right?",
      icon_url: client.user.avatarURL
    },
    title: "Click me to go to the Multi Bot dashboard!",
    url: "https://discordapp.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fmulti-bot.glitch.me%2Foauth%2Freturn&scope=identify&client_id=445830911272026113",
    description: "",
    fields: [{
        name: "Enjoying the bot?",
        value: "Please consider supporting the bot by voting here : https://discordbots.org/bot/445830911272026113",
      },
    ],
      timestamp: new Date(),
      footer: {
      icon_url: client.user.avatarURL,
      text: "Bot created by Raxerz"
    }
  }
});
  }
}
          );
client.login(process.env.TOKEN);