function Hero({ heading, description }) {
  return (
    <section className="hero">
      <h1>{heading}</h1>
      <p>{description}</p>

      <button>Get Started</button>
    </section>
  );
}

export default Hero;