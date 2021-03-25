import Sketch from 'react-p5';
import p5Types, { Vector } from 'p5';
import { useCallback } from 'react';

interface Props {
  probe: number;
  tests: number[][];
  setTests: (tests: number[][]) => void;
}

let gatePosition: Vector;
let clockPosition: Vector;
let clockSpeed: Vector;
let initialClockPosition: Vector;

let moving = false;
let paused = true;
const speed = 4;

function MySketch({ probe, tests, setTests }: Props) {
  const setup = useCallback((p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(1000, 500).parent(canvasParentRef);
    gatePosition = p5.createVector(500, 100);
    clockPosition = p5.createVector(100, 200);
    initialClockPosition = clockPosition.copy();
    clockSpeed = p5.createVector(speed, 0);
    setTimeout(() => {
      moving = true;
      paused = false;
    }, 1000);
    p5.frameRate(1000);
  }, []);

  const draw = useCallback((p5: p5Types) => {
    p5.background(220);
    p5.fill('black');
    p5.rect(gatePosition.x, gatePosition.y, 20, 100);
    p5.rect(gatePosition.x, gatePosition.y + 200, 20, 100);
    p5.fill(255, 0, 0);
    p5.rect(clockPosition.x, clockPosition.y, 20, 100);
    if (!paused && moving) clockPosition.add(clockSpeed);
    if (paused) {
      p5.fill('black');
      p5.textSize(20);
      p5.text('Paused', 20, 20);
    }
  }, []);

  const mousePressed = useCallback(
    (p5: p5Types) => {
      if (!paused && moving) {
        moving = false;
        tests[probe].push(
          ((clockPosition.x - gatePosition.x) / speed) * p5.deltaTime
        );
        setTests(tests.slice());
        setTimeout(() => {
          clockPosition = initialClockPosition.copy();
          const x = initialClockPosition.x;
          const lower = (400 - x) / speed;
          const upper = (800 - x) / speed;
          gatePosition.x = x + speed * Math.floor(p5.random(lower, upper));
          setTimeout(() => (moving = true), 1000);
        }, 1000);
      }
    },
    [probe, setTests, tests]
  );

  const keyPressed = useCallback((p5: p5Types) => {
    if (p5.keyCode === p5.ESCAPE) {
      paused = !paused;
      if (paused) {
        moving = false;
        clockPosition = initialClockPosition.copy();
        const x = initialClockPosition.x;
        const lower = (400 - x) / speed;
        const upper = (800 - x) / speed;
        gatePosition.x = x + speed * Math.floor(p5.random(lower, upper));
      } else {
        setTimeout(() => (moving = true), 1000);
      }
    }
  }, []);

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      keyPressed={keyPressed}
      style={{ textAlign: 'center' }}
    />
  );
}

export default MySketch;
