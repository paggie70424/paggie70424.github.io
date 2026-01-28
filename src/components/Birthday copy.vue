<template>
  <div class="birthday-container" ref="container">
    <!-- Background with gradient animation -->
    <div class="birthday-background"></div>

    <!-- Fireworks canvas -->
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>

    <!-- Floating particles (balloons, stars, confetti) -->
    <div class="particles-container">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :class="particle.type"
        :style="particle.style"
      >
        {{ particle.emoji }}
      </div>
    </div>

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- Animated cake -->
      <div class="cake-container">
        <div class="cake">
          <div class="candle-container">
            <div class="candle" v-for="n in 3" :key="n">
              <div class="flame">
                <div class="flame-inner"></div>
              </div>
            </div>
          </div>
          <div class="cake-top"></div>
          <div class="cake-middle"></div>
          <div class="cake-bottom"></div>
          <div class="cake-plate"></div>
        </div>
      </div>

      <!-- Blessing messages -->
      <div class="blessings">
        <h1 class="title">
          <span v-for="(char, i) in titleChars" :key="i" class="title-char" :style="{ animationDelay: `${i * 0.1}s` }">
            {{ char }}
          </span>
        </h1>

        <div class="messages">
          <p class="message message-1">
            <span class="sparkle">✨</span>
            {{ props.message1 || '大好年华' }}
            <span class="sparkle">✨</span>
          </p>
          <p class="message message-2">
            <span class="sparkle">🌟</span>
            {{ props.message2 || '前程似锦' }}
            <span class="sparkle">🌟</span>
          </p>
          <p class="message message-3">
            <span class="heart">💖</span>
            {{ props.message3 || '生日快乐' }}
            <span class="heart">💖</span>
          </p>
        </div>

        <div class="wish-card">
          <p>{{ props.customWish || '愿你的每一天都充满阳光与欢笑，愿所有美好都如期而至！' }}</p>
        </div>
      </div>
    </div>

    <!-- Decorative ribbons -->
    <div class="ribbons">
      <div class="ribbon ribbon-1"></div>
      <div class="ribbon ribbon-2"></div>
      <div class="ribbon ribbon-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  title?: string;
  message1?: string;
  message2?: string;
  message3?: string;
  customWish?: string;
}>();

const container = ref<HTMLElement | null>(null);
const fireworksCanvas = ref<HTMLCanvasElement | null>(null);

const titleChars = computed(() => (props.title || '生日快乐').split(''));

interface Particle {
  type: string;
  emoji: string;
  style: Record<string, string>;
}

const particles = ref<Particle[]>([]);

const emojis = {
  balloon: ['🎈', '🎈', '🎈', '🎈'],
  star: ['⭐', '🌟', '✨', '💫'],
  confetti: ['🎊', '🎉', '🎀', '🎁'],
  heart: ['💖', '💝', '💕', '💗']
};

