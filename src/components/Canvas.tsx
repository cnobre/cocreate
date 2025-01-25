import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";

interface Selection {
  start: { x: number; y: number };
  end: { x: number; y: number };
  functionValue?: string;
  aestheticValue?: string;
  comment?: string;
}

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [activeSelectionIndex, setActiveSelectionIndex] = useState<number | null>(null);
  const [hoveredSelectionIndex, setHoveredSelectionIndex] = useState<number | null>(null);

  const [mouseCoordinates, setMouseCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawSelections(ctx);
    }
  }, [selections]);

  const drawSelection = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    fillStyle: string = "rgba(200, 200, 200, 0.3)",
    strokeStyle: string = "white",
    lineWidth: number = 2,
    radius: number = 15
  ) => {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
  
    // Draw the rectangle with rounded corners
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // Move to the top-left corner, with rounded edge
    ctx.arcTo(x + width, y, x + width, y + height, radius); // Top-right corner
    ctx.arcTo(x + width, y + height, x, y + height, radius); // Bottom-right corner
    ctx.arcTo(x, y + height, x, y, radius); // Bottom-left corner
    ctx.arcTo(x, y, x + width, y, radius); // Top-left corner
    ctx.closePath();
  
    ctx.fill(); // Fill the rounded rectangle
    ctx.stroke(); // Stroke the rounded rectangle
  };

  const redrawSelections = (ctx: CanvasRenderingContext2D) => {
    // Draw all selections without restrictions
    selections.forEach(({ start, end }) => {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      drawSelection(ctx, x, y, width, height);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelectionEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const currentEnd = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
    setSelectionEnd(currentEnd);
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawSelections(ctx);
  
    const x = Math.min(selectionStart.x, currentEnd.x);
    const y = Math.min(selectionStart.y, currentEnd.y);
    const width = Math.abs(currentEnd.x - selectionStart.x);
    const height = Math.abs(currentEnd.y - selectionStart.y);
  
    // Draw the current selection being created
    drawSelection(ctx, x, y, width, height);
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionStart || !selectionEnd || !canvasRef.current) return;

    if (selectionStart.x === selectionEnd.x && selectionStart.y === selectionEnd.y) {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      const { width, height } = canvasElement.getBoundingClientRect();
      const newSelection: Selection = {
        start: { x: 0, y: 0 },
        end: { x: width, y: height },
      };
      setSelections((prev) => [...prev, newSelection]);
    } else {
      const newSelection: Selection = {
        start: selectionStart,
        end: selectionEnd,
      };
      setSelections((prev) => [...prev, newSelection]);  
    }

    const x = Math.max(selectionStart.x, selectionEnd.x);
    const y = Math.max(selectionStart.y, selectionEnd.y);

    setTooltipPosition({ x, y });
    setActiveSelectionIndex(selections.length);

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  // Rest of the component remains the same as in the original code...
  const handleEdit = (index: number) => {
    setActiveSelectionIndex(index);
    const selection = selections[index];
    const x = Math.min(selection.start.x, selection.end.x);
    const y = Math.min(selection.start.y, selection.end.y);
    setTooltipPosition({ x, y });
  };

  const handleDelete = (index: number) => {
    setSelections((prev) => prev.filter((_, i) => i !== index));
    setTooltipPosition(null);
    setActiveSelectionIndex(null);
  };

  useEffect(() => {
    // continuously update my mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      setMouseCoordinates([e.clientX, e.clientY]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={{ position: "relative", width: "800px", height: "600px" }}>
      <p style={{ position: "absolute", top: 0, left: 0, zIndex: 999 }}>
        Coordinates: {mouseCoordinates?.join(", ") || "N/A"}
      </p>
      <img
        src="./rendering.jpg"
        alt="Rendering"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          cursor: "crosshair",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {/* Render selections div elements (same as original code) */}
      {selections.map((selection, index) => {
        const x = Math.min(selection.start.x, selection.end.x);
        const y = Math.min(selection.start.y, selection.end.y);
        const width = Math.abs(selection.end.x - selection.start.x);
        const height = Math.abs(selection.end.y - selection.start.y);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: y,
              left: x,
              width,
              height,
            }}
            onMouseEnter={() => setHoveredSelectionIndex(index)}
            onMouseLeave={() => setHoveredSelectionIndex(null)}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: 0,
                display: "flex",
                gap: "8px",
                pointerEvents: "auto",
                zIndex: 999,
              }}
            >
              <IconButton 
                size="small"
                style={{
                  padding: "4px",
                  color: "green",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                }}
                onClick={() => handleEdit(index)}
              >
                <Edit />
              </IconButton>
              <IconButton 
                size="small"
                style={{
                  padding: "4px",
                  color: "red",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                }}
                onClick={() => handleDelete(index)}
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        );
      })}
      {tooltipPosition && activeSelectionIndex !== null && (
        <Tooltip
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          selection={selections[activeSelectionIndex]}
          onSave={
            ({ functionValue, aestheticValue, comment }) => {
              setSelections((prev) => {
                const newSelections = [...prev];
                newSelections[activeSelectionIndex] = {
                  ...newSelections[activeSelectionIndex],
                  functionValue,
                  aestheticValue,
                  comment,
                };
                return newSelections;
              });
              setTooltipPosition(null);
              setActiveSelectionIndex(null);
          }}
          onDelete={() => handleDelete(activeSelectionIndex)}
        />
      )}
    </div>
  );
};

export default Canvas;