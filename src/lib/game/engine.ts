import { GameState, Entity } from './types';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private players: Entity[] = [];
  private platforms: Entity[] = [];
  private coins: Entity[] = [];
  private enemies: Entity[] = [];
  private lastTime: number = 0;
  private animationFrame: number = 0;

  private gravity: number = 0.5;
  private baseSpeed: number = 5;
  private currentSpeed: number = 5;
  private startTime: number = 0;
  private cameraX: number = 0;

  private sprites: HTMLImageElement | null = null;
  private onGameOver: (score: number, coins: number, distance: number) => void;

  constructor(canvas: HTMLCanvasElement, onGameOver: (score: number, coins: number, distance: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.state = this.getInitialState();
    this.onGameOver = onGameOver;
    this.loadAssets();
  }

  private loadAssets() {
    if (typeof window === 'undefined') return;
    const img = new Image();
    img.src = '/assets/sprites.png';
    img.onload = () => {
      this.sprites = img;
    };
  }

  private getInitialState(): GameState {
    return {
      score: 0,
      distance: 0,
      coins: 0,
      lives: 3,
      gameOver: false,
      paused: false,
      level: 1,
      invincible: false
    };
  }

  public start() {
    this.reset();
    this.loop(0);
  }

  public reset() {
    this.state = this.getInitialState();
    this.currentSpeed = this.baseSpeed;
    this.startTime = Date.now();
    this.cameraX = 0;
    this.players = [{
      x: 100, y: 300, width: 32, height: 48, 
      velocityX: 0, velocityY: 0, type: 'player', active: true 
    }];
    this.platforms = [
      { x: 0, y: 500, width: 800, height: 100, velocityX: 0, velocityY: 0, type: 'platform', active: true },
      { x: 400, y: 350, width: 200, height: 40, velocityX: 0, velocityY: 0, type: 'platform', active: true },
      { x: 700, y: 250, width: 200, height: 40, velocityX: 0, velocityY: 0, type: 'platform', active: true },
      { x: 1000, y: 400, width: 300, height: 40, velocityX: 0, velocityY: 0, type: 'platform', active: true },
    ];
    this.coins = [
      { x: 450, y: 300, width: 20, height: 20, velocityX: 0, velocityY: 0, type: 'coin', active: true },
      { x: 750, y: 200, width: 20, height: 20, velocityX: 0, velocityY: 0, type: 'coin', active: true },
    ];
    this.enemies = [
      { x: 800, y: 450, width: 32, height: 32, velocityX: -2, velocityY: 0, type: 'enemy', active: true },
    ];
  }

  private loop(timestamp: number) {
    if (this.state.paused || this.state.gameOver) return;

    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.draw();

    this.animationFrame = requestAnimationFrame((t) => this.loop(t));
  }

  private update(deltaTime: number) {
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.currentSpeed = this.baseSpeed + Math.floor(elapsed / 10) * 0.2;

    const player = this.players[0];
    if (player) {
      player.velocityY += this.gravity;
      player.x += player.velocityX;
      player.y += player.velocityY;

      // Platform collisions
      let onGround = false;
      for (const platform of this.platforms) {
        if (this.checkCollision(player, platform)) {
          if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            onGround = true;
          }
        }
      }

      // Camera follow
      if (player.x > this.cameraX + 400) {
        this.cameraX = player.x - 400;
      }

      // Coin collection
      this.coins = this.coins.filter(coin => {
        if (this.checkCollision(player, coin)) {
          this.state.coins++;
          return false;
        }
        return true;
      });

      // Enemy collision
      for (const enemy of this.enemies) {
        if (!enemy.active) continue;
        if (this.checkCollision(player, enemy)) {
          if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y) {
            // Stomp
            enemy.active = false;
            player.velocityY = -10;
            this.state.score += 500;
          } else if (!this.state.invincible) {
            this.handlePlayerDeath();
          }
        }
      }

      // Bounds
      if (player.y > this.canvas.height) {
        this.handlePlayerDeath();
      }
      if (player.x < this.cameraX) player.x = this.cameraX;
    }

    // Update enemies
    this.enemies.forEach(enemy => {
      if (!enemy.active) return;
      enemy.x += enemy.velocityX;
    });

    // Procedural Level Gen (Infinite)
    if (this.platforms[this.platforms.length - 1].x < this.cameraX + 1000) {
      this.generateNewChunk();
    }

    this.state.distance = Math.floor(player.x / 50);
    this.state.score = this.state.distance * 10 + this.state.coins * 100;
  }

  private generateNewChunk() {
    const lastPlatform = this.platforms[this.platforms.length - 1];
    const width = 100 + Math.random() * 200;
    const gap = 150 + Math.random() * 100;
    const y = 200 + Math.random() * 300;
    
    this.platforms.push({
      x: lastPlatform.x + lastPlatform.width + gap,
      y: y,
      width: width,
      height: 40,
      velocityX: 0, velocityY: 0, type: 'platform', active: true
    });

    if (Math.random() > 0.5) {
      this.coins.push({
        x: lastPlatform.x + lastPlatform.width + gap + width/2,
        y: y - 40,
        width: 20, height: 20, velocityX: 0, velocityY: 0, type: 'coin', active: true
      });
    }

    if (this.state.score > 500 && Math.random() > 0.7) {
      this.enemies.push({
        x: lastPlatform.x + lastPlatform.width + gap + width/2,
        y: y - 32,
        width: 32, height: 32, velocityX: -2, velocityY: 0, type: 'enemy', active: true
      });
    }
  }

  private handlePlayerDeath() {
    this.state.lives--;
    if (this.state.lives <= 0) {
      this.state.gameOver = true;
      this.onGameOver(this.state.score, this.state.coins, this.state.distance);
    } else {
      const player = this.players[0];
      player.x = this.cameraX + 50;
      player.y = 100;
      player.velocityY = 0;
      this.state.invincible = true;
      setTimeout(() => this.state.invincible = false, 2000);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-this.cameraX, 0);

    // Sky
    this.ctx.fillStyle = '#5c94fc';
    this.ctx.fillRect(this.cameraX, 0, this.canvas.width, this.canvas.height);

    // Platforms
    this.platforms.forEach(p => {
      this.ctx.fillStyle = '#8b4513';
      this.ctx.fillRect(p.x, p.y, p.width, p.height);
      this.ctx.fillStyle = '#228b22';
      this.ctx.fillRect(p.x, p.y, p.width, 8);
    });

    // Coins
    this.ctx.fillStyle = '#ffd700';
    this.coins.forEach(c => {
      this.ctx.beginPath();
      this.ctx.arc(c.x + c.width/2, c.y + c.height/2, c.width/2, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Enemies
    this.ctx.fillStyle = '#a52a2a';
    this.enemies.forEach(e => {
      if (e.active) this.ctx.fillRect(e.x, e.y, e.width, e.height);
    });

    // Player
    const player = this.players[0];
    if (player) {
      if (this.state.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        // Blink
      } else {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
      }
    }

    this.ctx.restore();

    // UI (Overlay)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(`SCORE: ${this.state.score.toString().padStart(6, '0')}`, 20, 40);
    this.ctx.fillText(`COINS: ${this.state.coins}`, 20, 70);
    this.ctx.fillText(`LIVES: ${this.state.lives}`, 20, 100);
  }

  private checkCollision(a: Entity, b: Entity): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  public handleInput(key: string, type: 'down' | 'up') {
    const player = this.players[0];
    if (!player || this.state.gameOver) return;

    if (type === 'down') {
      if (key === 'ArrowLeft' || key === 'a') player.velocityX = -5;
      if (key === 'ArrowRight' || key === 'd') player.velocityX = 5;
      if ((key === ' ' || key === 'ArrowUp' || key === 'w') && player.velocityY === 0) {
        player.velocityY = -12;
      }
    } else {
      if ((key === 'ArrowLeft' || key === 'a') && player.velocityX < 0) player.velocityX = 0;
      if ((key === 'ArrowRight' || key === 'd') && player.velocityX > 0) player.velocityX = 0;
    }
  }

  public stop() {
    cancelAnimationFrame(this.animationFrame);
  }
}
