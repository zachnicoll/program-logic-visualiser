import { Graphics, Text } from "pixi.js";

export const drawText = (
  g: Graphics,
  textStr: string,
  x: number,
  y: number
): Text => {
  const text = new Text(textStr, {
    fontFamily: "monospace",
    fontSize: 14,
    align: "center"
  });
  text.anchor.set(0.5, 0.5);
  text.position.set(x, y);

  g.addChild(text);

  return text;
};

export const drawCircle = (
  g: Graphics,
  x: number,
  y: number,
  radius: number,
  fill: number
): void => {
  g.beginFill(fill);
  g.drawCircle(x, y, radius);
  g.endFill();
};
