let currentCharRNN;
let textInput;
let lengthSlider;
let tempSlider;
let button;
let runningInference = false;
let txt;
const wiki = "https://en.wikipedia.org/wiki/";
const writers = [
  {
    key: "bolano",
    link: "Roberto_Bola%C3%B1o",
    name: "Roberto Bolaño"
  },
  {
    key: "charlotte_bronte",
    link: "Charlotte_Bront%C3%AB",
    name: "Charlotte Brontë"
  },
  {
    key: "darwin",
    link: "Charles_Darwin",
    name: "Charles Darwin"
  },
  {
    key: "dubois",
    link: "W._E._B._Du_Bois",
    name: "W. E. B. Du Bois"
  },
  {
    key: "hemingway",
    link: "Ernest_Hemingway",
    name: "Ernest Hemingway"
  },
  {
    key: "jkrowling_HP",
    link: "J._K._Rowling",
    name: "J. K. Rowling"
  },
  {
    key: "shakespeare",
    link: "William_Shakespeare",
    name: "William Shakespeare"
  },
  {
    key: "woolf",
    link: "Virginia_Woolf",
    name: "Virginia Woolf"
  },
  {
    key: "zora_neale_hurston",
    link: "Zora_Neale_Hurston",
    name: "Zora Neale Hurston"
  }
];

const models = {};

function setup() {
  noCanvas();
  initWriters();
  changeWriter(writers[0]);
  // Grab the DOM elements
  textInput = select("#textInput");
  lengthSlider = select("#lenSlider");
  tempSlider = select("#tempSlider");
  button = select("#generate");

  // DOM element events
  button.mousePressed(generate);
  lengthSlider.input(updateSliders);
  tempSlider.input(updateSliders);
}

function updateSliders() {
  select("#length").html(lengthSlider.value());
  select("#temperature").html(tempSlider.value());
}

function generate() {
  if (!runningInference) {
    runningInference = true;

    // Update the status log
    select("#status").html("Generating...");
    select("#result").html("");

    // Grab the original text
    txt = textInput.value().toLowerCase();

    // Check if there's something to send
    if (txt.length > 0) {
      let data = {
        seed: txt,
        temperature: tempSlider.value(),
        length: lengthSlider.value()
      };

      // Generate text with the currentCharRNN
      currentCharRNN.generate(data, gotData);
    }
  }
}

function gotData(err, result) {
  select("#status").html("");
  select("#result").html(txt + result.sample + "...");
  runningInference = false;
}

function initWriters() {
  writers.forEach(w => {
    createWritersButton(w);
    w.charRNN = ml5.charRNN(`./models/${w.key}/`, () => {
      console.log(`loaded ${w.name}`);
    });
  });
}

function createWritersButton(w) {
  let writerDiv = createDiv();
  let imgDiv = createDiv();
  let a = createA(`${wiki}${w.link}`, w.name);
  let img = createImg(`images/${w.key}.jpg`);
  img.style("width", "130");
  img.parent(imgDiv);
  img.mouseClicked(() => changeWriter(w));
  imgDiv.parent(writerDiv);
  a.parent(writerDiv);
  imgDiv.class("imgDiv");
  writerDiv.class("writerDiv");
  writerDiv.parent("writers");
  writerDiv.elt.data = w;
}

function changeWriter(w) {
  var writersDiv = selectAll(".writerDiv");
  writersDiv.forEach(div => {
    div.style("opacity", w.key === div.elt.data.key ? 1 : 0.5);
  });
  currentCharRNN = w.charRNN;
}
