function Hero() {
  const sparkles = Array.from({ length: 28 }, (_, index) => index)

  return (
    <section className="hero-section reveal-on-scroll" id="home" aria-labelledby="hero-title">
      <div className="hero-aura" aria-hidden="true" />
      <div className="hero-particles" aria-hidden="true">
        {sparkles.map((item) => (
          <span key={item} className={`sparkle sparkle-${item + 1}`} />
        ))}
      </div>
      <div className="chinese-ornament chinese-ornament-left" aria-hidden="true">
        爱意如夜色温柔
      </div>
      <div className="chinese-ornament chinese-ornament-right" aria-hidden="true">
        为你而亮
      </div>

      <div className="hero-content">
        <p className="eyebrow">feito com meu coração</p>
        <h1 id="hero-title">For Scarlett</h1>
        <p className="title-chinese">献给 Scarlett</p>
        <p className="hero-subtitle">
          Um pequeno universo que eu fiz para você, onde cada música, foto e palavra tenta dizer o que meu coração sente.
        </p>
        <p className="hero-subtitle subtitle-chinese">
          这是我为你做的小宇宙，每一首歌、每一张照片、每一句话都在说我想你。
        </p>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-glow" />
        <span />
      </div>
    </section>
  )
}

export default Hero
