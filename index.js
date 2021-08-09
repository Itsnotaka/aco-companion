const Discord = require('discord.js');
// Create an instance of a Discord client
const client = new Discord.Client();
const { Webhook, MessageBuilder } = require('discord-webhook-node');
require('dotenv').config()
const statusHook = new Webhook(process.env.STATUSHOOK);
const acoHook = new Webhook(process.env.ACOHOOK)


client.on('ready', () => {
    const embed = new MessageBuilder()
    .setTitle('ACO Bot Status')
    .setAuthor('Version 1.0.0')
    .addField('Status', ':green_circle:')
    .setColor('#b17bff')
    .setTimestamp();

    statusHook.send(embed);
});

client.on('message', async msg => {
    if (msg.channel.type === 'dm'){
            if(msg.content === '.aco') {
                const firstEmbed = new Discord.MessageEmbed()
	                .setColor('#b17bff')
	                .setTitle('Codex ACO Companion')
	                .setDescription('Please tell me what site you wish us to run for?\nExample: `Shopify`, `Footsites`, `YeezySupply`\nYou have 60 seconds to enter your answer')
	                .addFields(
		            { name: 'Status', value: '<a:99:714509842194104340> Waiting...' }
                    )
	                .setTimestamp()
                var firstMsg = await msg.channel.send(firstEmbed)
                msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                    {max: 1, time: 60000}).then(async collected => {
                        let siteResponse = collected.first().content.toLowerCase()
                        if(siteResponse){
                            firstEmbed.setDescription('Successfully set ACO site')
                            firstEmbed.fields[0] = {name : 'Status' , value : '<a:yes:752524278850781234>'}
                            firstEmbed.fields[1] ={ name: 'Site', value: `${siteResponse}` }
                            firstMsg.edit(firstEmbed)
                            const secondEmbed = new Discord.MessageEmbed()
	                            .setColor('#b17bff')
	                            .setTitle('Codex ACO Companion')
	                            .setDescription('Please tell me which drop would you wish us to run for?\nExample: `Dunks`, `Jordan 1s`, `Yeezy 350s`\nYou have 60 seconds to enter your answer')
	                            .addFields(
		                        { name: 'Status', value: '<a:99:714509842194104340> Waiting...' }
                                )
	                            .setTimestamp()
                            var secondMsg = await msg.channel.send(secondEmbed)
                            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                                {max: 1, time: 60000}).then(async collected => {
                                    let releaseResponse = collected.first().content.toLowerCase()
                                    if(releaseResponse){
                                        secondEmbed.setDescription('Successfully set ACO release')
                                        secondEmbed.fields[0] = {name : 'Status' , value : '<a:yes:752524278850781234>'}
                                        secondEmbed.fields[1] ={ name: 'Site', value: `${releaseResponse}` }
                                        secondMsg.edit(secondEmbed)
                                        const thirdEmbed = new Discord.MessageEmbed()
                                                .setColor('#b17bff')
	                                            .setTitle('Codex ACO Companion')
	                                            .setDescription('Please submit your profile **ONLY** in **AYCD/CSV** format, if you have no idea on how to submit, please refer to [this message](https://discord.com/channels/711947567528804412/821635777795588117/852136412291006474)\nYou have 60 seconds to upload your file')
	                                            .addFields(
		                                        { name: 'Status', value: '<a:99:714509842194104340> Waiting...' }
                                                )
	                                            .setTimestamp()
                                            var thirdMsg = await msg.channel.send(thirdEmbed)
                                            msg.channel.awaitMessages(m => m.author.id == msg.author.id,
                                            {max: 1, time: 60000}).then(async collected => {
                                                let acoFile = collected.first().attachments
                                                if(acoFile){
                                                    thirdEmbed.setDescription('Sending ACO details to Codex!')
                                                    thirdEmbed.fields[0] = {name : 'Status' , value : '<a:99:714509842194104340> Waiting...'}
                                                    thirdMsg.edit(thirdEmbed)
                                                    const embed = new MessageBuilder()
                                                    .setTitle('Codex ACO Profile')
                                                    .setAuthor(`${msg.author.username}`)
                                                    .addField('Site', `${siteResponse}`, true)
                                                    .addField('Release',`${releaseResponse}`, true)
                                                    .addField('Profiles',`[Click Here](${acoFile.map(MessageAttachment => MessageAttachment.url)[0].toString()})`, true)
                                                    .setColor('#b17bff')
                                                    .setDescription(`An ACO profile was submitted by <@${msg.author.id}>`)
                                                    .setTimestamp();
                                                     
                                                    await acoHook.send(embed)

                                                    thirdEmbed.setDescription('ACO details has been sent to Codex!')
                                                    thirdEmbed.fields[0] = {name : 'Status' , value : '<a:yes:752524278850781234>'}
                                                    thirdMsg.edit(thirdEmbed)

                                                } else {
                                                    const errorEmbed = new Discord.MessageEmbed()
                                                    .setColor('#ff0000')
                                                    .setTitle('Codex ACO Companion')
                                                    .setDescription("Error!")
                                                    .addFields(
                                                    { name: 'Reason', value: "Seems like you didn't upload a file" }
                                                    )
                                                    .setTimestamp()
                                            msg.channel.send(errorEmbed);
                                        }      
                                    })
                                }
                            })
                        }
        }).catch(err => {
            const errorEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Codex ACO Companion')
            .setDescription("Error!")
            .addFields(
            { name: 'Reason', value: 'No answer after 60 seconds' }
            )
            .setTimestamp()
        msg.channel.send(errorEmbed);})
    }}
});
client.login(process.env.LOGIN_TOKEN);