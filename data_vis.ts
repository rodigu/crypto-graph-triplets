/*
let vis;
import("./data_vis.ts").then((r) => (vis = r));
vis.graphData(hist.map(({file_load_time})=>file_load_time), "tst.png", 5000);
*/
import { createCanvas, loadImage } from "https://deno.land/x/canvas/mod.ts";

export async function graphDataLists(
  data: [number[]],
  file: string,
  mag = 200,
  min_mag = 0,
  size: { width: number; height: number } = { width: 300, height: 200 }
) {
  const { width, height } = size;
  const canv = createCanvas(width, height);
  const ctx = canv.getContext("2d");
  const background_color = "rgb(250,250,250)";
  const clrs = [
    "250,0,0",
    "0,250,0",
    "0,0,250",
    "250,250,0",
    "0,250,250",
    "250,0,0",
    "0,0,0",
  ];

  ctx.fillStyle = background_color;
  ctx.fillRect(0, 0, width, height);

  const step_size = width / data.length;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const convert = (
    val: number,
    max_v: number,
    min_v: number,
    max_b: number,
    min_b: number
  ) => (val - min_v) * ((max_b - min_b) / (max_v - min_v)) + min_b;

  data.forEach((lst, i) => {
    const line_color = `rgb(${clrs[i]})`;
    ctx.fillStyle = line_color;
    let prev_y = height;
    lst.forEach((num, index) => {
      ctx.beginPath();
      ctx.moveTo(index * step_size, prev_y);
      prev_y = convert(num, mag, 0, 0, height);
      ctx.lineTo((index + 1) * step_size, prev_y);
      ctx.stroke();
    });
  });

  await Deno.writeFile(`./out/${file}`, canv.toBuffer());
}

export async function graphData(
  data: number[],
  file: string,
  mag = 200,
  min_mag = 0,
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
