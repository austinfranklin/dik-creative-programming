// =================================================================
// STUDENTUPPGIFT: INTERAKTIV STORYBOARD (p5.js)
// =================================================================
// I den här filen finns koden för din storyboard-animation.
// Uppgiften går ut på att ändra i koden nedan för att skapa
// din egen interaktiva berättelse.
//
// Leta efter kommentarer märkta med "STUDENT:" för att se var
// du kan och bör göra ändringar!
// =================================================================

// En global variabel som sparar alla bilder som laddas in
let bilder = {};

// Variabler för att hålla koll på storyboardens tillstånd
let nuvarandeScenIndex = 0; // Vilken scen visas just nu?
let scenStartRam = 0;       // Vilken bildruta (frameCount) startade scenen?
const SCEN_DURATION = 120;  // Hur många ramar (ca 2 sekunder vid 60fps) varar animationen?

// =================================================================
// STORYBOARD-DEFINITIONER (SCENER)
// Här definierar du alla scener i din storyboard.
//
// STUDENT:
// - Ändra 'imgName' och 'backgroundImageName' till HELA filnamnet (t.ex. 'austin.jpg' eller 'mattias.png').
// - Bilderna laddas in automatiskt, så du behöver bara ändra filnamnet här!
// - Varje scen kan ha en bakgrundsfärg (background) ELLER en bakgrundsbild (backgroundImageName).
// - Varje scen kan innehålla FLERA figurer samtidigt i listan "elements".
// =================================================================
let scener = [
  // SCEN 0: Startskärm (Visar flera figurer stående på rad)
  {
    text: "Lärarnas väg till skolan. Klicka på spelytan för att starta!",
    background: "#1e1b11", // Djup lila/blå färg
    elements: [
      // STUDENT: Här anger du bildernas hela filnamn (inklusive filändelse som .jpg eller .png)
      { imgName: 'austin.jpg', startX: 180, startY: 300, endX: 180, endY: 300, width: 100, height: 100 },
      { imgName: 'anders.jpg', startX: 320, startY: 300, endX: 320, endY: 300, width: 100, height: 100 },
      { imgName: 'mattias.png', startX: 480, startY: 300, endX: 480, endY: 300, width: 100, height: 100 },
      { imgName: 'martin.jpg', startX: 620, startY: 300, endX: 620, endY: 300, width: 100, height: 100 },
    ]
  },
  
  // SCEN 1: Austin promenerar
  {
    text: "Austin promenerar till fots. En skön morgonpromenad ger energi!",
    background: "#87CEEB", // Himmelsblå
    elements: [
      { 
        imgName: 'austin.jpg', 
        startX: -100,    // Startar utanför skärmen till vänster
        startY: 380, 
        endX: 300,       // Rör sig till mitten-vänster
        endY: 380, 
        width: 120, 
        height: 120
      }
    ]
  },
  
  // SCEN 2: Anders cyklar
  {
    text: "Anders cyklar i full fart! Miljövänligt och bra för konditionen.",
    background: "#a7f3d0", // Ljust grön
    elements: [
      { 
        imgName: 'anders.jpg', 
        startX: -120,    // Startar utanför skärmen
        startY: 400, 
        endX: 450,       // Rör sig förbi mitten
        endY: 400, 
        width: 120, 
        height: 120
      }
    ]
  },
  
  // SCEN 3: Mattias åker buss
  {
    text: "Mattias tar bussen. Perfekt tid för att läsa en bra bok!",
    background: "#bfdbfe", // Ljusblå
    elements: [
      { 
        imgName: 'mattias.png', 
        startX: 920,     // Startar utanför skärmen till höger
        startY: 390, 
        endX: 400,       // Rör sig in mot mitten
        endY: 390, 
        width: 125, 
        height: 125
      }
    ]
  },
  
  // SCEN 4: Martin flyger helikopter
  {
    text: "Martin flyger helikopter! Lite extremt, men han kommer garanterat i tid.",
    background: "#c084fc", // Ljus lila
    elements: [
      { 
        imgName: 'martin.jpg', 
        startX: -150,    // Flyger in diagonalt
        startY: 100, 
        endX: 500, 
        endY: 200, 
        width: 130, 
        height: 130
      }
    ]
  },
  
  // SCEN 5: Framme vid skolan! (Använder en bakgrundsbild och visar flera figurer samtidigt)
  {
    text: "Alla har kommit fram till Södertörns högskola! Dags att föreläsa. (Klicka för att börja om)",
    backgroundImageName: "skola.jpg", // Hela scenens bakgrund är nu en bild!
    elements: [
      // Här listar vi alla lärar-objekt som ska ritas ovanpå bakgrundsbilden:
      { imgName: 'austin.jpg', startX: 200, startY: 700, endX: 250, endY: 350, width: 85, height: 85 },
      { imgName: 'anders.jpg', startX: 300, startY: 700, endX: 350, endY: 350, width: 85, height: 85 },
      { imgName: 'mattias.png', startX: 500, startY: 700, endX: 450, endY: 350, width: 85, height: 85 },
      { imgName: 'martin.jpg', startX: 700, startY: 700, endX: 550, endY: 350, width: 85, height: 85 },
    ]
  }
];

