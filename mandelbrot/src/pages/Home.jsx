import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      title: "Infinite zoom",
      desc: "Scroll or use keyboard shortcuts to dive infinitely deep into the fractal.",
    },
    {
      title: "Color palettes",
      desc: "Switch between Fire, Ocean, Psychedelic, and Grayscale renderings.",
    },
    {
      title: "Save snapshots",
      desc: "Capture your favorite views and store them in your personal gallery.",
    },
    {
      title: "Public gallery",
      desc: "Browse and get inspired by snapshots shared by the community.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Explore the Mandelbrot Set</h1>
          <p className="lead mb-4 text-secondary">
            Zoom infinitely into one of mathematics' most beautiful objects.
            <br />
            Save your discoveries. Share them with the world.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/explorer" className="btn btn-primary btn-lg">
              Start exploring
            </Link>
            <Link to="/gallery" className="btn btn-outline-light btn-lg">
              View gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="container my-5">
        <h2 className="text-center mb-4">What you can do</h2>
        <div className="row g-4">
          {features.map((f) => (
            <div key={f.title} className="col-sm-6 col-lg-3">
              <div className="card h-100 text-center p-3">
                <div className="card-body">
                  <h5 className="card-title mt-2">{f.title}</h5>
                  <p className="card-text text-muted">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h3 className="mb-3">Ready to go deeper?</h3>
          <p className="text-muted mb-4">
            Create a free account to save and share your snapshots.
          </p>
          <Link to="/register" className="btn btn-dark btn-lg">
            Create account
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
