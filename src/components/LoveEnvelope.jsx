import { useRef, useState } from 'react'
import { FaChevronDown, FaLanguage } from 'react-icons/fa6'

const letterCopy = {
  en: `Hi my love,

Everything happened so fast, but somehow it felt real from the beginning.

Who would have thought that me, just a trapstar-minded boy living my own crazy life, would fall in love with a girl like you?

I honestly never imagined this.

But everything I feel for you is sincere. When I tell you I love you, I mean it. My love for you goes beyond bad days, distance, doubts and difficult moments. Somehow, it always finds its way back to you.

You are my girl.

I want to take care of you, love you properly, respect you, protect your heart, and make you feel special in every way I can.

When we fight, I get sad. When I feel your love, I feel lucky.

I still don’t fully understand what you saw in me, but please keep looking at it. Just don’t forget that I am human too. I can make mistakes, I can fail sometimes, but my heart is true when it comes to you.

Loving you is strange in the most beautiful way. I never expected someone to take over so much of my mind. You are in my thoughts during the day, and even at night, because I dream about you too.

It is crazy that I am creating a whole website for you.

I have been working with technology for years. I have used C#, Java, JavaScript, different frameworks and so many tools. But only you made me code with my heart.

This time, I am not just programming.

I am turning my love into something you can see.

I adore you, Karina.`,
  zh: `嗨，我的爱，

一切发生得那么快，但不知道为什么，从一开始我就觉得这一切很真实。

谁能想到，我这样一个带着 trapstar 想法、过着自己混乱生活的男孩，会爱上像你这样的女孩呢？

我真的从来没有想过。

但我对你的感觉都是真心的。当我说我爱你的时候，我是真的爱你。我的爱会穿过糟糕的日子、距离、怀疑和困难的时刻。无论怎样，它总会回到你身边。

你是我的女孩。

我想照顾你，好好爱你，尊重你，保护你的心，用我能做到的一切方式让你觉得自己很特别。

当我们吵架时，我会难过。当我感受到你的爱时，我觉得自己很幸运。

我到现在也不完全明白你在我身上看到了什么，但请你继续看着它。只是也请不要忘记，我也是一个普通人。我可能会犯错，也可能有时候做得不够好，但面对你时，我的心是真的。

喜欢你是一件很奇妙的事，美好到让我觉得不可思议。我从没想过会有一个人占据我这么多的脑海。白天我会想你，晚上也会想你，因为我也会梦见你。

我正在为你做一个完整的网站，这真的很疯狂。

我已经和技术打交道很多年了。我用过 C#、Java、JavaScript，也用过很多框架和工具。但只有你，让我第一次用心去写代码。

这一次，我不只是写程序。

我是把我的爱变成你可以看见的东西。

我很喜欢你，Karina。`,
}

function LoveEnvelope() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const textPaneRefs = useRef({ en: null, zh: null })
  const activeTitle = language === 'en' ? 'For Karina' : '致 Karina'
  const activePrompt = language === 'en' ? 'Close the letter' : '收起这封信'

  const scrollByStep = (direction) => {
    const activePane = textPaneRefs.current[language]

    if (!activePane) {
      return
    }

    const nextTop = activePane.scrollTop + direction * Math.max(220, activePane.clientHeight * 0.45)

    activePane.scrollTo({
      top: Math.max(0, nextTop),
      behavior: 'smooth',
    })
  }

  return (
    <section className="letter-section" aria-labelledby="letter-title">
      <div className="section-heading">
        <p className="eyebrow">our letter</p>
        <h2 id="letter-title">A letter made with my heart</h2>
        <p className="heading-chinese">一封用心写给你的信</p>
        <p>A little page for everything I feel for you.</p>
        <p className="copy-chinese">轻轻打开，就能看到我想说的话。</p>
      </div>

      <div className={`letter-stage ${isOpen ? 'is-open' : ''}`}>
        <button
          className="envelope-scene"
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="letter-card letter-card-closed">
            <span className="letter-opening-text">{isOpen ? activePrompt : 'Open the letter'}</span>
          </span>
          <span className="envelope-body" />
          <span className="envelope-left" />
          <span className="envelope-right" />
          <span className="envelope-flap" />
        </button>

        <div className={`letter-reveal ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
          <article className="handwritten-letter">
            <div className="handwritten-letter-top">
              <div>
                <p className="eyebrow">our words</p>
                <h3>{activeTitle}</h3>
              </div>

              <button
                className="language-toggle"
                type="button"
                onClick={() => setLanguage((current) => (current === 'en' ? 'zh' : 'en'))}
                aria-label="Toggle letter language"
              >
                <FaLanguage />
                <span>{language === 'en' ? '中文' : 'English'}</span>
              </button>
            </div>

            <div className="letter-paper">
              <img src="/love-letter-base.png" alt="" aria-hidden="true" className="letter-artwork" />
              <div className="letter-overlay">
                <div className="letter-copy-shell">
                  <div className="letter-text-wrap">
                    <div
                      ref={(node) => {
                        textPaneRefs.current.en = node
                      }}
                      className={`letter-text ${language === 'en' ? 'is-active' : ''}`}
                      aria-hidden={language !== 'en'}
                    >
                      {letterCopy.en.split('\n\n').map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <div
                      ref={(node) => {
                        textPaneRefs.current.zh = node
                      }}
                      className={`letter-text ${language === 'zh' ? 'is-active' : ''}`}
                      aria-hidden={language !== 'zh'}
                    >
                      {letterCopy.zh.split('\n\n').map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  <div className="letter-scroll-rail">
                    <button
                      className="letter-scroll-button"
                      type="button"
                      onClick={() => scrollByStep(1)}
                      aria-label="Scroll the letter down"
                    >
                      <FaChevronDown />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default LoveEnvelope
