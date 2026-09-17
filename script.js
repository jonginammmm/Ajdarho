const screen = document.getElementById('screen');
const N = 35;
const elems = [];
const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

let width = window.innerWidth;
let height = window.innerHeight;
let rad = 200;
let frm = 0;

// Oldingi elementlarni tozalash (agar bo'lsa)
screen.innerHTML = '';

for (let i = 0; i < N; i++) {
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  
  if (i === 0) {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Cabeza");
  } else if (i === 5 || i === 12) {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Aletas");
  } else {
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#Espina");
  }

  screen.appendChild(use);
  elems.push({
    use: use,
    x: width / 2,
    y: height / 2
  });
}

const updatePointer = (x, y) => {
  pointer.x = x;
  pointer.y = y;
};

window.addEventListener('pointermove', (e) => updatePointer(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
});

const run = () => {
  requestAnimationFrame(run);
  frm += 0.01;

  let e = elems[0];

  const ax = (Math.cos(3 * frm) * rad) / width;
  const ay = (Math.sin(4 * frm) * rad) / height;

  e.x += (ax + pointer.x - e.x) / 10;
  e.y += (ay + pointer.y - e.y) / 10;

  // Bosh qismini burish
  if (elems[1]) {
    const a0 = Math.atan2(e.y - elems[1].y, e.x - elems[1].x);
    e.use.setAttributeNS(
      null,
      "transform",
      `translate(${e.x}, ${e.y}) rotate(${(a0 * 180) / Math.PI})`
    );
  }

  // Tana va dum qismlarini tartib bilan ulash
  for (let i = 1; i < N; i++) {
    let e = elems[i];
    let ep = elems[i - 1];

    const a = Math.atan2(ep.y - e.y, ep.x - e.x);

    // Bo'g'inlar orasidagi elastik masofa va siljish
    e.x = ep.x - Math.cos(a) * 12;
    e.y = ep.y - Math.sin(a) * 12;

    e.use.setAttributeNS(
      null,
      "transform",
      `translate(${e.x}, ${e.y}) rotate(${(a * 180) / Math.PI})`
    );
  }
};

run();
