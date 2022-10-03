/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// utilities
const fs = require("fs");

const dbFile = "./.data/haikus.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

/* 
We're using the sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
The async / await syntax lets us write the db operations in a way that won't block the app
*/
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
          "CREATE TABLE Haikus (id INTEGER PRIMARY KEY AUTOINCREMENT, prompt TEXT, haiku TEXT, time STRING)"
        );

        await db.run(
          "INSERT INTO Haikus (prompt, haiku, time) VALUES ('Is noise good?', 'An old silent pond\nA frog jumps into the pond\nSplash, silence again', DateTime('now')), ('Will the world survive climate change?', 'A world of dew drops\nWithin every dew drop\nA world of struggle', DateTime('now')), ('What is the meaning of life?', 'Light of a candle\nMove to another candle\nSpring in the twilight', DateTime('now')), ('This is too difficult for me', 'Peeling bird song sings\nEven with these awkward wings\nI know you can fly', DateTime('now')), ('I can smell a bush fire', 'Sun king sits up high\nTyrant amid the masses\nCinders fall like snow', DateTime('now')), ('When will I die?', 'Death writes down your name\nIn the corners of your eyes\nYou can still read it', DateTime('now')), ('Leaves on the tree', 'Sometimes they are green\nAnd sometimes they are dark red\nBut always pretty', DateTime('now')), ('How high can birds fly?', 'As high as they can\nTo touch the face of the sun\nOr to pluck a star', DateTime('now')), ('What pokemon would suit me?', 'You would be best as\nA fire type pokemon\nYou are brave and strong', DateTime('now')), ('How do you write a haiku?', 'Just follow your heart\nLook around, breathe in the world\nAnd let the words flow', DateTime('now')), ('Pokemon', 'Gotta catch''em all!\nCute and cuddly they may be\nBut watch out for teeth', DateTime('now')), ('How is the weather?', 'The weather is fine\nA perfect day for a walk\nOr to stay inside', DateTime('now')), ('What pokemon would suit me?', 'An Azumarill!\nA water and fairy type \nYou''re gentle and calm', DateTime('now')), ('Which digimon would be good for me?', 'Gatomon for you!\nIt is curious and free\nA clever prankster', DateTime('now')), ('What kanto pokemon are there?', 'There are so many!\nPick one and start your journey\nCan''t go wrong with charm', DateTime('now')), ('Name some digimon', 'Some popular ones\nAngemon and Gabumon\nDigitamamon', DateTime('now')), ('What are some newer pokemon?', 'Recent regions have\nMimikyu and Sandygast\nPidove and Grookey', DateTime('now')), ('What is a rainbow made of?', 'A spectrum of light\nDancing colors, dappled clouds\nEach one a story', DateTime('now')), ('What are some popular games on steam?', 'Superhot Skyrim\nUndertale Borderlands\nThere are many more', DateTime('now')), ('What is the price of freedom?', 'The price of freedom\nIs blood, sweat and tears my friend\nBut it is worth it', DateTime('now')), ('Surprise me', 'With a haiku now\nI hope it''s not too simple\nHere goes anyway', DateTime('now')), ('Nature, what is it like?', 'Wafting through the trees\nScent of blossoms on the breeze\nGems nodding in time', DateTime('now')), ('Interesting fact', 'Coca-Cola well\nIt used to contain cocaine\nNow it is sugar', DateTime('now')), ('Are boundaries needed to stop war?', 'Borders, boundaries\nNothing more than words we write\nIn the sand and sky', DateTime('now')), ('What is the world''s most chill animal?', 'Sloth, so slow and calm\nHanging from the trees all day\nMerrily my pace', DateTime('now')), ('Tell me about the panda', 'Gentle panda bears\nBamboo munch, lazing about\nIs too cute for words', DateTime('now')), ('What is the tastiest pie?', 'All of them are great!\nPecan, pumpkin, apple pie\nDelicious texture', DateTime('now')), ('What are the seven wonders?', 'Taj Mahal, Giza\nGreat Wall of China, Petra\nMachu Picchu and ...', DateTime('now')), ('Tell me about the three kingdoms', 'Wei, Shu, Wu were they\nThree warring states vie for power\nA time long ago', DateTime('now')), ('What pokemon would suit me?', 'Pikachu, of course!\nLightning-fast and full of heart\nYellow powerhouse', DateTime('now'))"
        );
      } else {
        console.log(await db.all("SELECT * from Haikus"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });


module.exports = {  
  getRandomHaiku: async () => {
    try {
      return await db.all("SELECT prompt,haiku FROM Haikus ORDER BY RANDOM() LIMIT 1");
    } catch (dbError) {
      console.error(dbError);
    }
  },
  insertHaiku: async (prompt, haiku) => {
    try {
        await db.run("INSERT INTO Haikus (prompt, haiku, time) VALUES (?, ?, DateTime('now'))", [
          prompt, 
          haiku
        ]);
      
      console.log(await db.all("SELECT * from Haikus"));
      return 'new haiku inserted'
    } catch (dbError) {
      console.error(dbError);
    }
  },
  getHaikus: async () => {
    // return most recent 20
    try {
      return await db.all("SELECT * from Haikus ORDER BY time DESC LIMIT 20");
    } catch (dbError) {
      console.error(dbError);
    }
  },
  resetHaikus: async () => {
    try {
      await db.run("DELETE FROM Haikus");
      
      await db.run(
        "INSERT INTO Haikus (prompt, haiku, time) VALUES ('Is noise good?', 'An old silent pond\nA frog jumps into the pond\nSplash, silence again', DateTime('now')), ('Will the world survive climate change?', 'A world of dew drops\nWithin every dew drop\nA world of struggle', DateTime('now')), ('What is the meaning of life?', 'Light of a candle\nMove to another candle\nSpring in the twilight', DateTime('now')), ('This is too difficult for me', 'Peeling bird song sings\nEven with these awkward wings\nI know you can fly', DateTime('now')), ('I can smell a bush fire', 'Sun king sits up high\nTyrant amid the masses\nCinders fall like snow', DateTime('now')), ('When will I die?', 'Death writes down your name\nIn the corners of your eyes\nYou can still read it', DateTime('now')), ('Leaves on the tree', 'Sometimes they are green\nAnd sometimes they are dark red\nBut always pretty', DateTime('now')), ('How high can birds fly?', 'As high as they can\nTo touch the face of the sun\nOr to pluck a star', DateTime('now')), ('What pokemon would suit me?', 'You would be best as\nA fire type pokemon\nYou are brave and strong', DateTime('now')), ('How do you write a haiku?', 'Just follow your heart\nLook around, breathe in the world\nAnd let the words flow', DateTime('now')), ('Pokemon', 'Gotta catch''em all!\nCute and cuddly they may be\nBut watch out for teeth', DateTime('now')), ('How is the weather?', 'The weather is fine\nA perfect day for a walk\nOr to stay inside', DateTime('now')), ('What pokemon would suit me?', 'An Azumarill!\nA water and fairy type \nYou''re gentle and calm', DateTime('now')), ('Which digimon would be good for me?', 'Gatomon for you!\nIt is curious and free\nA clever prankster', DateTime('now')), ('What kanto pokemon are there?', 'There are so many!\nPick one and start your journey\nCan''t go wrong with charm', DateTime('now')), ('Name some digimon', 'Some popular ones\nAngemon and Gabumon\nDigitamamon', DateTime('now')), ('What are some newer pokemon?', 'Recent regions have\nMimikyu and Sandygast\nPidove and Grookey', DateTime('now')), ('What is a rainbow made of?', 'A spectrum of light\nDancing colors, dappled clouds\nEach one a story', DateTime('now')), ('What are some popular games on steam?', 'Superhot Skyrim\nUndertale Borderlands\nThere are many more', DateTime('now')), ('What is the price of freedom?', 'The price of freedom\nIs blood, sweat and tears my friend\nBut it is worth it', DateTime('now')), ('Surprise me', 'With a haiku now\nI hope it''s not too simple\nHere goes anyway', DateTime('now')), ('Nature, what is it like?', 'Wafting through the trees\nScent of blossoms on the breeze\nGems nodding in time', DateTime('now')), ('Interesting fact', 'Coca-Cola well\nIt used to contain cocaine\nNow it is sugar', DateTime('now')), ('Are boundaries needed to stop war?', 'Borders, boundaries\nNothing more than words we write\nIn the sand and sky', DateTime('now')), ('What is the world''s most chill animal?', 'Sloth, so slow and calm\nHanging from the trees all day\nMerrily my pace', DateTime('now')), ('Tell me about the panda', 'Gentle panda bears\nBamboo munch, lazing about\nIs too cute for words', DateTime('now')), ('What is the tastiest pie?', 'All of them are great!\nPecan, pumpkin, apple pie\nDelicious texture', DateTime('now')), ('What are the seven wonders?', 'Taj Mahal, Giza\nGreat Wall of China, Petra\nMachu Picchu and ...', DateTime('now')), ('Tell me about the three kingdoms', 'Wei, Shu, Wu were they\nThree warring states vie for power\nA time long ago', DateTime('now')), ('What pokemon would suit me?', 'Pikachu, of course!\nLightning-fast and full of heart\nYellow powerhouse', DateTime('now'))"
      );
      return 'haikus resetted'
    } catch (dbError) {
      console.error(dbError);
    }
  }
};