// =================================================================
// PRELOAD: Här laddas alla bildfiler in automatiskt.
// Koden söker igenom 'scener'-arrayen ovan efter filnamn.
// Om en bild saknas ritas istället en cirkel så koden inte kraschar.
// =================================================================
function preload() {
  let alla = scener.flatMap(s => [s.backgroundImageName, ...(s.elements || []).map(el => el.imgName)
  ]).filter(Boolean);

  for (let namn of new Set(alla)) {
    bilder[namn] = laddaStoryboardBild('assets/' + namn);
  }
}

// =================================================================
// SETUP: Körs en gång när programmet startar.
// =================================================================
function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  
  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(CENTER);
  textFont('Inter');
  
  console.log("Setup klar. Storyboard redo!");
}

// =================================================================
// DRAW: Körs i en loop, ca 60 gånger i sekunden.
// =================================================================
function draw() {
  let scen = scener[nuvarandeScenIndex];
  
  // Rita bakgrunden för denna scen (antingen en fullskärmsbild eller en färg)
  if (scen.backgroundImageName) {
    ritaElement(scen.backgroundImageName, width / 2, height / 2, width, height);
  } else {
    background(scen.background || "#0f172a");
  }
  
  // Beräkna animationens framsteg (ett värde mellan 0.0 och 1.0)
  let förflutnaRamar = frameCount - scenStartRam;
  let t = constrain(förflutnaRamar / SCEN_DURATION, 0, 1);
  
  // STUDENT: För en mjukare rörelse (ease-in-out), ta bort kommentaren (//) på raden nedan:
  t = t * t * (3 - 2 * t);
  
  // Rita ut alla element som tillhör den här scenen
  if (scen.elements) {
    for (let el of scen.elements) {
      // Linjär interpolation (lerp) för att räkna ut nuvarande position
      let x = lerp(el.startX, el.endX, t);
      let y = lerp(el.startY, el.endY, t);
      
      ritaElement(el.imgName, x, y, el.width, el.height);
    }
  }
  
  // Rita textrutan längst ner på canvasen
  ritaTextRuta(scen.text);
}

// =================================================================
// RITA ELEMENT: Ritar bilden om den finns, annars en färgad cirkel.
// =================================================================
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

// =================================================================
// RITA TEXTRUTA: Visar berättelsen längst ner på skärmen.
// =================================================================
function ritaTextRuta(berattelseText) {
  push();
  noStroke();
  fill(15, 23, 42, 220); // Mörkblå bakgrund med opacitet
  rect(width / 2, height - 70, width - 40, 100, 12);
  
  stroke(255, 30);
  strokeWeight(1.5);
  noFill();
  rect(width / 2, height - 70, width - 40, 100, 12);
  
  noStroke();
  fill(248, 250, 252); // Ljus text
  textSize(18);
  textAlign(CENTER, CENTER);
  text(berattelseText, width / 2, height - 70, width - 80, 80);
  pop();
}

// =================================================================
// MUS-KLICK: Går vidare i berättelsen när man klickar på canvasen.
// =================================================================
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    nuvarandeScenIndex = (nuvarandeScenIndex + 1) % scener.length;
    
    scenStartRam = frameCount;
    
    console.log("Bytte till scen: " + nuvarandeScenIndex);
  }
}

// =================================================================
// HJÄLPFUNKTION: Laddar bild och sätter flagga vid framgång/fel
// =================================================================
function laddaStoryboardBild(sokvag) {
  let img = loadImage(
    sokvag,
    () => { img.isLoaded = true; },
    () => { img.isLoaded = false; }
  );
  return img;
}
