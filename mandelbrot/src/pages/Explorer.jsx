import Canvas from "../components/Canvas";

// This page simply hosts the Canvas component.
// Keeping it as a separate page means we can later add
// things like a sidebar or snapshot history alongside the canvas.
function Explorer() {
  return <Canvas />;
}

export default Explorer;
