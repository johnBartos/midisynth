// White: 18.4mm x 79mm, 19 keys
// Black: 8.85mm x 47.06mm, 13 keys

const params = {
  width: 1000,
  height: 1000
};

const white = {
  width: 20,
  height: 80
};

const black = {
  width: 10,
  height: 70
};


const whiteKey = (ctx, x, y) => {
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, white.width, white.height);
};

const blackKey = (ctx, x, y) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, black.width, black.height);
};

const keyGroup = (ctx, amount, offset) => {
  const keys = [];
  let key;
  let x = offset;

  for (let i = 0; i < amount; i += 1) {
    if (i % 2) {
      key = blackKey(ctx, x, 0)
      x += black.width;
    } else {
      key = whiteKey(ctx, x, 0)
      x += white.width;
    }
  }

  return x;
}

const octave = (ctx, offset) => {
  let size = offset;
  size = keyGroup(ctx, 5, size);
  size = keyGroup(ctx, 7, size);
  return size;
};

const keyboard = (ctx, offset) => {
  let size = 100;

  size = keyGroup(ctx, 7, size);
  size = octave(ctx, size);
  size = octave(ctx, size);
  size = keyGroup(ctx, 1, size);

  return offset;
};


export default function render(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  keyboard(ctx);
}
