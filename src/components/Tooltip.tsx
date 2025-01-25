import React, { useEffect, useState } from "react";

interface TooltipProps {
  x: number;
  y: number;
  selection: {
    functionValue?: string;
    aestheticValue?: string;
    comment?: string;
  };
  onSave: (updatedSelection: any) => void;
  onDelete: () => void;
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const { x, y, selection, onSave, onDelete } = props;
  const [functionValue, setFunctionValue] = useState(selection.functionValue || "");
  const [aestheticValue, setAestheticValue] = useState(selection.aestheticValue || "");
  const [comment, setComment] = useState(selection.comment || "");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    setIsSaveEnabled(!!functionValue || !!aestheticValue);
  }, [functionValue, aestheticValue]);

  const handleFunctionValue = (value: string) => {
    if (functionValue === value) {
      setFunctionValue("");
    } else {
      setFunctionValue(value);
    }
  }

  const handleAestheticValue = (value: string) => {
    if (aestheticValue === value) {
      setAestheticValue("");
    } else {
      setAestheticValue(value);
    }
  }

  const handleSave = () => {
    if (isSaveEnabled) {
      onSave({
        functionValue,
        aestheticValue,
        comment,
      });
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "rgba(213, 213, 213, 0.76)",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        width: "250px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "12px" }}>
        <strong style={{ display: "block", marginBottom: "4px" }}>Provide Feedback</strong>
        <span style={{ color: "#888" }}>Rate your experience</span>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "12px" }}>
        {/* Functionality */}
        <div style={{ marginBottom: "8px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Functionality</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button
              onClick={() => handleFunctionValue("good")}
              style={{
                background: functionValue === "good" ? "#4CAF50" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              👍
            </button>
            <button
              onClick={() => handleFunctionValue("bad")}
              style={{
                background: functionValue === "bad" ? "#F44336" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              👎
            </button>
          </div>
        </div>

        {/* Aesthetics */}
        <div style={{ marginBottom: "8px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Aesthetics</div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button
              onClick={() => handleAestheticValue("good")}
              style={{
                background: aestheticValue === "good" ? "#4CAF50" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              👍
            </button>
            <button
              onClick={() => handleAestheticValue("bad")}
              style={{
                background: aestheticValue === "bad" ? "#F44336" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            >
              👎
            </button>
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <div>Additional Comments</div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={onDelete}
          style={{
            background: "#F44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          style={{
            background: isSaveEnabled ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: isSaveEnabled ? "pointer" : "not-allowed",
          }}
        >
          Save Feedback
        </button>
      </div>
    </div>
  );
};

export default Tooltip;
