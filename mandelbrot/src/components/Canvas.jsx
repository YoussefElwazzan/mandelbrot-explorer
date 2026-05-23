import { useRef, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Canvas() {
  const canvasRef = useRef(null);
  const view = useRef({ cx: -0.5, cy: 0, scale: 3.5 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOrigin = useRef({ cx: 0, cy: 0 });
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  const [maxIter, setMaxIter] = useState(100);
  const [palette, setPalette] = useState("fire");
  const [info, setInfo] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [snapTitle, setSnapTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { token } = useAuth();

  // ─── Math helpers ──────────────────────────────────────────────────────────

  function mandelbrot(x0, y0, maxIterations) {
    let x = 0,
      y = 0,
      iter = 0;
    while (x * x + y * y <= 4 && iter < maxIterations) {
      const xn = x * x - y * y + x0;
      y = 2 * x * y + y0;
      x = xn;
      iter++;
    }
    return iter;
  }

  function getColor(iter, maxIterations, colorPalette) {
    if (iter === maxIterations) return [0, 0, 0];
    const t = iter / maxIterations;
    if (colorPalette === "fire")
      return [
        Math.floor(255 * Math.min(1, t * 3)),
        Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 1))),
        Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 2))),
      ];
    if (colorPalette === "ocean")
      return [
        Math.floor(20 * t),
        Math.floor(80 + 100 * t),
        Math.floor(180 + 75 * t),
      ];
    if (colorPalette === "psychedelic")
      return [
        Math.floor(127.5 * (1 + Math.sin(t * 12))),
        Math.floor(127.5 * (1 + Math.sin(t * 12 + 2.1))),
        Math.floor(127.5 * (1 + Math.sin(t * 12 + 4.2))),
      ];
    const v = Math.floor(255 * t);
    return [v, v, v];
  }

  // ─── Draw ──────────────────────────────────────────────────────────────────

  function draw(iterations, colorPalette) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const { cx, cy, scale } = view.current;
    const aspect = W / H;

    const imageData = ctx.createImageData(W, H);
    const pixels = imageData.data;

    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x0 = cx + (px / W - 0.5) * scale * aspect;
        const y0 = cy + (py / H - 0.5) * scale;
        const iter = mandelbrot(x0, y0, iterations);
        const [r, g, b] = getColor(iter, iterations, colorPalette);
        const i = (py * W + px) * 4;
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
        pixels[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    setInfo(
      `Center: (${view.current.cx.toFixed(6)}, ${view.current.cy.toFixed(6)})  Scale: ${view.current.scale.toFixed(6)}`,
    );
  }

  // ─── Zoom helper (shared by scroll wheel AND keyboard) ────────────────────

  function zoomAtPoint(factor, normX, normY, iterations, colorPalette) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const aspect = canvas.width / canvas.height;
    const { cx, cy, scale } = view.current;
    const worldX = cx + (normX - 0.5) * scale * aspect;
    const worldY = cy + (normY - 0.5) * scale;
    const newScale = scale * factor;
    view.current = {
      cx: worldX - (normX - 0.5) * newScale * aspect,
      cy: worldY - (normY - 0.5) * newScale,
      scale: newScale,
    };
    draw(iterations, colorPalette);
  }

  // ─── Redraw when controls change ───────────────────────────────────────────

  useEffect(() => {
    draw(maxIter, palette);
  }, [maxIter, palette]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── All mouse / keyboard events ──────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    draw(maxIter, palette);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };

      if (isDragging.current) {
        const aspect = canvas.width / canvas.height;
        const dx =
          ((e.clientX - dragStart.current.x) / rect.width) *
          view.current.scale *
          aspect;
        const dy =
          ((e.clientY - dragStart.current.y) / rect.height) *
          view.current.scale;
        view.current.cx = dragOrigin.current.cx - dx;
        view.current.cy = dragOrigin.current.cy - dy;
        draw(maxIter, palette);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const factor = e.deltaY > 0 ? 1.3 : 0.7;
      zoomAtPoint(factor, normX, normY, maxIter, palette);
    };

    const handleMouseDown = (e) => {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragOrigin.current = { cx: view.current.cx, cy: view.current.cy };
      canvas.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = "crosshair";
    };

    // Z = zoom in at cursor, X = zoom out at cursor
    const handleKeyDown = (e) => {
      if (e.key === "z" || e.key === "Z")
        zoomAtPoint(
          0.7,
          mousePos.current.x,
          mousePos.current.y,
          maxIter,
          palette,
        );
      if (e.key === "x" || e.key === "X")
        zoomAtPoint(
          1.3,
          mousePos.current.x,
          mousePos.current.y,
          maxIter,
          palette,
        );
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxIter, palette]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Save snapshot ─────────────────────────────────────────────────────────

  async function handleSaveSnapshot() {
    if (!token) {
      setSaveMsg("You must be logged in to save snapshots.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      const res = await fetch(`${API}/api/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: snapTitle || "Untitled snapshot",
          imageData,
          coordinates: view.current,
          palette,
          maxIter,
          isPublic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setSaveMsg("Snapshot saved!");
      setSnapTitle("");
    } catch (err) {
      setSaveMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    view.current = { cx: -0.5, cy: 0, scale: 3.5 };
    draw(maxIter, palette);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="container-fluid my-4">
      <h2 className="mb-3">Mandelbrot Explorer</h2>

      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{
          width: "100%",
          cursor: "crosshair",
          borderRadius: "8px",
          border: "1px solid #dee2e6",
        }}
      />

      <p
        className="text-muted mt-1"
        style={{ fontSize: "0.8rem", fontFamily: "monospace" }}
      >
        {info}
      </p>

      <div className="row mt-2 g-3 align-items-end">
        <div className="col-md-5">
          <label className="form-label">
            Max iterations: <strong>{maxIter}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            min={50}
            max={500}
            step={10}
            value={maxIter}
            onChange={(e) => setMaxIter(Number(e.target.value))}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Color palette</label>
          <select
            className="form-select"
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
          >
            <option value="fire">Fire</option>
            <option value="ocean">Ocean</option>
            <option value="psychedelic">Psychedelic</option>
            <option value="grayscale">Grayscale</option>
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleReset}
          >
            Reset view
          </button>
        </div>
      </div>

      <p className="text-muted mt-1" style={{ fontSize: "0.82rem" }}>
        🖱 Scroll or drag to navigate &nbsp;|&nbsp; ⌨ <kbd>Z</kbd> zoom in at
        cursor &nbsp;|&nbsp; <kbd>X</kbd> zoom out at cursor
      </p>

      <div className="card mt-3">
        <div className="card-body">
          <h6 className="card-title mb-3">Save current view as snapshot</h6>
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Snapshot title (optional)"
                value={snapTitle}
                onChange={(e) => setSnapTitle(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isPublic">
                  Add to public gallery
                </label>
              </div>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={handleSaveSnapshot}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save snapshot"}
              </button>
            </div>
          </div>
          {saveMsg && (
            <p
              className={`mt-2 mb-0 ${saveMsg.startsWith("Error") ? "text-danger" : "text-success"}`}
            >
              {saveMsg}
            </p>
          )}
          {!token && (
            <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.85rem" }}>
              <a href="/login">Log in</a> to save snapshots.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Canvas;
