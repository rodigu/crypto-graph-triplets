import {
  createCanvas,
  EmulatedCanvas2D,
} from "https://deno.land/x/canvas/mod.ts";

export function generateCanvas(width: number, height: number) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  return canvas;
}

export function drawDataFromList(
  canvas: EmulatedCanvas2D,
  list: Array<number>,
  padding = 0,
  lowest = 0,
  highest = 0
) {
  // padding and padded dimensions setup
  padding = padding || 0.05 * canvas.width;
  lowest = lowest || Math.min(...list);
  lowest = lowest || Math.max(...list);
  const pad_width = canvas.width - 2 * padding;
  const pad_height = canvas.height - 2 * padding;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "light-blue";
  ctx.fillRect(padding, padding, pad_width, pad_height);

  ctx.fillStyle = "black";
  const spacing = pad_width / list.length;

  let prev_y = padding;
  let prev_x = list[0];
  list.forEach((point, i) => {
    if (i === 0) return;
  });
}

function map(
  val: number,
  v_min: number,
  v_max: number,
  b_min: number,
  b_max: number
) {
  return (val * (b_max - b_min)) / (v_max - v_min);
}

export async function saveGraph(file_name: string, canvas: EmulatedCanvas2D) {
  await Deno.writeFile(file_name, canvas.toBuffer());
}
