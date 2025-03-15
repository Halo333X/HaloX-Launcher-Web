const db = 'https://bedrock-kingdoms-default-rtdb.firebaseio.com/';
const video = document.getElementById("background");

class Utils {
    // DB
    static async getData() {
        let data;
        await fetch(db + '.json').then(res => data = res.json());
        return data;
    }
    
    static async getServer() {
        const data = await this.getData();
        return {
          ip: data.ip,
          port: data.port,
          ping: data.ping,
          players: data.players,
          textures: data.textures
        };
    }

    // Launcher
    static reloadLauncher() {
        location.reload();
    }

    static pauseVideo() {
        const pauseIcon = document.getElementById('playicon');
        if (video.paused) {
            video.play();
            video.style.opacity = 1;
            pauseIcon.src = "./assets/playing_video.png";
        } else {
            video.pause();
            video.style.opacity = 0.5;
            pauseIcon.src = "./assets/pause_video.png";
        }
    }

    static async openMinecraft() {
        const server = await this.getServer();
        const { ip, port } = server;
        const target = this.isMobile() ? "_blank" : "_self";
        const url = `minecraft://connect?serverUrl=${ip}&serverPort=${port}`;
        setTimeout(() => {
            if (ip && port) {
            window.open(url, target);
            } else {
            console.error("No se pudieron obtener la IP y el puerto.");
            }
        }, 500);
    }

    static isMobile() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    static downloadTextures() {
        const target = isMobile() ? "_blank" : "_self";
        setTimeout(() => {
            if (packs) {
            window.open(packs, target);
            } else {
            console.error("No se pudo obtener el enlace de packs.");
            }
        }, 500);
    }

    static async updateLauncher() {
      const server = await this.getServer();
      const players = server.players || 0;
      const ping = server.ping || 1;
      const img = this.getPingIcon(ping);
      document.getElementById('players').innerText = players;
      document.getElementById('ping').innerText = ping + ' ms';
      document.getElementById('ping_icon').src = img;
  }  

    /**
     * @param ping {number}
    */
    static getPingIcon(ping) {
        if (ping <= 100) return "./assets/ping_green.png";
        else if (ping <= 150) return "./assets/ping_yellow.png";
        else return "./assets/ping_red.png";
    }
}

setTimeout(() => {
  video.play();
  video.muted = false;
}, 500);


setInterval(() => Utils.updateLauncher(), 1000);

video.addEventListener("click", () => Utils.pauseVideo());

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    Utils.pauseVideo();
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