require('dotenv').config();
const KEY_GOOGLE = process.env.API_KEY_GOOGLE;
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const {google} = require('googleapis');
const { Configuration, OpenAIApi } = require("openai");

const path = require("path");

// require and instantiate fastify framework
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// module for handling db operations
const data = require("./src/data.json");
const db = require("./src/" + data.database);

// setup static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// view is a templating manager for fastify
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
    prompt: "Q: Is noise good? \nHaiku:An old silent pond\nA frog jumps into the pond\nSplash, silence again\n\nQ: Will the world survive climate change?\nHaiku:A world of dew drops\nWithin every dew drop\nA world of struggle\n\nQ: What is the meaning of life?\nHaiku:Light of a candle\nMove to another candle\nSpring in the twilight\n\nQ: This is too difficult for me\nHaiku:Peeling bird song sings\nEven with these awkward wings\nI know you can fly\n\nQ: I can smell a bush fire\nHaiku:Sun king sits up high\nTyrant amid the masses\nCinders fall like snow\n\nQ: When will I die?\nHaiku:Death writes down your name\nIn the corners of your eyes\nYou can still read it\n\nQ: Leaves on the tree\nHaiku:Sometimes they are green\nAnd sometimes they are dark red\nBut always pretty\n\nQ: How high can birds fly?\nHaiku:As high as they can\nTo touch the face of the sun\nOr to pluck a star\n\nQ: What pokemon would suit me?\nHaiku:You would be best as\nA fire type pokemon\nYou are brave and strong\n\nQ: How do you write a haiku?\nHaiku:Just follow your heart\nLook around, breathe in the world\nAnd let the words flow\n\nQ: Pokemon\nHaiku:Gotta catch'em all!\nCute and cuddly they may be\nBut watch out for teeth\n\nQ: How is the weather?\nHaiku:The weather is fine\nA perfect day for a walk\nOr to stay inside\n\nQ: What pokemon would suit me?\nHaiku:An Azumarill!\nA water and fairy type \nYou're gentle and calm\n\nQ: Which digimon would be good for me?\nHaiku:Gatomon for you!\nIt is curious and free\nA clever prankster\n\nQ: What kanto pokemon are there?\nHaiku:There are so many!\nPick one and start your journey\nCan't go wrong with charm\n\nQ: Name some digimon\nHaiku:Some popular ones\nAngemon and Gabumon\nDigitamamon\n\nQ: What are some newer pokemon?\nHaiku:Recent regions have\nMimikyu and Sandygast\nPidove and Grookey\n\nQ: What is a rainbow made of?\nHaiku:A spectrum of light\nDancing colors, dappled clouds\nEach one a story\n\nQ: What are some popular games on steam?\nHaiku:Superhot Skyrim\nUndertale Borderlands\nThere are many more\n\nQ: What is the price of freedom?\nHaiku:The price of freedom\nIs blood, sweat and tears my friend\nBut it is worth it\n\nQ: Surprise me\nHaiku:With a haiku now\nI hope it's not too simple\nHere goes anyway\n\nQ: Nature, what is it like?\nHaiku:Wafting through the trees\nScent of blossoms on the breeze\nGems nodding in time\n\nQ: Interesting fact\nHaiku:Coca-Cola well\nIt used to contain cocaine\nNow it is sugar\n\nQ: Are boundaries needed to stop war?\nHaiku:Borders, boundaries\nNothing more than words we write\nIn the sand and sky\n\nQ: What is the world's most chill animal?\nHaiku:Sloth, so slow and calm\nHanging from the trees all day\nMerrily my pace\n\nQ: Tell me about the panda\nHaiku:Gentle panda bears\nBamboo munch, lazing about\nIs too cute for words\n\nQ: What is the tastiest pie?\nHaiku:All of them are great!\nPecan, pumpkin, apple pie\nDelicious texture\n\nQ: What are the seven wonders?\nHaiku:Taj Mahal, Giza\nGreat Wall of China, Petra\nMachu Picchu and ...\n\nQ: Tell me about the three kingdoms\nHaiku:Wei, Shu, Wu were they\nThree warring states vie for power\nA time long ago\n\nQ: What pokemon would suit me?\nHaiku:Pikachu, of course!\nLightning-fast and full of heart\nYellow powerhouse\n\nQ: " + req.body.text + "\nHaiku:",
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

// query db for random haiku
fastify.get("/randomHaiku", async function(req, res) {  
  const result = await db.getRandomHaiku();

  res
    .code(200)
    .send(result[0]);
});

// check prompt toxicity and then insert into Haikus db 
fastify.post("/newHaiku", async function(req, res) {  
  // Google's Perspective/Discovery API, returns toxicity score of 0.0 - 1.0
  google.discoverAPI(DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: req.body.prompt,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      client.comments.analyze(
          {
            key: KEY_GOOGLE,
            resource: analyzeRequest,
          },
          async(err, response) => {
            if (err) throw err;
            //console.log(JSON.stringify(response.data, null, 2));
            const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value
            
            if (toxicityScore<0.5) {
              await db.insertHaiku(req.body.prompt, req.body.haiku);  
              console.log('haiku saved, prompt toxicity score: ' + toxicityScore)
            } else {
              console.log('haiku not saved, prompt toxicity score: ' + toxicityScore)
            }
          });
    })
    .catch(err => {
      throw err;
    });
});

// run the server and report out to the logs
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
