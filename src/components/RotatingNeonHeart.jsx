function RotatingNeonHeart() {
  return (
    <section className="heart-section" aria-labelledby="heart-title">
      <div className="section-heading">
        <p className="eyebrow">glowing finale</p>
        <h2 id="heart-title">A neon heart for Karina</h2>
        <p className="heading-chinese">送给 Karina 的霓虹心</p>
      </div>

      <button className="heart-stage" type="button" aria-label="3D neon heart">
        <span className="neon-heart" aria-hidden="true">
          <span className="heart-core" />
          <span className="heart-rim heart-rim-one" />
          <span className="heart-rim heart-rim-two" />
          <span className="heart-glow" />
        </span>
      </button>
    </section>
  )
}

export default RotatingNeonHeart
