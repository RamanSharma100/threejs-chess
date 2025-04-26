import { Howl } from 'howler';

export const playMoveSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/move.mp3'],
  });
  sound.play();
};

export const playSelectSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/select.mp3'],
  });
  sound.play();
};

export const playCaptureSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/capture.mp3'],
  });
  sound.play();
};

export const playCheckSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/move-check.mp3'],
  });
  sound.play();
};

export const playGameEndSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/game-end.webm'],
  });
  sound.play();
};

export const playPromotionSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/promotion.mp3'],
  });
  sound.play();
};

export const playGameStartSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/game-start.mp3'],
    html5: true,
  });
  sound.play();
};

export const playCastleSound = () => {
  const sound = new Howl({
    src: ['/assets/sounds/castle.mp3'],
  });
  sound.play();
};
