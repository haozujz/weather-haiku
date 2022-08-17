//require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// test
fastify.get("/", async function(req, res) {  
  return res.view("/src/pages/index.hbs", {result: "Hello World!"});
});

// openai api call
fastify.post("/haiku", async function(req, res) {
  const configuration = new Configuration({
    apiKey: req.body.key,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Q: Is noise good? \nHaiku:\nAn old silent pond\nA frog jumps into the pond\nSplash, silence again\n\nQ: Will the world survive climate change?\nHaiku:\nA world of dew drops\nWithin every dew drop\nA world of struggle\n\nQ: What is the meaning of life?\nHaiku:\nLight of a candle\nMove to another candle\nSpring in the twilight\n\nQ: This is too difficult for me\nHaiku:\nPeeling bird song sings\nEven with these awkward wings\nI know you can can fly\n\nQ: I can smell a bush fire\nHaiku:\nSun king sits up high\nTyrant amid the masses\nCinders fall like snow\n\nQ: When will I die?\nHaiku:\nDeath writes down your name\nIn the corners of your eyes\nYou can still read it\n\nQ: Leaves on the tree\nHaiku:\nSometimes they are green\nAnd sometimes they are dark red\nBut always pretty\n\nQ: How high can birds fly?\nHaiku:\nAs high as they can\nTo touch the face of the sun\nOr to pluck a star\n\nQ: What pokemon would suit me?\nYou would be best as\nA fire type pokemon\nYou are brave and strong\n\nQ: How do you write a haiku?\nHaiku:\nJust follow your heart\nLook around, breathe in the world\nAnd let the words flow\n\nQ: Pokemon\nHaiku:\nGotta catch'em all!\nCute and cuddly they may be\nBut watch out for teeth\n\nQ: How is the weather?\nHaiku:\nThe weather is fine\nA perfect day for a walk\nOr to stay inside\n\nQ: What pokemon would suit me?\nAn Azumarill!\nA water and fairy type \nYou're gentle and calm\n\nQ: Which digimon would be good for me?\nHaiku:\nGatomon for you!\nIt is curious and free\nA clever prankster\n\nQ: What kanto pokemon are there?\nHaiku:\nThere are so many!\nPick one and start your journey\nCan't go wrong with charm\n\nQ: Name some digimon\nHaiku:\nSome popular ones\nAngemon and Gabumon\nDigitamamon\n\nQ: What are some newer pokemon?\nHaiku:\nRecent regions have\nMimikyu and Sandygast\nPidove and Grookey\n\nQ: What is a rainbow made of?\nHaiku:\nA spectrum of light\nDancing colors, dappled clouds\nEach one a story\n\nQ: What are some popular games on steam?\nHaiku:\nSuperhot Skyrim\nUndertale Borderlands\nThere are many more\n\nQ: What is the price of freedom?\nHaiku:\nThe price of freedom\nIs blood, sweat and tears my friend\nBut it is worth it\n\nQ: Surprise me\nHaiku:\nWith a haiku now\nI hope it's not too simple\nHere goes anyway\n\nQ: Nature, what is it like?\nHaiku:\nWafting through the trees\nScent of blossoms on the breeze\nGems nodding in time\n\nQ: Interesting fact\nHaiku:\nCoca-Cola well\nIt used to contain cocaine\nNow it is sugar\n\nQ: Are boundaries needed to stop war?\nHaiku:\nBorders, boundaries\nNothing more than words we write\nIn the sand and sky\n\nQ: What is the world's most chill animal?\nHaiku:\nSloth, so slow and calm\nHanging from the trees all day\nMerrily my pace\n\nQ: Tell me about the panda\nHaiku:\nGentle panda bears\nBamboo munch, lazing about\nIs too cute for words\n\nQ: What is the tastiest pie?\nHaiku:\nAll of them are great!\nPecan, pumpkin, apple pie\nDelicious texture\n\nQ: What are the seven wonders?\nHaiku:\nTaj Mahal, Giza\nGreat Wall of China, Petra\nMachu Picchu and ...\n\nQ: Tell me about the three kingdoms\nHaiku:\nWei, Shu, Wu were they\nThree warring states vie for power\nA time long ago\n\nQ: What pokemon would suit me?\nHaiku:\nPikachu, of course!\nLightning-fast and full of heart\nYellow powerhouse\n\nQ: " + req.body.text + "\nHaiku:\n",
    temperature: req.body.temp,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  }); 

  res
    .code(200)
    .send(response.data.choices[0].text);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);
