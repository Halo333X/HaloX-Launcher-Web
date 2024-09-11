document.addEventListener("DOMContentLoaded", async () => {
  try {
    const eventData = await fetchEventData();
    configureBackground(eventData);
    setupEventListeners(eventData);

    updatePlayersOnline();
    setInterval(updatePlayersOnline, 1000);

    handleVideoPlayback();
  } catch (error) {
    console.error("Error en la inicialización:", error);
  }
});

async function fetchEventData() {
  const response = await fetch("https://halo333x.github.io/HaloX-Launcher-Web/event.json");
  return await response.json();
}

function configureBackground(eventData) {
  const backgroundContainer = document.getElementById("backgroundContainer");
  backgroundContainer.innerHTML = "";

  let element;
  if (eventData.backgroundIsVideo) {
    element = document.createElement("video");
    setupVideoElement(element, eventData.background);
  } else {
    element = document.createElement("img");
    setupImageElement(element, eventData.background);
  }
  backgroundContainer.appendChild(element);
}

function setupVideoElement(video, src) {
  video.id = "backgroundVideo";
  video.loop = true;
  video.volume = 0.5;
  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.src = src;
  setTimeout(() => video.play(), 2000);
}

function setupImageElement(img, src) {
  img.id = "backgroundImage";
  img.src = src;
  img.alt = "Background Image";
  img.style.position = "absolute";
  img.style.top = "0";
  img.style.left = "0";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
}

function setupEventListeners(eventData) {
  const startButton = document.getElementById("startButton");
  const downloadButton = document.getElementById("downloadButton");
  const reloadButton = document.getElementById("reloadButton");

  startButton.addEventListener("click", () => {
    handleStartButtonClick(eventData);
  });

  downloadButton.addEventListener("click", () => {
    handleDownloadButtonClick(eventData.packs);
  });

  reloadButton.addEventListener("click", () => {
    window.location.reload();
  });

  startButton.addEventListener("mousedown", () => startButton.classList.add("bounce"));
  startButton.addEventListener("animationend", () => startButton.classList.remove("bounce"));
}

async function handleStartButtonClick(eventData) {
  await openMinecraft(eventData.ip, eventData.port, eventData.serverStatus);
}

function handleDownloadButtonClick(packs) {
  downloadButton.classList.add("bounce");
  setTimeout(() => {
    downloadButton.classList.remove("bounce");
    if (packs) {
      openDownloadPacks(packs);
    } else {
      console.error("URL de los packs no disponible.");
    }
  }, 500);
}

async function updatePlayersOnline() {
  try {
    const res = await fetch('https://survivalcraft-6e68c-default-rtdb.firebaseio.com/serverStatus.json');
    const get = await res.json();
    const playersOnline = get ? get.playersOnline : 0;
    const ping = get ? get.latency : 0;
    updateStatusDisplay(playersOnline, ping);
  } catch (error) {
    console.error("Error fetching players online:", error);
  }
}

function updateStatusDisplay(playersOnline, ping) {
  const statusContainer = document.getElementById("status");
  const pingIcon = getPingIcon(ping);

  statusContainer.innerHTML = `
    <img id="statusIcon" src="./assets/playersIcon.png" alt="Players Icon" style="width: 20px; object-fit: contain;" />
    <span id="playersOnline">${playersOnline}</span>
    <img id="pingIcon" src="./assets/${pingIcon}" alt="Ping" style="width: 20px; object-fit: contain; margin-left: 10px;" />
    <span id="ping">${ping} ms</span>
  `;
}

function getPingIcon(ping) {
  if (ping <= 100) return "ping_green.png";
  else if (ping <= 150) return "ping_yellow.png";
  else return "ping_red.png";
}

function handleVideoPlayback() {
  const backgroundContainer = document.getElementById("backgroundContainer");
  const video = document.getElementById("backgroundVideo");

  document.addEventListener("click", () => {
    toggleVideoPlayback(video, backgroundContainer);
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      toggleVideoPlayback(video, backgroundContainer);
    }
  });
}

function toggleVideoPlayback(video, container) {
  if (video) {
    if (video.paused) {
      video.play().catch(console.error);
      container.style.opacity = "1";
    } else {
      video.pause();
      container.style.opacity = "0.5";
    }
  }
}

async function openMinecraft(serverUrl, serverPort, serverStatus) {
  const target = isMobile() ? "_blank" : "_self";
  const url = `minecraft://connect?serverUrl=${serverUrl}&serverPort=${serverPort}`;
  if (serverStatus) {
    window.open(url, target);
  } else {
    alert('Server not running!');
  }
}

function openDownloadPacks(url) {
  const target = isMobile() ? "_blank" : "_self";
  window.open(url, target);
}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}