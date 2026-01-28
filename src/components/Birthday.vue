<template>
  <div class="birthday-container" ref="container">
    <!-- Custom cursor -->
    <div
      v-if="mouse.isActive"
      class="custom-cursor"
      :style="{ left: mouse.x + 'px', top: mouse.y + 'px' }"
    >
      <div class="cursor-text" v-if="cursorText">{{ cursorText }}</div>
      <div class="cursor-inner" v-else></div>
      <div class="cursor-outer"></div>
    </div>

    <!-- Background with gradient animation -->
    <div class="birthday-background"></div>

    <!-- Tech background canvas (data visualization, network nodes, binary streams) -->
    <canvas ref="techCanvas" class="tech-canvas"></canvas>

    <!-- Fireworks canvas -->
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>

    <!-- Floating tech code snippets -->
    <div class="code-rain">
      <div
        v-for="(code, index) in codeSnippets"
        :key="'code-' + index"
        class="code-snippet"
        :style="code.style"
      >
        {{ code.text }}
      </div>
    </div>

    <!-- Floating particles (balloons, stars, confetti, tech icons) -->
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
          <div class="title-glow"></div>
          <div class="title-sparkles">
            <span v-for="n in 12" :key="'spark-'+n" class="title-spark" :style="{ '--i': n }"></span>
          </div>
          <div class="title-text">
            <span v-for="(char, i) in titleChars" :key="i" class="title-char" :style="{ '--char-index': i, animationDelay: `${i * 0.15}s` }">
              {{ char }}
            </span>
          </div>
          <div class="title-reflection">
            <span v-for="(char, i) in titleChars" :key="'ref-'+i" class="reflection-char" :style="{ animationDelay: `${i * 0.15}s` }">
              {{ char }}
            </span>
          </div>
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
  cursorText?: string;
}>();

// Computed cursor text with default
const cursorText = computed(() => props.cursorText || '');

const container = ref<HTMLElement | null>(null);
const fireworksCanvas = ref<HTMLCanvasElement | null>(null);
const techCanvas = ref<HTMLCanvasElement | null>(null);

const titleChars = computed(() => (props.title || '生日快乐').split(''));

// Mouse position tracking
const mouse = ref({ x: -1000, y: -1000, isActive: false });
const mouseTrail = ref<{ x: number; y: number; alpha: number }[]>([]);

// Click effect types and data
interface ClickEffect {
  x: number;
  y: number;
  type: 'node' | 'firework' | 'particle' | 'ripple' | 'burst' | 'sparkle';
  startTime: number;
  duration: number;
  color: string;
  size: number;
  data?: any;
}

const clickEffects = ref<ClickEffect[]>([]);

interface Particle {
  type: string;
  emoji: string;
  style: Record<string, string>;
}

interface CodeSnippet {
  text: string;
  style: Record<string, string>;
}

const particles = ref<Particle[]>([]);
const codeSnippets = ref<CodeSnippet[]>([]);

const emojis = {
  balloon: ['🎈', '🎈', '🎈', '🎈'],
  star: ['⭐', '🌟', '✨', '💫'],
  confetti: ['🎊', '🎉', '🎀', '🎁'],
  heart: ['💖', '💝', '💕', '💗'],
  // ICT and Data Analysis related emojis
  tech: ['💻', '🖥️', '📊', '📈', '🔗', '⚡', '🌐', '📡', '🔒', '💾'],
  data: ['📉', '🗃️', '📋', '🧮', '🔬', '📱', '⌨️', '🖱️', '💡', '🚀'],
  // C3L Office related emojis
  office: ['📄', '📝', '📑', '📃', '📂', '🗂️', '📁', '✏️', '🖊️', '📎'],
  excel: ['📊', '📈', '📉', '🧮', '📋', '🗃️', '📁', '💹', '📑', '🔢'],
  presentation: ['📽️', '🎬', '🖼️', '📺', '🎨', '✨', '💡', '🎯', '📌', '🏆']
};

// Tech-related code snippets for floating animation
const techTexts = [
  'SELECT * FROM data',
  'import pandas as pd',
  'const data = await fetch()',
  'df.groupby().agg()',
  'CREATE TABLE analytics',
  'machine_learning.fit()',
  'neural_network.train()',
  'API.response(200)',
  'while(true) { analyze(); }',
  'def predict(x):',
  'JOIN ON user_id',
  'matplotlib.pyplot',
  'tensorflow.keras',
  'spark.sql(query)',
  'docker run --rm',
  'git push origin main',
  'npm install --save',
  'kubectl apply -f',
  'aws s3 sync',
  'python3 train.py',
  '{ "status": "ok" }',
  'HTTP/2 200 OK',
  'Bearer token',
  'BigQuery.execute()',
  'model.predict(X)',
  // C3L Data Science Hub related texts
  '=SUM(A1:A100)',
  '=VLOOKUP()',
  '=IF(A1>0,"Yes","No")',
  '=PIVOT_TABLE()',
  'Excel.Workbook.Open()',
  'PowerPoint.Slide.Add()',
  'Format.Cell.Style()',
  'Chart.Series.Add()',
  'Table.Sort.Ascending()',
  // C3L Data Science Hub specific
  'C3L.DataScience.Hub()',
  'DSH.Analytics.Run()',
  'UniSA.Certificate.Award()',
  'DataAnalyst.Train()',
  'CloudFoundation.Learn()',
  'DigitalCapabilities.Start()',
  'Industry.Mentorship()',
  'C3L.Project.Submit()',
  'DataScience.Visualize()',
  'MachineLearning.Model()',
  'BusinessChallenge.Solve()',
  'TeamCollab.Connect()',
  'C3L.Graduate.Path()',
  'RealWorld.Experience()',
];

