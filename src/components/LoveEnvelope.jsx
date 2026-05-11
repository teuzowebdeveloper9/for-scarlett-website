import { useRef, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaLanguage } from 'react-icons/fa6'

const letterCopy = {
  pt: `Oi, oi, meu amor, sou eu, o Mateus. ❤️

Sabe… falar de você sempre mexe comigo de um jeito diferente. Eu nunca imaginei que eu, um trapstar real gangstar kkk, fosse me apaixonar tão de verdade por alguém. Mas você apareceu e simplesmente mudou isso em mim.

Às vezes eu fico mal por estar tão ocupado. Trabalhar é cansativo, desgasta minha mente, e tem dias em que eu sinto como se estivesse agonizando por dentro. Mas mesmo nos dias ruins, mesmo quando tudo parece pesado, você continua sendo a melhor parte da minha vida. Porque em qualquer lugar que eu vou, em qualquer música que toca ou momento do meu dia, eu sinto saudade de você.

E, sinceramente? Tudo o que eu mais quero é poder te pegar, te abraçar forte, sentir seu cheiro de novo, mexer no seu cabelo lindo e ficar perto de você sem me preocupar com mais nada. E claro… fazer aquilo que é só nosso kkk ❤️ você sabe exatamente do que eu tô falando.

Você tá cada dia mais linda, meu neném. E não é só por fora. O jeito que você me faz sentir é diferente de tudo que eu já vivi. Meu coração pede você o tempo inteiro, como se já tivesse escolhido onde pertence.

Eu te adoro mais do que consigo explicar. 🖤`,
  zh: `嗨嗨，我的爱，是我，Mateus。❤️

你知道吗……每次说起你，我心里都会有一种很不一样的感觉。我从来没想过，我这样一个 trapstar real gangstar kkk，竟然会这么认真地爱上一个人。可是你出现了，然后就这样改变了我。

有时候我会因为自己太忙而难过。工作真的很累，会消耗我的脑子，有些日子我甚至觉得自己像在心里挣扎一样。但就算是在很糟的日子里，就算一切都很沉重，你还是我生活里最好的部分。因为无论我去哪里，无论哪首歌响起，或者一天里的哪个瞬间，我都会想你。

说真的，我最想要的，就是把你抱进怀里，紧紧抱着你，再一次闻到你的味道，摸摸你漂亮的头发，待在你身边，不用再担心其他任何事情。当然……还有做只属于我们的那件事 kkk ❤️ 你知道我在说什么。

你一天比一天更漂亮，我的小宝贝。而且不只是外表。你让我感受到的一切，都和我经历过的任何事情不一样。我的心一直在要你，好像它早就已经选择了自己的归属。

我喜欢你，超过我能解释的程度。🖤`,
}

function LoveEnvelope() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('pt')
  const textPaneRefs = useRef({ pt: null, zh: null })
  const activeTitle = language === 'pt' ? 'Para Scarlett' : '致 Scarlett'
  const activePrompt = language === 'pt' ? 'Fechar a carta' : '收起这封信'

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
    <section className="letter-section reveal-on-scroll" id="letter" aria-labelledby="letter-title">
      <div className="section-heading">
        <p className="eyebrow">as palavras que eu guardei para você</p>
        <h2 id="letter-title">Uma carta da parte mais sincera de mim</h2>
        <p className="heading-chinese">一封用心写给你的信</p>
        <p>Uma página pequena para sentimentos que eu não consigo deixar só dentro do peito.</p>
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
            <span className="letter-opening-text">{isOpen ? activePrompt : 'Abrir a carta'}</span>
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
                <p className="eyebrow">nossas palavras</p>
                <h3>{activeTitle}</h3>
              </div>

              <button
                className="language-toggle"
                type="button"
                onClick={() => setLanguage((current) => (current === 'pt' ? 'zh' : 'pt'))}
                aria-label="Alternar idioma da carta"
              >
                <FaLanguage />
                <span>{language === 'pt' ? '中文' : 'Português'}</span>
              </button>
            </div>

            <div className="letter-paper">
              <img src="/love-letter-base.png" alt="" aria-hidden="true" className="letter-artwork" />
              <div className="letter-overlay">
                <div className="letter-copy-shell">
                  <div className="letter-text-wrap">
                    <div
                      ref={(node) => {
                        textPaneRefs.current.pt = node
                      }}
                      className={`letter-text ${language === 'pt' ? 'is-active' : ''}`}
                      aria-hidden={language !== 'pt'}
                    >
                      {letterCopy.pt.split('\n\n').map((paragraph) => (
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
                </div>
                <div className="letter-scroll-controls">
                  <button
                    className="letter-scroll-button letter-scroll-button-up"
                    type="button"
                    onClick={() => scrollByStep(-1)}
                    aria-label="Rolar a carta para cima"
                  >
                    <FaChevronUp />
                  </button>
                  <button
                    className="letter-scroll-button letter-scroll-button-down"
                    type="button"
                    onClick={() => scrollByStep(1)}
                    aria-label="Rolar a carta para baixo"
                  >
                    <FaChevronDown />
                  </button>
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
