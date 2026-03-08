let img;
let path = [];
let barriers = [];
let inactiveBarriers = []; // Barreras que ya no colisionan
let isClosed = false;
let isExtracted = false;
let extracted;
let offset;
let velocity;
let barrierRadius = 20; // Radio de los círculos de barrera
let speed = 1.5; // Ajusta este valor para cambiar la velocidad de la selección

function preload() {
  img = loadImage('./face.jpg'); // Asegúrate de que "face.jpg" esté en la misma carpeta que "index.html" y "sketch.js"
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Resize con aspect ratio (fit-cover): escalar al mínimo que cubra el canvas
  let scaleW = windowWidth / img.width;
  let scaleH = windowHeight / img.height;
  let s = max(scaleW, scaleH);
  img.resize(floor(img.width * s), floor(img.height * s));
  offset = createVector(width / 2, height / 2); // Inicializa en el centro
  velocity = generateRandomVelocity(speed); // Velocidad inicial

  // Crear el botón "C"
  let closeButton = createButton('C');
  closeButton.position(10, 10); // Posicionar el botón a la izquierda
  closeButton.mousePressed(closeShape);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recargar la página para re-escalar la imagen correctamente
  location.reload();
}

function draw() {
  background(255);
  // Centrar imagen (fit-cover)
  let imgX = (width - img.width) / 2;
  let imgY = (height - img.height) / 2;
  image(img, imgX, imgY);

  // Dibuja la línea blanca para la selección
  stroke(255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of path) {
    vertex(v.x, v.y);
  }
  if (isClosed) {
    endShape(CLOSE);
  } else {
    endShape();
  }

  // Dibuja los círculos de barrera activos
  noStroke();
  fill(0, 0, 255, 100); // Barreras de color azul con transparencia
  for (let barrier of barriers) {
    ellipse(barrier.x, barrier.y, barrierRadius * 2, barrierRadius * 2);
  }

  // Dibuja los círculos de barrera inactivos
  fill(255, 0, 0, 100); // Barreras inactivas de color rojo con transparencia
  for (let barrier of inactiveBarriers) {
    ellipse(barrier.x, barrier.y, barrierRadius * 2, barrierRadius * 2);
  }

  if (isExtracted) {
    // Actualiza el desplazamiento de la selección
    offset.add(velocity);

    // Verifica colisiones con los bordes y ajusta la dirección
    if (offset.x < -extracted.width) {
      offset.x = width;
    }
    if (offset.x > width) {
      offset.x = -extracted.width;
    }
    if (offset.y < -extracted.height) {
      offset.y = height;
    }
    if (offset.y > height) {
      offset.y = -extracted.height;
    }

    // Verifica colisiones con las barreras
    let collidedBarrier = checkCollisionWithBarriers();
    if (collidedBarrier !== null) {
      velocity = generateRandomVelocity(speed); // Genera una nueva dirección y velocidad aleatoria
      barriers = barriers.filter(barrier => barrier !== collidedBarrier); // Elimina la barrera colisionada
      inactiveBarriers.push(collidedBarrier); // Añade a las barreras inactivas
      console.log("Collided with barrier. New velocity=" + velocity);
    }

    // Dibuja la selección
    image(extracted, offset.x, offset.y);
  }
}

// Registra los puntos del ratón para las barreras
function touchStarted() {
  if (isClosed && isExtracted) {
    barriers.push(createVector(mouseX, mouseY));
  }
  return false; // Previene el comportamiento por defecto del navegador
}

// Dibuja la línea mientras se mueve el dedo
function touchMoved() {
  if (!isClosed) {
    path.push(createVector(mouseX, mouseY));
  }
  return false; // Previene el comportamiento por defecto del navegador
}

// Cierra la forma cuando se presiona el botón
function closeShape() {
  if (path.length > 2) {
    let first = path[0];
    let last = path[path.length - 1];
    if (dist(first.x, first.y, last.x, last.y) < 10) {
      isClosed = true;
      console.log("Shape closed");
      if (!isExtracted) {
        extractShape();
      }
    }
  }
}

// Extrae y muestra la forma delimitada
function extractShape() {
  let mask = createGraphics(width, height);
  mask.beginDraw();
  mask.background(0);
  mask.fill(255);
  mask.noStroke();
  mask.beginShape();
  for (let v of path) {
    mask.vertex(v.x, v.y);
  }
  mask.endShape(CLOSE);
  mask.endDraw();

  extracted = createImage(width, height);
  extracted.copy(img, 0, 0, width, height, 0, 0, width, height);
  extracted.mask(mask);

  // Inicializa el primer desplazamiento
  offset = createVector(width / 2 - extracted.width / 2, height / 2 - extracted.height / 2); // Iniciar en el centro
  velocity = generateRandomVelocity(speed); // Genera una dirección y velocidad aleatoria
  isExtracted = true; // Asegurar que se marque como extraído
  console.log("Shape extracted");
}

function checkCollisionWithBarriers() {
  for (let barrier of barriers) {
    if (circleIntersectsRect(barrier, barrierRadius, offset, extracted.width, extracted.height)) {
      return barrier;
    }
  }
  return null;
}

function circleIntersectsRect(circlePos, radius, rectPos, rectWidth, rectHeight) {
  let testX = circlePos.x;
  let testY = circlePos.y;

  if (circlePos.x < rectPos.x) testX = rectPos.x;      
  else if (circlePos.x > rectPos.x + rectWidth) testX = rectPos.x + rectWidth;   
  if (circlePos.y < rectPos.y) testY = rectPos.y;      
  else if (circlePos.y > rectPos.y + rectHeight) testY = rectPos.y + rectHeight; 
  
  let distX = circlePos.x - testX;
  let distY = circlePos.y - testY;
  let distance = sqrt((distX * distX) + (distY * distY));

  return (distance <= radius);
}

function generateRandomVelocity(speed) {
  let angle = random(TWO_PI); // Genera un ángulo aleatorio
  return createVector(cos(angle) * speed, sin(angle) * speed);
}
