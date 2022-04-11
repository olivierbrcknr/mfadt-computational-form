const thesis = `Insert String here`;

const model = generateModel(thesis);
const output_text = generateText(model);

document.body.innerHTML = output_text;
// console.log(output_text);

// creates a markov chain model based on one or more input strings
function generateModel(...args) {
  const words = args.join(" ").split(/ |—|”|“|\(Source\)/);
  const model = {};

  // loop through all the words except the last one.
  for (let i = 0; i < words.length - 1; i++) {
    const target_word = words[i];
    const next_word = words[i + 1];

    // if the model doesn't contain the target word, add it.
    if (!model[target_word]) {
      model[target_word] = [];
    }

    // add the next word to the possibilities for target_word
    model[target_word].push(next_word);
  }

  return model;
}

function generateText(model, first_word) {
  // if first_word isn't provided use a random word in the model object
  first_word = first_word || sample(Object.keys(model));

  // start with the word passed in
  let output_text = first_word;
  let current_word = first_word;
  for (let i = 0; i < 120; i++) {
    // choose the next word by sampling from options in the model
    current_word = sample(model[current_word]);

    // append word to output
    output_text += " ";
    output_text += current_word;

    // if we get to a word that ends with "." we are done.
    const last_character = current_word.substr(current_word.length - 1);
    if (last_character === ".") {
      break;
    }
  }
  return output_text;
}

function sample(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
