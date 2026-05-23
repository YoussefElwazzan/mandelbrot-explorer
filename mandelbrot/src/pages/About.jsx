function About() {
  const stack = [
    { layer: "Frontend", tech: "React.js, Bootstrap 5, HTML5 Canvas" },
    { layer: "Backend", tech: "Node.js, Express.js" },
    { layer: "Database", tech: "MongoDB Atlas + Mongoose" },
    { layer: "Auth", tech: "JWT (JSON Web Tokens) + bcrypt" },
    { layer: "Deployment", tech: "Vercel (frontend) + Railway (backend)" },
  ];

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left column */}
        <div className="col-lg-7">
          <h2 className="mb-3">About this project</h2>
          <p className="text-muted">
            Mandelbrot Explorer is a full-stack web application. It lets users
            explore the Mandelbrot set, one of mathematics' most famous
            fractals, interactively in the browser with no plugins or downloads
            required.
          </p>

          <h4 className="mt-4 mb-3">How the Mandelbrot set works</h4>
          <p>
            Every pixel on screen corresponds to a complex number{" "}
            <code>c = x + yi</code>. We repeatedly apply the formula{" "}
            <code>z → z² + c</code>, starting from <code>z = 0</code>. If the
            result stays bounded (never escapes to infinity), the point belongs
            to the set and is colored black. If it escapes, we color it based on
            how many steps it took, producing the vivid boundary patterns you
            see.
          </p>
          <p>
            The key insight: a point is guaranteed to escape if its distance
            from the origin ever exceeds 2. So we check{" "}
            <code>x² + y² &gt; 4</code> at each step (avoiding a slow square
            root call), and stop as soon as it exceeds that threshold.
          </p>

          <h4 className="mt-4 mb-3">Why is the boundary so complex?</h4>
          <p>
            The Mandelbrot set is a <strong>fractal</strong>, it has infinite
            detail at every scale. No matter how far you zoom in, you'll find
            new spirals, bulbs, and miniature copies of the whole set. This
            self-similarity emerges from the simple recursive formula above.
          </p>
        </div>

        {/* Right column: tech stack */}
        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="card">
            <div className="card-header fw-semibold">Technology stack</div>
            <ul className="list-group list-group-flush">
              {stack.map((s) => (
                <li
                  key={s.layer}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span className="text-muted">{s.layer}</span>
                  <span style={{ fontSize: "0.9rem" }}>{s.tech}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-4">
            <div className="card-header fw-semibold">Keyboard shortcuts</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <kbd>Z</kbd>
                <span className="text-muted">Zoom in at cursor</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <kbd>X</kbd>
                <span className="text-muted">Zoom out at cursor</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Scroll wheel</span>
                <span className="text-muted">Zoom</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Click + drag</span>
                <span className="text-muted">Pan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