function createParticles() {
  const newParticles: Particle[] = [];
  const types = Object.keys(emojis) as (keyof typeof emojis)[];

  for (let i = 0; i < 30; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const emojiList = emojis[type];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    newParticles.push({
      type,
      emoji,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 5}s`,
        fontSize: `${1.5 + Math.random() * 1.5}rem`
      }
    });
  }

  particles.value = newParticles;
}

// Fireworks animation
class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  particles: FireworkParticle[] = [];
  exploded = false;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight;
    this.targetY = Math.random() * canvasHeight * 0.5;
    this.speed = 3 + Math.random() * 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      this.y -= this.speed;

      // Draw trail
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      this.particles.forEach((p, i) => {
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      });
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 80; i++) {
      this.particles.push(new FireworkParticle(this.x, this.y, this.color));
    }
  }

  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

class FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha = 1;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.alpha -= 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

let fireworks: Firework[] = [];
let animationId: number;

function initFireworks() {
  const canvas = fireworksCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Randomly add new fireworks
    if (Math.random() < 0.03) {
      fireworks.push(new Firework(canvas.width, canvas.height));
    }

    fireworks.forEach((fw, i) => {
      fw.update(ctx);
      if (fw.isDead()) {
        fireworks.splice(i, 1);
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

onMounted(() => {
  createParticles();
  initFireworks();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.birthday-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.birthday-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #feca57,
    #48dbfb,
    #ff9ff3,
    #54a0ff,
    #5f27cd
  );
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: -50px;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0.3;
  }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
}

/* Cake styles */
.cake-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.cake {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.candle-container {
  display: flex;
  gap: 20px;
  margin-bottom: -5px;
  z-index: 1;
}

.candle {
  width: 10px;
  height: 40px;
  background: linear-gradient(to bottom, #ffeaa7, #fdcb6e);
  border-radius: 3px 3px 0 0;
  position: relative;
}

.flame {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 25px;
  background: radial-gradient(ellipse at bottom, #ffd700 0%, #ff6b35 50%, transparent 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flicker 0.3s ease-in-out infinite alternate;
}

.flame-inner {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 12px;
  background: radial-gradient(ellipse at bottom, #fff 0%, #ffd700 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

@keyframes flicker {
  0% { transform: translateX(-50%) scale(1) rotate(-2deg); }
  100% { transform: translateX(-50%) scale(1.1) rotate(2deg); }
}

.cake-top {
  width: 120px;
  height: 40px;
  background: linear-gradient(to bottom, #ff9ff3 0%, #f368e0 100%);
  border-radius: 10px 10px 0 0;
  position: relative;
  overflow: hidden;
}

.cake-top::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 10%;
  width: 80%;
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    #fff 0px,
    #fff 5px,
    transparent 5px,
    transparent 15px
  );
  border-radius: 4px;
}

.cake-middle {
  width: 150px;
  height: 50px;
  background: linear-gradient(to bottom, #ffeaa7 0%, #fdcb6e 100%);
  position: relative;
}

.cake-middle::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 5%;
  width: 90%;
  height: 10px;
  background: #e17055;
  border-radius: 5px;
}

.cake-bottom {
  width: 180px;
  height: 60px;
  background: linear-gradient(to bottom, #a29bfe 0%, #6c5ce7 100%);
  border-radius: 0 0 10px 10px;
  position: relative;
}

.cake-bottom::before {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 5%;
  width: 90%;
  height: 15px;
  background: repeating-linear-gradient(
    90deg,
    #fd79a8 0px,
    #fd79a8 10px,
    #e84393 10px,
    #e84393 20px
  );
  border-radius: 5px;
}

.cake-plate {
  width: 200px;
  height: 15px;
  background: linear-gradient(to bottom, #dfe6e9, #b2bec3);
  border-radius: 50%;
  margin-top: -5px;
}

/* Blessings */
.blessings {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  display: inline-block;
}

.title-char {
  display: inline-block;
  animation: bounce 0.6s ease infinite;
  background: linear-gradient(45deg, #fff, #ffd700, #ff69b4, #fff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: bounce 0.6s ease infinite, shimmer 2s linear infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.message {
  font-size: 2rem;
  font-weight: 600;
  animation: fadeInUp 1s ease forwards;
  opacity: 0;
}

.message-1 {
  animation-delay: 0.5s;
  color: #ffeaa7;
}

.message-2 {
  animation-delay: 1s;
  color: #81ecec;
}

.message-3 {
  animation-delay: 1.5s;
  color: #ff7675;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sparkle, .heart {
  display: inline-block;
  animation: twinkle 1s ease infinite;
}

@keyframes twinkle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.wish-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: pulse 2s ease infinite;
}

.wish-card p {
  font-size: 1.2rem;
  line-height: 1.8;
  margin: 0;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.5); }
}

/* Ribbons */
.ribbons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.ribbon {
  position: absolute;
  width: 200px;
  height: 30px;
  background: linear-gradient(90deg, #ff6b6b, #feca57);
  opacity: 0.7;
  animation: ribbon 10s linear infinite;
}

.ribbon-1 {
  top: 10%;
  animation-delay: 0s;
}

.ribbon-2 {
  top: 40%;
  animation-delay: -3s;
  background: linear-gradient(90deg, #48dbfb, #ff9ff3);
}

.ribbon-3 {
  top: 70%;
  animation-delay: -6s;
  background: linear-gradient(90deg, #54a0ff, #5f27cd);
}

@keyframes ribbon {
  0% {
    left: -200px;
    transform: rotate(-10deg);
  }
  100% {
    left: 100%;
    transform: rotate(10deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .message {
    font-size: 1.5rem;
  }

  .wish-card p {
    font-size: 1rem;
  }

  .cake-top { width: 80px; height: 30px; }
  .cake-middle { width: 100px; height: 35px; }
  .cake-bottom { width: 120px; height: 45px; }
  .cake-plate { width: 140px; height: 12px; }
  .candle { width: 8px; height: 30px; }
  .candle-container { gap: 15px; }
}
</style>
