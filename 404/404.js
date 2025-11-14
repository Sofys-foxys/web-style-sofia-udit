document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game");
    const scoreEl = document.getElementById("score");
    const restartBtn = document.getElementById("restart");
    const ctx = canvas.getContext("2d");
  
    let W = canvas.width;
    let H = canvas.height;
  
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.width * 0.6;
      W = canvas.width;
      H = canvas.height;
    }
  
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
  
    // --- Estado del juego ---
    let rover = { x: W / 2, y: H - 80, vx: 0 };
    let rocks = [];
    let keys = {};
    let touchX = null;
    let score = 0;
    let spawnTimer = 0;
    let spawnInterval = 70;
    let running = true;
  
    function reset() {
      rover = { x: W / 2, y: H - 80, vx: 0 };
      rocks = [];
      score = 0;
      spawnTimer = 0;
      spawnInterval = 70;
      running = true;
      scoreEl.textContent = score;
      restartBtn.hidden = true;
      loop();
    }
  
    function spawnRock() {
      const r = 12 + Math.random() * 24;
      rocks.push({
        x: Math.random() * W,
        y: -r,
        r,
        vx: (Math.random() - 0.5) * 1,
        vy: 2 + Math.random() * 2
      });
    }
  
    // --- Dibujar rover ---
    function drawRover(x, y) {
      ctx.fillStyle = "#f3f3ff";
      ctx.fillRect(x - 18, y - 20, 36, 30);
      ctx.fillStyle = "#4c7dff";
      ctx.fillRect(x - 10, y - 14, 20, 12);
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(x - 12, y + 10, 8, 0, Math.PI * 2);
      ctx.arc(x + 12, y + 10, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  
    // --- Dibujar roca ---
    function drawRock(a) {
      ctx.fillStyle = "#6b3123";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  
    // --- Fondo Marte ---
    function drawBackground() {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#050816");
      grad.addColorStop(1, "#3b0a10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
  
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let i = 0; i < 30; i++) {
        ctx.fillRect((i * 53) % W, (i * 29) % H * 0.4, 2, 2);
      }
    }
  
    // --- Update ---
    function update() {
      // Movimiento
      if (keys.ArrowLeft) rover.vx = -4;
      else if (keys.ArrowRight) rover.vx = 4;
      else rover.vx *= 0.8;
  
      if (touchX !== null) {
        rover.vx = (touchX - rover.x) * 0.1;
      }
  
      rover.x += rover.vx;
      rover.x = Math.max(20, Math.min(W - 20, rover.x));
  
      // Aparecer rocas
      spawnTimer++;
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        spawnRock();
      }
  
      // Mover rocas
      rocks.forEach((a) => {
        a.x += a.vx;
        a.y += a.vy;
  
        // Fuera de pantalla
        if (a.y > H + 30) {
          score += 10;
          scoreEl.textContent = score;
        }
      });
  
      // Colisiones
      for (let a of rocks) {
        if (Math.hypot(a.x - rover.x, a.y - rover.y) < a.r + 20) {
          running = false;
          restartBtn.hidden = false;
        }
      }
  
      rocks = rocks.filter((a) => a.y < H + 40);
    }
  
    // --- Render ---
    function render() {
      drawBackground();
      rocks.forEach(drawRock);
      drawRover(rover.x, rover.y);
    }
  
    function loop() {
      if (running) requestAnimationFrame(loop);
      update();
      render();
    }
  
    // Input
    window.addEventListener("keydown", (e) => (keys[e.key] = true));
    window.addEventListener("keyup", (e) => (keys[e.key] = false));
  
    canvas.addEventListener("touchstart", (e) => {
      const rect = canvas.getBoundingClientRect();
      touchX = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width);
    });
  
    canvas.addEventListener("touchend", () => (touchX = null));
  
    restartBtn.addEventListener("click", reset);
  
    reset();
  });
  