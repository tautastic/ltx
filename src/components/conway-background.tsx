import { useCallback, useEffect } from "react";
import { useTheme } from "next-themes";

import useWindowSize from "~/lib/hooks/use-window-size";

type Grid = Array<Array<boolean>>;

export const ConwayBackground = ({ interval = 180 }: { interval?: number }) => {
  const { windowSize, resizing } = useWindowSize();
  const { resolvedTheme } = useTheme();

  const buildGrid = useCallback((rowsNum: number, colsNum: number, density: number) => {
    const grid = new Array<Array<boolean>>(rowsNum);
    for (let i = 0; i < rowsNum; i++) {
      grid[i] = Array.from({ length: colsNum }, () => Math.random() <= density);
    }
    return grid;
  }, []);

  const nextCellState = useCallback((grid: Grid, x: number, y: number) => {
    let aliveNeighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const neighbor = grid[x + i]?.[y + j];
        if (neighbor) {
          aliveNeighbors++;
        }
      }
    }
    return aliveNeighbors === 3 || (aliveNeighbors === 2 && grid[x]?.[y]) || false;
  }, []);

  const nextGridState = useCallback(
    (grid: Grid) => {
      return grid.map((row, x) => row.map((cell, y) => nextCellState(grid, x, y)));
    },
    [nextCellState]
  );

  const drawGrid = useCallback((cellSize: number, ctx: CanvasRenderingContext2D, grid: Grid) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    grid.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });
  }, []);

  const prepareCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = resolvedTheme === "light" ? "rgba(235,235,235,1)" : "rgba(17,17,17,0.8)";
      ctx.globalCompositeOperation = "source-over";
      ctx.imageSmoothingEnabled = true;
      ctx.fontKerning = "auto";
      ctx.lineCap = "butt";
      ctx.globalAlpha = 1;
      ctx.miterLimit = 1;

      // Show the canvas
      ctx.canvas.style.opacity = "1";
      ctx.canvas.style.transitionDuration = "1.7s";
      ctx.canvas.style.transitionTimingFunction = "ease-out";
    },
    [resolvedTheme]
  );

  const prepareGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const { height, width } = ctx.canvas;
    let cellSize, rowsNum, colsNum;
    if (width >= height) {
      cellSize = 14;
      const maxRows = width / cellSize;
      colsNum = Math.floor(height / Math.floor(width / maxRows));
      rowsNum = Math.floor(maxRows);
    } else {
      cellSize = 9;
      const maxCols = height / cellSize;
      rowsNum = Math.floor(width / Math.floor(height / maxCols));
      colsNum = Math.floor(maxCols);
    }
    ctx.canvas.style.left = `${(width - rowsNum * cellSize) / 2}px`;
    ctx.canvas.style.top = `${(height - colsNum * cellSize) / 2}px`;
    return {
      rowsNum,
      colsNum,
      cellSize,
    };
  }, []);

  const start = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Prepare the canvas
      prepareCanvas(ctx);

      // Prepare the grid
      const { rowsNum, colsNum, cellSize } = prepareGrid(ctx);
      let grid = buildGrid(rowsNum, colsNum, cellSize > 10 ? 0.09 : 0.12);
      drawGrid(cellSize, ctx, grid);

      // Start the game loop
      const intervalId = setInterval(() => {
        grid = nextGridState(grid);
        drawGrid(cellSize, ctx, grid);
      }, interval);

      // Return a function to stop the game loop and hide the canvas
      return () => {
        clearInterval(intervalId);
        ctx.canvas.width = 0;
        ctx.canvas.height = 0;
        ctx.canvas.style.opacity = "0";
        ctx.canvas.style.transitionDuration = "0.3s";
        ctx.canvas.style.transitionTimingFunction = "ease-in";
      };
    },
    [buildGrid, drawGrid, interval, nextGridState, prepareCanvas, prepareGrid]
  );

  useEffect(() => {
    const ctx = (document.getElementById("game-of-life") as HTMLCanvasElement).getContext("2d");
    if (!ctx) {
      return;
    }
    const { height, width } = windowSize;
    if (
      typeof height !== "number" ||
      typeof width !== "number" ||
      height < 144 ||
      width < 144 ||
      height > 1440 ||
      width > 2560 ||
      resizing
    ) {
      return;
    }
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.canvas.style.opacity = "0";

    let stop: () => void;
    // Wait 300ms to make animations aren't blocked by next-themes
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      typeof stop === "function" && stop();
      stop = start(ctx);
    }, 300);

    // Return a function to stop the game loop and hide the canvas
    return () => {
      clearTimeout(timeoutId);
      typeof stop === "function" && stop();
    };
  }, [start, windowSize, resizing]);

  return (
    <canvas
      className="pointer-events-none fixed left-0 top-0 z-[-1] overflow-hidden bg-white transition-opacity dark:bg-black"
      id="game-of-life"
    />
  );
};
