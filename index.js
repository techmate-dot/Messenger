const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(
    "whatsbot"
  ),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

// Mention everyone
client.on("message", async (msg) => {
  console.log("message recieved");

  if (msg.body === "@everyone") {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);

      mentions.push(contact);
      text += `@${participant.id.user} `;
    }
    // Assuming you have the 'msg' object representing the received message with a reply
    if (msg.hasQuotedMsg) {
      const repliedMessage = await msg.getQuotedMessage();
      console.log("Bot Replied to message:", repliedMessage.body);
      await chat.sendMessage(text, { mentions });
      await repliedMessage.reply("IMPORTANT NOTICE");
    } else {
      await chat.sendMessage(text, { mentions });
    }
  }
});

client.initialize();