function createParticles() {
  const newParticles: Particle[] = [];
  const types = Object.keys(emojis) as (keyof typeof emojis)[];

  for (let i = 0; i < 40; i++) {
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

function createCodeSnippets() {
  const snippets: CodeSnippet[] = [];

  for (let i = 0; i < 15; i++) {
    const text = techTexts[Math.floor(Math.random() * techTexts.length)];

    snippets.push({
      text,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 7}s`,
        fontSize: `${0.7 + Math.random() * 0.5}rem`,
        opacity: `${0.3 + Math.random() * 0.4}`
      }
    });
  }

  codeSnippets.value = snippets;
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
let techAnimationId: number;

// Mouse event handlers
function handleMouseMove(e: MouseEvent) {
  mouse.value.x = e.clientX;
  mouse.value.y = e.clientY;
  mouse.value.isActive = true;

  // Add to mouse trail
  mouseTrail.value.push({ x: e.clientX, y: e.clientY, alpha: 1 });
  if (mouseTrail.value.length > 20) {
    mouseTrail.value.shift();
  }
}

function handleMouseLeave() {
  mouse.value.isActive = false;
}

// Store reference to networkNodes for click detection
let networkNodesRef: NetworkNode[] = [];

function handleClick(e: MouseEvent) {
  const clickX = e.clientX;
  const clickY = e.clientY;
  let hitTarget = false;

  // 1. Check if clicked on a network node - creates expansion wave
  for (let i = 0; i < networkNodesRef.length; i++) {
    const node = networkNodesRef[i];
    const dx = clickX - node.x;
    const dy = clickY - node.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < node.radius + 20) {
      // Hit a network node! Create expansion wave effect
      hitTarget = true;
      clickEffects.value.push({
        x: node.x,
        y: node.y,
        type: 'node',
        startTime: Date.now(),
        duration: 1500,
        color: '#4FC3F7',
        size: 100,
        data: { nodeIndex: i }
      });

      // Push nearby nodes away
      networkNodesRef.forEach((otherNode, j) => {
        if (j !== i) {
          const odx = otherNode.x - node.x;
          const ody = otherNode.y - node.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < 200 && odist > 0) {
            const force = (200 - odist) / 200 * 3;
            otherNode.vx += (odx / odist) * force;
            otherNode.vy += (ody / odist) * force;
          }
        }
      });
      break;
    }
  }

  // 2. Check if clicked on exploding firework particles - creates sparkle shower
  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    if (fw.exploded && fw.particles.length > 0) {
      for (const p of fw.particles) {
        const dx = clickX - p.x;
        const dy = clickY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          // Hit a firework particle! Create sparkle shower
          hitTarget = true;
          clickEffects.value.push({
            x: p.x,
            y: p.y,
            type: 'sparkle',
            startTime: Date.now(),
            duration: 2000,
            color: p.color,
            size: 150,
            data: { particleCount: 30 }
          });

          // Make all particles in this firework scatter faster
          fw.particles.forEach(particle => {
            particle.vx *= 2;
            particle.vy *= 2;
            particle.alpha = Math.min(particle.alpha + 0.3, 1);
          });
          break;
        }
      }
    }

    // Check if clicked on rising firework trail
    if (!fw.exploded) {
      const dx = clickX - fw.x;
      const dy = clickY - fw.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 25) {
        // Hit a rising firework! Make it explode immediately with bigger explosion
        hitTarget = true;
        fw.targetY = fw.y; // Explode now
        clickEffects.value.push({
          x: fw.x,
          y: fw.y,
          type: 'burst',
          startTime: Date.now(),
          duration: 1000,
          color: fw.color,
          size: 200,
          data: { rings: 3 }
        });
      }
    }
  }

  // 3. Default action - create ripple effect and trigger new fireworks
  if (!hitTarget) {
    // Create ripple effect at click position
    clickEffects.value.push({
      x: clickX,
      y: clickY,
      type: 'ripple',
      startTime: Date.now(),
      duration: 1200,
      color: '#fd7800',
      size: 150,
      data: { rings: 4 }
    });

    // Trigger firework at click position
    const canvas = fireworksCanvas.value;
    if (canvas) {
      const fw = new Firework(canvas.width, canvas.height);
      fw.x = clickX;
      fw.y = canvas.height;
      fw.targetY = clickY;
      fireworks.push(fw);

      // Add extra fireworks around click
      for (let i = 0; i < 2; i++) {
        const extraFw = new Firework(canvas.width, canvas.height);
        extraFw.x = clickX + (Math.random() - 0.5) * 80;
        extraFw.y = canvas.height;
        extraFw.targetY = clickY + (Math.random() - 0.5) * 40;
        fireworks.push(extraFw);
      }
    }
  }

  // Clean up old effects
  const now = Date.now();
  clickEffects.value = clickEffects.value.filter(effect =>
    now - effect.startTime < effect.duration
  );
}

// Tech background elements
interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
}

interface DataPoint {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
}

interface BinaryStream {
  x: number;
  chars: string[];
  speed: number;
  color: string;
}

let networkNodes: NetworkNode[] = [];
// Assign to ref for click detection access
const updateNetworkNodesRef = () => { networkNodesRef = networkNodes; };
let dataPoints: DataPoint[] = [];
let binaryStreams: BinaryStream[] = [];

function initTechBackground() {
  const canvas = techCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNetworkNodes(canvas.width, canvas.height);
    initBinaryStreams(canvas.width, canvas.height);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function initNetworkNodes(width: number, height: number) {
    networkNodes = [];
    const nodeCount = Math.floor((width * height) / 25000);

    for (let i = 0; i < nodeCount; i++) {
      networkNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 3,
        color: `hsla(${180 + Math.random() * 60}, 80%, 60%, 0.6)`,
        connections: []
      });
    }

    // Create connections
    for (let i = 0; i < networkNodes.length; i++) {
      for (let j = i + 1; j < networkNodes.length; j++) {
        const dx = networkNodes[i].x - networkNodes[j].x;
        const dy = networkNodes[i].y - networkNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          networkNodes[i].connections.push(j);
        }
      }
    }

    // Update ref for click detection
    updateNetworkNodesRef();
  }

  function initBinaryStreams(width: number, height: number) {
    binaryStreams = [];
    const streamCount = Math.floor(width / 100);

    for (let i = 0; i < streamCount; i++) {
      const chars: string[] = [];
      const length = 10 + Math.floor(Math.random() * 20);
      for (let j = 0; j < length; j++) {
        chars.push(Math.random() > 0.5 ? '1' : '0');
      }
      binaryStreams.push({
        x: Math.random() * width,
        chars,
        speed: 1 + Math.random() * 2,
        color: `hsla(${120 + Math.random() * 60}, 100%, 50%, 0.3)`
      });
    }
  }

  // Data chart animation
  let chartPhase = 0;

  // C3L Office floating elements
  interface OfficeElement {
    x: number;
    y: number;
    type: 'excel' | 'word' | 'ppt' | 'c3l';
    scale: number;
    rotation: number;
    speed: number;
    opacity: number;
  }

  let officeElements: OfficeElement[] = [];

  function initOfficeElements() {
    officeElements = [];
    const types: ('excel' | 'word' | 'ppt' | 'c3l')[] = ['excel', 'word', 'ppt', 'c3l'];

    for (let i = 0; i < 8; i++) {
      officeElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        type: types[Math.floor(Math.random() * types.length)],
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.3
      });
    }
  }

  initOfficeElements();

  // Draw Excel spreadsheet icon
  function drawExcelIcon(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Document background
    ctx.fillStyle = '#217346';
    ctx.fillRect(-25, -30, 50, 60);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-20, -20 + i * 10);
      ctx.lineTo(20, -20 + i * 10);
      ctx.stroke();
    }

    // Vertical lines
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-20 + i * 13, -20);
      ctx.lineTo(-20 + i * 13, 20);
      ctx.stroke();
    }

    // "X" letter
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('X', 0, 5);

    ctx.restore();
  }

  // Draw Word document icon
  function drawWordIcon(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Document background
    ctx.fillStyle = '#2B579A';
    ctx.fillRect(-25, -30, 50, 60);

    // Text lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 5; i++) {
      const lineWidth = 30 - Math.random() * 10;
      ctx.fillRect(-15, -18 + i * 8, lineWidth, 3);
    }

    // "W" letter
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('W', 0, 5);

    ctx.restore();
  }

  // Draw PowerPoint slide icon
  function drawPPTIcon(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Slide background
    ctx.fillStyle = '#D24726';
    ctx.fillRect(-30, -22, 60, 44);

    // Inner slide area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(-25, -17, 50, 34);

    // Title bar
    ctx.fillStyle = 'rgba(210, 71, 38, 0.3)';
    ctx.fillRect(-22, -14, 44, 8);

    // Content placeholder
    ctx.fillStyle = 'rgba(210, 71, 38, 0.2)';
    ctx.fillRect(-22, -2, 44, 16);

    // "P" letter
    ctx.fillStyle = '#D24726';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('P', 0, 10);

    ctx.restore();
  }

  // Draw C3L Data Science Hub logo/badge (using official brand colors #fd7800, #ffb606)
  function drawC3LBadge(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Outer circle with C3L brand gradient (orange to golden yellow)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
    gradient.addColorStop(0, '#ffb606');  // Golden yellow
    gradient.addColorStop(0.6, '#fd7800'); // C3L orange
    gradient.addColorStop(1, '#e56600');  // Darker orange

    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fill();

    // C3L text
    ctx.fillStyle = '#fd7800';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C3L', 0, -5);

    // DSH subtitle
    ctx.fillStyle = '#333333';
    ctx.font = '7px Arial';
    ctx.fillText('Data Science', 0, 6);
    ctx.fillText('Hub', 0, 14);

    // Decorative data nodes around the badge
    ctx.fillStyle = '#fd7800';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const dotX = Math.cos(angle) * 27;
      const dotY = Math.sin(angle) * 27;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Connect nodes with lines
      if (i > 0) {
        const prevAngle = ((i - 1) / 6) * Math.PI * 2 - Math.PI / 2;
        const prevX = Math.cos(prevAngle) * 27;
        const prevY = Math.sin(prevAngle) * 27;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(253, 120, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(dotX, dotY);
        ctx.stroke();
      }
    }
    // Connect last to first
    const firstAngle = -Math.PI / 2;
    const lastAngle = (5 / 6) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(lastAngle) * 27, Math.sin(lastAngle) * 27);
    ctx.lineTo(Math.cos(firstAngle) * 27, Math.sin(firstAngle) * 27);
    ctx.stroke();

    ctx.restore();
  }

  // Draw UniSA affiliated badge
  function drawUniSABadge(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, opacity: number) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shield shape for university
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(20, -15);
    ctx.lineTo(20, 10);
    ctx.quadraticCurveTo(20, 25, 0, 30);
    ctx.quadraticCurveTo(-20, 25, -20, 10);
    ctx.lineTo(-20, -15);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, -25, 0, 30);
    gradient.addColorStop(0, '#fd7800');
    gradient.addColorStop(1, '#cc6200');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Inner area
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, -10);
    ctx.lineTo(14, 6);
    ctx.quadraticCurveTo(14, 18, 0, 22);
    ctx.quadraticCurveTo(-14, 18, -14, 6);
    ctx.lineTo(-14, -10);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();

    // UniSA text
    ctx.fillStyle = '#fd7800';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('UniSA', 0, 0);
    ctx.font = '6px Arial';
    ctx.fillText('×', 0, 8);
    ctx.fillText('C3L', 0, 15);

    ctx.restore();
  }

  // Draw mini Excel table in corner
  function drawMiniExcelTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.globalAlpha = 0.5;

    // Table background
    ctx.fillStyle = 'rgba(33, 115, 70, 0.3)';
    ctx.fillRect(x, y, 100, 70);

    // Header row
    ctx.fillStyle = 'rgba(33, 115, 70, 0.6)';
    ctx.fillRect(x, y, 100, 15);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;

    // Rows
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + i * 17.5);
      ctx.lineTo(x + 100, y + i * 17.5);
      ctx.stroke();
    }

    // Columns
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 25, y);
      ctx.lineTo(x + i * 25, y + 70);
      ctx.stroke();
    }

    // Column headers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '9px monospace';
    const headers = ['A', 'B', 'C', 'D'];
    headers.forEach((h, i) => {
      ctx.fillText(h, x + 10 + i * 25, y + 11);
    });

    // Some data values
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '8px monospace';
    const data = [
      ['123', '456', '789', '=SUM'],
      ['AAA', 'BBB', 'CCC', '1368'],
      ['X', 'Y', 'Z', '100%']
    ];
    data.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        ctx.fillText(cell, x + 3 + ci * 25, y + 28 + ri * 17.5);
      });
    });

    ctx.restore();
  }

  function drawBarChart(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    const barCount = 5;
    const barWidth = width / (barCount * 2);
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];

    for (let i = 0; i < barCount; i++) {
      const barHeight = (0.3 + 0.7 * Math.abs(Math.sin(chartPhase + i * 0.5))) * height;
      ctx.fillStyle = colors[i];
      ctx.globalAlpha = 0.4;
      ctx.fillRect(
        x + i * barWidth * 2,
        y + height - barHeight,
        barWidth,
        barHeight
      );
    }
    ctx.globalAlpha = 1;
  }

  function drawLineChart(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(72, 219, 251, 0.5)';
    ctx.lineWidth = 2;

    for (let i = 0; i <= 10; i++) {
      const px = x + (i / 10) * width;
      const py = y + height / 2 + Math.sin(chartPhase + i * 0.5) * (height / 3);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Area fill
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(72, 219, 251, 0.1)';
    ctx.fill();
  }

  function drawPieChart(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    const segments = [0.25, 0.35, 0.2, 0.2];
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];
    let startAngle = chartPhase;

    segments.forEach((segment, i) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, startAngle + segment * Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.globalAlpha = 0.3;
      ctx.fill();
      startAngle += segment * Math.PI * 2;
    });
    ctx.globalAlpha = 1;
  }

  function animateTech() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw binary streams (matrix-like effect)
    ctx.font = '12px monospace';
    binaryStreams.forEach((stream, idx) => {
      stream.chars.forEach((char, i) => {
        const y = ((Date.now() * stream.speed * 0.01 + i * 20) % (canvas.height + 400)) - 200;
        ctx.fillStyle = stream.color;
        ctx.fillText(char, stream.x, y);
      });

      // Randomly change some characters
      if (Math.random() < 0.02) {
        const idx = Math.floor(Math.random() * stream.chars.length);
        stream.chars[idx] = Math.random() > 0.5 ? '1' : '0';
      }
    });

    // Update and draw network nodes with mouse interaction
    networkNodes.forEach((node, i) => {
      // Mouse interaction - nodes are attracted/repelled by mouse
      if (mouse.value.isActive) {
        const dx = mouse.value.x - node.x;
        const dy = mouse.value.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist && dist > 0) {
          // Repel nodes away from mouse
          const force = (maxDist - dist) / maxDist * 0.5;
          node.vx -= (dx / dist) * force;
          node.vy -= (dy / dist) * force;

          // Highlight nodes near mouse
          node.color = `hsla(${30 + Math.random() * 30}, 100%, 60%, 0.8)`; // Orange highlight
        } else {
          // Reset color gradually
          node.color = `hsla(${180 + Math.random() * 60}, 80%, 60%, 0.6)`;
        }
      }

      // Apply friction
      node.vx *= 0.99;
      node.vy *= 0.99;

      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      // Draw connections
      node.connections.forEach(j => {
        const other = networkNodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Pulsing glow effect
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 3 + Math.sin(Date.now() * 0.005 + i) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = node.color.replace('0.6', '0.2');
      ctx.stroke();
    });

    // Draw mini charts in corners
    chartPhase += 0.02;

    // Top-left: Bar chart
    drawBarChart(ctx, 30, 30, 100, 60);

    // Top-right: Line chart
    drawLineChart(ctx, canvas.width - 150, 30, 120, 50);

    // Bottom-left: Pie chart
    drawPieChart(ctx, 60, canvas.height - 60, 40);

    // Draw floating data indicators
    const dataTexts = ['CPU: 67%', 'RAM: 4.2GB', 'Net: 125Mb/s', 'GPU: 45%'];
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(100, 255, 218, 0.4)';
    dataTexts.forEach((text, i) => {
      const x = canvas.width - 100;
      const y = canvas.height - 120 + i * 20;
      ctx.fillText(text, x, y);
    });

    // Draw C3L Office floating elements
    officeElements.forEach((elem, i) => {
      // Update position (slow floating movement)
      elem.y += elem.speed * Math.sin(Date.now() * 0.001 + i);
      elem.x += elem.speed * 0.3 * Math.cos(Date.now() * 0.0008 + i);
      elem.rotation += 0.002;

      // Keep in bounds
      if (elem.y < -50) elem.y = canvas.height + 50;
      if (elem.y > canvas.height + 50) elem.y = -50;
      if (elem.x < -50) elem.x = canvas.width + 50;
      if (elem.x > canvas.width + 50) elem.x = -50;

      // Draw based on type
      switch (elem.type) {
        case 'excel':
          drawExcelIcon(ctx, elem.x, elem.y, elem.scale, elem.opacity);
          break;
        case 'word':
          drawWordIcon(ctx, elem.x, elem.y, elem.scale, elem.opacity);
          break;
        case 'ppt':
          drawPPTIcon(ctx, elem.x, elem.y, elem.scale, elem.opacity);
          break;
        case 'c3l':
          drawC3LBadge(ctx, elem.x, elem.y, elem.scale, elem.opacity);
          break;
      }
    });

    // Draw mini Excel table in bottom right
    drawMiniExcelTable(ctx, canvas.width - 120, canvas.height - 100);

    // Draw C3L Data Science Hub branding in top center
    const centerX = canvas.width / 2;
    ctx.save();
    ctx.globalAlpha = 0.15;

    // Large background C3L badge
    drawC3LBadge(ctx, centerX, 60, 1.5, 0.3);

    // Draw "Data Science Hub" text
    ctx.fillStyle = '#fd7800';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.4;
    ctx.fillText('Data Science Hub', centerX, 110);

    ctx.restore();

    // Draw UniSA badge in corner
    drawUniSABadge(ctx, 50, canvas.height - 180, 0.8, 0.4);

    // Draw floating course names
    const courses = ['Data Analyst', 'Cloud Foundation', 'Digital Capabilities'];
    ctx.font = '9px Arial';
    ctx.fillStyle = 'rgba(253, 120, 0, 0.3)';
    courses.forEach((course, i) => {
      const courseX = 20 + (Date.now() * 0.02 + i * 100) % (canvas.width + 100) - 50;
      const courseY = 150 + i * 80;
      ctx.fillText(course, courseX, courseY);
    });

    // Draw mouse trail effect
    if (mouse.value.isActive && mouseTrail.value.length > 1) {
      ctx.save();

      // Draw trail
      for (let i = 1; i < mouseTrail.value.length; i++) {
        const point = mouseTrail.value[i];
        const prevPoint = mouseTrail.value[i - 1];

        const gradient = ctx.createLinearGradient(prevPoint.x, prevPoint.y, point.x, point.y);
        gradient.addColorStop(0, `rgba(253, 120, 0, ${point.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 182, 6, ${point.alpha * 0.5})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 + (i / mouseTrail.value.length) * 5;
        ctx.lineCap = 'round';
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Fade out trail
        point.alpha *= 0.92;
      }

      // Draw mouse glow effect
      const glowGradient = ctx.createRadialGradient(
        mouse.value.x, mouse.value.y, 0,
        mouse.value.x, mouse.value.y, 100
      );
      glowGradient.addColorStop(0, 'rgba(253, 120, 0, 0.3)');
      glowGradient.addColorStop(0.3, 'rgba(255, 182, 6, 0.15)');
      glowGradient.addColorStop(0.6, 'rgba(72, 219, 251, 0.1)');
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(mouse.value.x, mouse.value.y, 100, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw sparkles around mouse
      const sparkleCount = 6;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = (Date.now() * 0.003 + i * (Math.PI * 2 / sparkleCount)) % (Math.PI * 2);
        const radius = 30 + Math.sin(Date.now() * 0.005 + i) * 10;
        const sparkleX = mouse.value.x + Math.cos(angle) * radius;
        const sparkleY = mouse.value.y + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(Date.now() * 0.01 + i) * 0.3})`;
        ctx.fill();
      }

      ctx.restore();
    }

    // Clean up faded trail points
    mouseTrail.value = mouseTrail.value.filter(p => p.alpha > 0.05);

    // Draw click effects
    const now = Date.now();
    clickEffects.value.forEach((effect, index) => {
      const elapsed = now - effect.startTime;
      const progress = elapsed / effect.duration;

      if (progress >= 1) return;

      ctx.save();

      switch (effect.type) {
        case 'node':
          // Network node click - expanding rings with data particles
          const nodeRings = 3;
          for (let r = 0; r < nodeRings; r++) {
            const ringProgress = (progress + r * 0.15) % 1;
            const ringRadius = effect.size * ringProgress;
            const ringAlpha = 1 - ringProgress;

            ctx.beginPath();
            ctx.arc(effect.x, effect.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(79, 195, 247, ${ringAlpha * 0.8})`;
            ctx.lineWidth = 3 - ringProgress * 2;
            ctx.stroke();

            // Add data particles around the ring
            const particleCount = 8;
            for (let p = 0; p < particleCount; p++) {
              const angle = (p / particleCount) * Math.PI * 2 + progress * 2;
              const px = effect.x + Math.cos(angle) * ringRadius;
              const py = effect.y + Math.sin(angle) * ringRadius;
              ctx.beginPath();
              ctx.arc(px, py, 3 * (1 - ringProgress), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${ringAlpha})`;
              ctx.fill();
            }
          }

          // Central glow
          const nodeGlow = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, 40);
          nodeGlow.addColorStop(0, `rgba(79, 195, 247, ${0.6 * (1 - progress)})`);
          nodeGlow.addColorStop(1, 'rgba(79, 195, 247, 0)');
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, 40, 0, Math.PI * 2);
          ctx.fillStyle = nodeGlow;
          ctx.fill();
          break;

        case 'sparkle':
          // Firework particle click - sparkle shower effect
          const sparkleCount = effect.data?.particleCount || 20;
          for (let s = 0; s < sparkleCount; s++) {
            const angle = (s / sparkleCount) * Math.PI * 2;
            const distance = effect.size * progress * (0.5 + Math.random() * 0.5);
            const sx = effect.x + Math.cos(angle) * distance;
            const sy = effect.y + Math.sin(angle) * distance + progress * 50; // gravity
            const sparkleSize = 4 * (1 - progress);

            // Star shape
            ctx.beginPath();
            for (let p = 0; p < 5; p++) {
              const starAngle = (p / 5) * Math.PI * 2 - Math.PI / 2;
              const innerAngle = starAngle + Math.PI / 5;
              const outerR = sparkleSize;
              const innerR = sparkleSize * 0.4;

              if (p === 0) {
                ctx.moveTo(sx + Math.cos(starAngle) * outerR, sy + Math.sin(starAngle) * outerR);
              } else {
                ctx.lineTo(sx + Math.cos(starAngle) * outerR, sy + Math.sin(starAngle) * outerR);
              }
              ctx.lineTo(sx + Math.cos(innerAngle) * innerR, sy + Math.sin(innerAngle) * innerR);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 215, 0, ${(1 - progress) * 0.8})`;
            ctx.fill();
          }
          break;

        case 'burst':
          // Rising firework click - immediate explosion burst
          const burstRings = effect.data?.rings || 3;
          for (let r = 0; r < burstRings; r++) {
            const burstProgress = Math.min(1, progress * 2 + r * 0.1);
            const burstRadius = effect.size * burstProgress;
            const burstAlpha = (1 - burstProgress) * 0.8;

            // Outer ring
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, burstRadius, 0, Math.PI * 2);
            ctx.strokeStyle = effect.color.replace(')', `, ${burstAlpha})`).replace('hsl', 'hsla');
            ctx.lineWidth = 5 - burstProgress * 4;
            ctx.stroke();

            // Inner filled circle
            if (r === 0) {
              const innerGlow = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, burstRadius * 0.5);
              innerGlow.addColorStop(0, `rgba(255, 255, 255, ${burstAlpha})`);
              innerGlow.addColorStop(1, effect.color.replace(')', `, ${burstAlpha * 0.3})`).replace('hsl', 'hsla'));
              ctx.beginPath();
              ctx.arc(effect.x, effect.y, burstRadius * 0.5, 0, Math.PI * 2);
              ctx.fillStyle = innerGlow;
              ctx.fill();
            }
          }

          // Flying debris
          const debrisCount = 12;
          for (let d = 0; d < debrisCount; d++) {
            const debrisAngle = (d / debrisCount) * Math.PI * 2;
            const debrisDist = effect.size * 0.8 * progress;
            const dx = effect.x + Math.cos(debrisAngle) * debrisDist;
            const dy = effect.y + Math.sin(debrisAngle) * debrisDist;

            ctx.beginPath();
            ctx.arc(dx, dy, 3 * (1 - progress), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(1 - progress) * 0.9})`;
            ctx.fill();
          }
          break;

        case 'ripple':
        default:
          // Default ripple effect
          const rippleRings = effect.data?.rings || 4;
          for (let r = 0; r < rippleRings; r++) {
            const rippleProgress = (progress + r * 0.2) % 1;
            const rippleRadius = effect.size * rippleProgress;
            const rippleAlpha = (1 - rippleProgress) * 0.6;

            ctx.beginPath();
            ctx.arc(effect.x, effect.y, rippleRadius, 0, Math.PI * 2);

            // C3L brand color gradient
            const rippleGradient = ctx.createRadialGradient(
              effect.x, effect.y, rippleRadius * 0.8,
              effect.x, effect.y, rippleRadius
            );
            rippleGradient.addColorStop(0, `rgba(253, 120, 0, 0)`);
            rippleGradient.addColorStop(1, `rgba(253, 120, 0, ${rippleAlpha})`);
            ctx.strokeStyle = rippleGradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Center pulse
          const pulseSize = 20 * (1 - progress);
          const pulseGlow = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, pulseSize);
          pulseGlow.addColorStop(0, `rgba(255, 182, 6, ${0.8 * (1 - progress)})`);
          pulseGlow.addColorStop(1, 'rgba(253, 120, 0, 0)');
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = pulseGlow;
          ctx.fill();
          break;
      }

      ctx.restore();
    });

    // Clean up finished effects
    clickEffects.value = clickEffects.value.filter(effect =>
      now - effect.startTime < effect.duration
    );

    techAnimationId = requestAnimationFrame(animateTech);
  }

  animateTech();
}

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
  createCodeSnippets();
  initTechBackground();
  initFireworks();

  // Add mouse event listeners to container
  const containerEl = container.value;
  if (containerEl) {
    containerEl.addEventListener('mousemove', handleMouseMove);
    containerEl.addEventListener('mouseleave', handleMouseLeave);
    containerEl.addEventListener('click', handleClick);
  }
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (techAnimationId) {
    cancelAnimationFrame(techAnimationId);
  }

  // Remove mouse event listeners
  const containerEl = container.value;
  if (containerEl) {
    containerEl.removeEventListener('mousemove', handleMouseMove);
    containerEl.removeEventListener('mouseleave', handleMouseLeave);
    containerEl.removeEventListener('click', handleClick);
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
  cursor: none;
}

.birthday-container:hover {
  cursor: none;
}

/* Custom cursor */
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

/* Cursor text style */
.cursor-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
  background: linear-gradient(135deg, #fff 0%, #ffd700 30%, #ff69b4 60%, #fd7800 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: cursorTextShimmer 2s linear infinite, cursorTextPulse 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(253, 120, 0, 0.8))
          drop-shadow(0 0 15px rgba(255, 182, 6, 0.6))
          drop-shadow(0 0 25px rgba(255, 105, 180, 0.4));
  text-shadow: none;
  letter-spacing: 2px;
}

@keyframes cursorTextShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes cursorTextPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 8px rgba(253, 120, 0, 0.8))
            drop-shadow(0 0 15px rgba(255, 182, 6, 0.6))
            drop-shadow(0 0 25px rgba(255, 105, 180, 0.4));
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    filter: drop-shadow(0 0 12px rgba(253, 120, 0, 1))
            drop-shadow(0 0 20px rgba(255, 182, 6, 0.8))
            drop-shadow(0 0 35px rgba(255, 105, 180, 0.6));
  }
}

.cursor-inner {
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #fff 0%, #fd7800 100%);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #fd7800, 0 0 20px #ffb606;
  animation: cursorPulse 1s ease-in-out infinite;
}

.cursor-outer {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(253, 120, 0, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: cursorRotate 3s linear infinite, cursorPulse 1s ease-in-out infinite alternate;
}

.cursor-outer::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #ffb606;
  border-radius: 50%;
}

.cursor-outer::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #48dbfb;
  border-radius: 50%;
}

@keyframes cursorPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

@keyframes cursorRotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
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

.tech-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  opacity: 0.8;
}

.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
}

.code-snippet {
  position: absolute;
  top: -50px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  color: rgba(100, 255, 218, 0.6);
  text-shadow: 0 0 10px rgba(100, 255, 218, 0.8);
  white-space: nowrap;
  animation: codeFall linear infinite;
}

@keyframes codeFall {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
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
  font-size: 5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  perspective: 500px;
}

/* Background glow effect */
.title-glow {
  position: absolute;
  width: 120%;
  height: 150%;
  top: -25%;
  left: -10%;
  background: radial-gradient(ellipse at center,
    rgba(255, 215, 0, 0.4) 0%,
    rgba(255, 105, 180, 0.2) 30%,
    rgba(253, 120, 0, 0.1) 60%,
    transparent 80%);
  filter: blur(30px);
  animation: glowPulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Sparkles around title */
.title-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.title-spark {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffd700, 0 0 20px #ff69b4, 0 0 30px #fff;
  animation: sparkFloat 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.25s);
}

.title-spark:nth-child(1) { left: 5%; top: 10%; }
.title-spark:nth-child(2) { left: 15%; top: 80%; }
.title-spark:nth-child(3) { left: 25%; top: 5%; }
.title-spark:nth-child(4) { left: 35%; top: 90%; }
.title-spark:nth-child(5) { left: 50%; top: 0%; }
.title-spark:nth-child(6) { left: 65%; top: 85%; }
.title-spark:nth-child(7) { left: 75%; top: 10%; }
.title-spark:nth-child(8) { left: 85%; top: 75%; }
.title-spark:nth-child(9) { left: 95%; top: 20%; }
.title-spark:nth-child(10) { left: 10%; top: 50%; }
.title-spark:nth-child(11) { left: 90%; top: 50%; }
.title-spark:nth-child(12) { left: 50%; top: 95%; }

@keyframes sparkFloat {
  0%, 100% {
    opacity: 0;
    transform: scale(0) translateY(0);
  }
  20% {
    opacity: 1;
    transform: scale(1) translateY(-5px);
  }
  80% {
    opacity: 1;
    transform: scale(1) translateY(5px);
  }
}

/* Main title text */
.title-text {
  display: flex;
  gap: 0.1em;
  position: relative;
  z-index: 2;
}

.title-char {
  display: inline-block;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-weight: 900;
  font-size: 1em;
  background: linear-gradient(
    135deg,
    #fff 0%,
    #ffd700 15%,
    #ff69b4 30%,
    #ff6b6b 45%,
    #ffd700 60%,
    #00d4ff 75%,
    #ff69b4 90%,
    #fff 100%
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))
          drop-shadow(0 0 20px rgba(255, 105, 180, 0.3))
          drop-shadow(0 0 40px rgba(253, 120, 0, 0.2));
  animation:
    charBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite,
    rainbowShift 4s linear infinite,
    charRotate 6s ease-in-out infinite;
  animation-delay: calc(var(--char-index) * 0.15s);
  transform-origin: center bottom;
}

.title-char:hover {
  animation-play-state: paused;
  transform: scale(1.3) translateY(-10px) rotateY(15deg);
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))
          drop-shadow(0 0 40px rgba(255, 105, 180, 0.6));
}

@keyframes charBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-20px) scale(1.1);
  }
  50% {
    transform: translateY(-5px) scale(0.95);
  }
  75% {
    transform: translateY(-12px) scale(1.05);
  }
}

@keyframes rainbowShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes charRotate {
  0%, 100% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(5deg) rotateX(2deg);
  }
  50% {
    transform: rotateY(-5deg) rotateX(-2deg);
  }
  75% {
    transform: rotateY(3deg) rotateX(1deg);
  }
}

/* Reflection effect */
.title-reflection {
  display: flex;
  gap: 0.1em;
  position: relative;
  transform: rotateX(180deg) scaleY(0.4);
  margin-top: -0.3em;
  opacity: 0.3;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
  pointer-events: none;
}

.reflection-char {
  display: inline-block;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-weight: 900;
  font-size: 1em;
  background: linear-gradient(135deg, #ffd700 0%, #ff69b4 50%, #00d4ff 100%);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbowShift 4s linear infinite;
  filter: blur(1px);
}

/* Legacy keyframes kept for compatibility */
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
    font-size: 2.8rem;
  }

  .title-glow {
    filter: blur(20px);
  }

  .title-spark {
    width: 5px;
    height: 5px;
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
