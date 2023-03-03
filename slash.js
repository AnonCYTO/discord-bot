const { REST, Routes } = require('discord.js')
const { clientId, guildId } = require('./config.json')
const token = process.env.token;
const fs = require('node:fs')
require('dotenv').config()

const commands = []
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token)

// and deploy your commands!
;(async () => {
  try {
    console.log(`Refreshing all applications commands...`)

    // The put method is used to fully refresh all commands with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    })

    console.log(`Reloaded ${commands.length} commands successfully.`)
    console.log('---------------------------------------')
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
