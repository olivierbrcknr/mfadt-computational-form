// require /text/tracery.min.js

// personal challenge

const storyGrammar = {
  story: [
    "It was a dark and stormy night. #phrase.capitalize#. Meanwhile, #phrase#. #phrase.capitalize#. #expression.capitalize#. #endphrase.capitalize# We will never know…",
  ],
  phrase: ["#subject# #duoverb# #object.a#"],
  expression: [
    "'Watch out!', shouted #subject#",
    "'What is that?', asked #subject#",
    "#subject# laughed",
  ],
  endphrase: ["Is this what #subject# #soloverb.ed#?"],
  subject: [
    "#noun.a#",
    "#adjective.a# #noun#",
    "#name#, the #adjective# #noun#,",
  ],
  object: [
    "#noun#",
    "#adjective# #noun#",
    "#adjective# #noun# and #adverb.a# #adjective# #noun#",
  ],

  adverb: [
    "exceptionally",
    "somewhat",
    "beautifully",
    "foolishly",
    "judgmentally",
  ],
  // add some eerie adjectives
  adjective: [
    "scary",
    "small",
    "big",
    "uncanny ",
    "strange  ",
    "frightening  ",
    "ghostly  ",
    "weird  ",
    "mysterious  ",
    "scary",
    "sinister  ",
    "uneasy  ",
    "fearful  ",
    "awesome  ",
    "unearthly  ",
    "supernatural  ",
    "unnatural  ",
    "spooky",
    "creepy",
    "spectral  ",
    "eldritch",
    "preternatural  ",
  ],
  // add some weird old german names
  name: [
    "Peter",
    "Rüdiger",
    "Gunhilde",
    "Hans",
    "Heribert",
    "Walter",
    "Frieda",
  ],
  // add some typical mythological animals and Zelda enemies
  noun: [
    "raven",
    "ghost",
    "bird",
    "witch",
    "cat",
    "moblin",
    "keese",
    "stalfos",
    "skulltula",
    "Deku Scrub",
    "octorok",
    "poe",
    "stalchild",
    "dodongo",
    "lizalfos",
    "gibdo",
  ],
  duoverb: [
    "looks at",
    "finds",
    "summons",
    "plots with",
    "has a drink with",
    "dances with",
    "glares at",
    "wonders about",
    "hides from",
    "plays catch with",
  ],
  soloverb: ["want", "create", "estimate", "expect", "guess", "ask", "book"],
};

const generateStory = () => {
  const grammar = tracery.createGrammar(storyGrammar);
  const story = grammar.flatten("#story#");

  const storyDiv = document.createElement("div");
  storyDiv.style = "font-size: 30px; margin: 10%; line-height: 1.5;"; // font-family: 'Papyrus'";
  storyDiv.textContent = story;

  document.body.insertAdjacentElement("beforeend", storyDiv);
};

setTimeout(generateStory, 10);
