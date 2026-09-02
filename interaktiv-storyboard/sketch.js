let bilder = {};
let nuvarandeScenIndex = 0;
let scenStartRam = 0;
const SCEN_DURATION = 120;

// STUDENT: Redigera eller lägg till scener i listan nedan!
// Tänk på syntax: separera egenskaper med komma (,) och rader med semikolon (;) när du skapar nya variabler.
let scener = [
  {
    text: "Lärarnas väg till skolan. Klicka på spelytan för att starta!",
    background: "#1e1b11",
    elements: [
      { imgName: 'austin.jpg', startX: 180, startY: 300, endX: 180, endY: 300, width: 100, height: 100 },
      { imgName: 'anders.jpg', startX: 320, startY: 300, endX: 320, endY: 300, width: 100, height: 100 },
      { imgName: 'mattias.png', startX: 480, startY: 300, endX: 480, endY: 300, width: 100, height: 100 },
      { imgName: 'martin.jpg', startX: 620, startY: 300, endX: 620, endY: 300, width: 100, height: 100 }
    ]
  },
  {
    text: "Austin promenerar till fots. En skön morgonpromenad ger energi!",
    background: "#87CEEB",
    elements: [
      { imgName: 'austin.jpg', startX: -100, startY: 380, endX: 300, endY: 380, width: 120, height: 120 }
    ]
  },
  {
    text: "Anders cyklar i full fart! Miljövänligt och bra för konditionen.",
    background: "#a7f3d0",
    elements: [
      { imgName: 'anders.jpg', startX: -120, startY: 400, endX: 450, endY: 400, width: 120, height: 120 }
    ]
  },
  {
    text: "Mattias tar bussen. Perfekt tid för att läsa en bra bok!",
    background: "#bfdbfe",
    elements: [
      { imgName: 'mattias.png', startX: 920, startY: 390, endX: 400, endY: 390, width: 125, height: 125 }
    ]
  },
  {
    text: "Martin flyger helikopter! Lite extremt, men han kommer garanterat i tid.",
    background: "#c084fc",
    elements: [
      { imgName: 'martin.jpg', startX: -150, startY: 100, endX: 500, endY: 200, width: 130, height: 130 }
    ]
  },
  {
    text: "Alla har kommit fram till Södertörns högskola! Dags att föreläsa. (Klicka för att börja om)",
    backgroundImageName: "skola.jpg",
    elements: [
      { imgName: 'austin.jpg', startX: 200, startY: 700, endX: 250, endY: 350, width: 85, height: 85 },
      { imgName: 'anders.jpg', startX: 300, startY: 700, endX: 350, endY: 350, width: 85, height: 85 },
      { imgName: 'mattias.png', startX: 500, startY: 700, endX: 450, endY: 350, width: 85, height: 85 },
      { imgName: 'martin.jpg', startX: 700, startY: 700, endX: 550, endY: 350, width: 85, height: 85 }
    ]
  }
];

function preload() {
  let alla = scener.flatMap(s => [s.backgroundImageName, ...(s.elements || []).map(el => el.imgName)]).filter(Boolean);
  for (let namn of new Set(alla)) {
    bilder[namn] = laddaStoryboardBild('assets/' + namn);
  }
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont('Inter');
}

function draw() {
  let scen = scener[nuvarandeScenIndex];
  
  if (scen.backgroundImageName) {
    ritaElement(scen.backgroundImageName, width / 2, height / 2, width, height);
  } else {
    background(scen.background || "#0f172a");
  }
  
  let förflutnaRamar = frameCount - scenStartRam;
  let t = constrain(förflutnaRamar / SCEN_DURATION, 0, 1);
  
  // STUDENT: Ta bort // i början av raden nedan för att aktivera easing!
  // t = t * t * (3 - 2 * t);
  
  if (scen.elements) {
    for (let el of scen.elements) {
      // STUDENT
      let x = lerp(el.startX, el.endX, t);
      let y = lerp(el.startY, el.endY, t);
      
      ritaElement(el.imgName, x, y, el.width, el.height);
    }
  }
  
  ritaTextRuta(scen.text);
}

function ritaElement(filnamn, x, y, w, h) {
  let img = bilder[filnamn];
  if (img && img.isLoaded) {
    image(img, x, y, w, h);
    return;
  }
  let namn = filnamn.split('.')[0];
  push();
  stroke(255);
  strokeWeight(2);
  ellipse(x, y, w || 100);
  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text(namn.charAt(0).toUpperCase() + namn.slice(1), x, y);
  pop();
}

function ritaTextRuta(berattelseText) {
  push();
  noStroke();
  fill(15, 23, 42, 220);
  rect(width / 2, height - 70, width - 40, 100, 12);
  stroke(255, 30);
  strokeWeight(1.5);
  noFill();
  rect(width / 2, height - 70, width - 40, 100, 12);
  noStroke();
  fill(248, 250, 252);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(berattelseText, width / 2, height - 70, width - 80, 80);
  pop();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    nuvarandeScenIndex = (nuvarandeScenIndex + 1) % scener.length;
    scenStartRam = frameCount;
  }
}

function laddaStoryboardBild(sokvag) {
  let img = loadImage(sokvag, () => { img.isLoaded = true; }, () => { img.isLoaded = false; });
  return img;
}