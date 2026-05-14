export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity extends Point, Size {
  velocityX: number;
  velocityY: number;
  type: 'player' | 'enemy' | 'coin' | 'platform' | 'powerup';
  active: boolean;
}

export interface GameState {
  score: number;
  distance: number;
  coins: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
  level: number;
  invincible: boolean;
}
