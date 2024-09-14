let ip, port, packs;
const video = document.getElementById("background");

setTimeout(() => {
  video.muted = false;
}, 500);

function downloadPacks() {
  const target = isMobile() ? "_blank" : "_self";
  setTimeout(() => {
    if (packs) {
      window.open(packs, target);
    } else {
      console.error("No se pudo obtener el enlace de packs.");
    }
  }, 500);
}

function reloadLauncher() {
  location.reload();
}

function pauseVideo() {
  if (video.paused) {
    video.play();
    video.style.opacity = 1;
  } else {
    video.pause();
    video.style.opacity = 0.5;
  }
}

async function openMinecraft() {
  const target = isMobile() ? "_blank" : "_self";
  const url = `minecraft://connect?serverUrl=${ip}&serverPort=${port}`;
  setTimeout(() => {
    if (ip && port) {
      window.open(url, target);
    } else {
      console.error("No se pudieron obtener la IP y el puerto.");
    }
  }, 500);
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

async function updateServerInfo() {
  try {
    // Primera solicitud fetch para obtener datos del servidor (jugadores online y ping)
    const res = await fetch('https://survivalcraft-6e68c-default-rtdb.firebaseio.com/serverStatus.json');
    const get = await res.json(); // Leer el cuerpo de la respuesta solo una vez
    const playersOnline = get ? get.playersOnline : 0;
    const ping = get ? get.latency : 0;
    const img = getPingIcon(ping);
    document.getElementById('players').innerText = playersOnline;
    document.getElementById('ping').innerText = ping + ' ms';
    document.getElementById('ping_icon').src = img;

    // Segunda solicitud fetch para obtener event.json
    const server = await fetch('https://halo333x.github.io/HaloX-Launcher-Web/event.json');
    const eventData = await server.json(); // Leer el cuerpo de esta segunda respuesta
    if (eventData) {
      ip = eventData.ip;
      port = eventData.port;
      packs = eventData.packs;
    }
  } catch (error) {
    console.error("Error fetching server or event data:", error);
  }
}

setInterval(updateServerInfo, 1000);

function getPingIcon(ping) {
  if (ping <= 100) return "assets/ping_green.png";
  else if (ping <= 150) return "assets/ping_yellow.png";
  else return "assets/ping_red.png";
}

video.addEventListener("click", pauseVideo);

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    pauseVideo();
  }
});

// Añadir animación de rebote al botón Start
const startButton = document.querySelector('.button');
startButton.addEventListener('mousedown', function () {
  this.classList.add('bounce');
});

startButton.addEventListener('animationend', function () {
  this.classList.remove('bounce');
});
