import { Howl } from 'howler';

export const playMoveSound = () => {
  const sound = new Howl({
    src: ['/sounds/move.mp3'],
  });
  sound.play();
};

export const playSelectSound = () => {
  const sound = new Howl({
    src: ['/sounds/select.mp3'],
  });
  sound.play();
};
