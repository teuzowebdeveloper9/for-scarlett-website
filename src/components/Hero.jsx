function Hero() {
  const sparkles = Array.from({ length: 18 }, (_, index) => index)

  return (
    <section className="hero-section" aria-labelledby="hero-title">
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
        <p className="eyebrow">made with care</p>
        <h1 id="hero-title">For Karina</h1>
        <p className="title-chinese">献给 Karina</p>
        <p className="hero-subtitle">
          A black and baby-pink place for our songs, memories, and a letter made only for you.
        </p>
        <p className="hero-subtitle subtitle-chinese">
          一个黑色与粉色的小世界，收藏我们的歌、回忆和只写给你的信。
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
