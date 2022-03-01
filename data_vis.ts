/*
let vis;
import("./data_vis.ts").then((r) => (vis = r));
vis.graphData(hist.map(({file_load_time})=>file_load_time), "tst.png", 5000);
*/
import { createCanvas } from "https://deno.land/x/canvas/mod.ts";

export async function graphData(
  data: number[],
  file: string,
  mag = 200,
  min_mag = 0,
  n_div = { width: 10, height: 10 },
  size: { width: number; height: number } = { width: 300, height: 200 }
) {
  const { width, height } = size;
  const canv = createCanvas(width, height);
  const ctx = canv.getContext("2d");
  const line_color = "rgb(20,20,20)";
  const background_color = "rgb(250,250,250)";

  ctx.fillStyle = background_color;
  ctx.fillRect(0, 0, width, height);

  const step_size = width / data.length;
  ctx.lineWidth = 2;
  ctx.fillStyle = line_color;
  ctx.lineCap = "round";

  const div_step_width = size.width / n_div.width;
  const div_step_height = size.height / n_div.height;
  for (let i = 0; i < n_div.width; i++) {
    ctx.beginPath();
    ctx.moveTo(i * div_step_width, 0);
    ctx.lineTo(i * div_step_width, height);
  }

  for (let i = 0; i < n_div.height; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * div_step_height);
    ctx.lineTo(width, i * div_step_height);
  }

  const convert = (
    val: number,
    max_v: number,
    min_v: number,
    max_b: number,
    min_b: number
  ) => (val - min_v) * ((max_b - min_b) / (max_v - min_v)) + min_b;

  let prev_y = height;
  data.forEach((num, index) => {
    ctx.beginPath();
    ctx.moveTo(index * step_size, prev_y);
    prev_y = convert(num, mag, min_mag, 0, height);
    ctx.lineTo((index + 1) * step_size, prev_y);
    ctx.stroke();
  });

  await Deno.writeFile(`./out/${file}`, canv.toBuffer());
}
