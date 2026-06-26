import { useState, useEffect, useRef } from 'react'
import { CONFIG, POTIONS, KINGDOMS, MONSTERS } from './gameData'
import { useProgress } from './useProgress'
import Motus from './components/Motus'
import BannerHunt from './components/BannerHunt'
import MonsterHunt from './components/MonsterHunt'
import { Page } from './components/Page'
import { setSfxMuted, registerMusic } from './sfx'

export default function App() {
  const { solved, bannersDone, monstersDone, markSolved, markBannersDone, markMonstersDone, reset } =
    useProgress()
  const { audio, button: musicButton } = useMusic()
  const [view, setView] = useState('cover') // 'cover' | 'intro' | 'index' | 'banners' | 'monsters' | 'finale' | <potionId>
  const [dir, setDir] = useState('fwd') // page-turn direction
  const solvedCount = POTIONS.filter((p) => solved[p.id]).length
  const allSolved = solvedCount === POTIONS.length
  const finished = monstersDone // whole journey complete → free navigation

  // navigate + remember the turn direction so the flip animates the right way
  const go = (next, direction = 'fwd') => {
    setDir(direction)
    setView(next)
  }

  const goReset = () => {
    if (window.confirm('Effacer toute la progression et recommencer le grimoire ?')) {
      reset()
      go('cover', 'back')
    }
  }

  let content
  if (view === 'cover') content = <Cover onNext={() => go('intro', 'fwd')} />
  else if (view === 'intro')
    content = (
      <Intro onNext={() => go('index', 'fwd')} onBack={() => go('cover', 'back')} />
    )
  else if (view === 'index')
    content = (
      <Index
        solved={solved}
        allSolved={allSolved}
        solvedCount={solvedCount}
        onPick={(id) => go(id, 'fwd')}
        onNext={() => go('banners', 'fwd')}
        onBack={() => go('intro', 'back')}
      />
    )
  else if (view === 'banners')
    content = (
      <BannerHunt
        kingdoms={KINGDOMS}
        finished={finished}
        onComplete={() => {
          markBannersDone()
          go('monsters', 'fwd')
        }}
        onBack={() => go('index', 'back')}
      />
    )
  else if (view === 'monsters')
    content = (
      <MonsterHunt
        monsters={MONSTERS}
        finished={finished}
        onComplete={() => {
          markMonstersDone()
          go('finale', 'fwd')
        }}
        onBack={() => go('banners', 'back')}
      />
    )
  else if (view === 'finale')
    content = (
      <Finale
        onBack={() => go('monsters', 'back')}
        onHome={() => go('cover', 'back')}
      />
    )
  else {
    const potion = POTIONS.find((p) => p.id === view)
    // solving this one clears the whole "Décoctions" chapter if it's the last unsolved
    const completesChapter = POTIONS.every((p) => p.id === potion.id || solved[p.id])
    content = (
      <Chapter
        potion={potion}
        solved={!!solved[potion.id]}
        completes={completesChapter}
        onSolved={() => markSolved(potion.id)}
        onBack={() => go('index', 'back')}
      />
    )
  }

  // The hunts animate their own internal page-turns, so don't double-wrap them.
  const stage =
    view === 'banners' || view === 'monsters' ? (
      content
    ) : (
      <div className={`page-flip ${dir}`} key={view}>
        {content}
      </div>
    )

  return (
    <>
      <div className="book">
        {view === 'cover' ? (
          <div className="music-corner">{musicButton}</div>
        ) : (
          <div className="topbar">
            <span className="crumbs">Le Grimoire de Vesemir</span>
            {musicButton}
            <button className="reset" onClick={goReset}>
              recommencer
            </button>
          </div>
        )}
        {stage}
      </div>
      {/* the <audio> lives outside .book so it never remounts on navigation */}
      {audio}
    </>
  )
}

// Background music: a persistent <audio> element + a toggle button for the top bar.
function useMusic() {
  const ref = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !CONFIG.music) return
    el.volume = 0.3
    registerMusic(el) // let monster clips duck the music
    const tryPlay = () => el.play().catch(() => {})
    tryPlay()
    // Browsers block autoplay until a user gesture — start on the first one.
    const onFirst = () => {
      tryPlay()
      window.removeEventListener('pointerdown', onFirst)
    }
    window.addEventListener('pointerdown', onFirst)
    return () => window.removeEventListener('pointerdown', onFirst)
  }, [])

  // keep the correct-answer sound effect in step with the music mute state
  useEffect(() => {
    setSfxMuted(muted)
  }, [muted])

  if (!CONFIG.music) return { audio: null, button: null }

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      el.muted = false
      el.play().catch(() => {})
      setMuted(false)
      return
    }
    el.muted = !el.muted
    setMuted(el.muted)
  }

  const src = `${import.meta.env.BASE_URL}${encodeURIComponent(CONFIG.music)}`
  return {
    audio: <audio ref={ref} src={src} loop preload="auto" />,
    button: (
      <button
        className="music-toggle"
        onClick={toggle}
        aria-label={muted ? 'Activer la musique' : 'Couper la musique'}
        title={muted ? 'Activer la musique' : 'Couper la musique'}
      >
        {muted ? '🔇' : '🎵'}
      </button>
    ),
  }
}

function Cover({ onNext }) {
  return (
    <Page className="cover" next={{ label: 'Ouvrir le grimoire', onClick: onNext }}>
      <div className="subtitle">École du Loup · Kaer Morhen</div>
      <h1 className="title">Le Grimoire de Vesemir</h1>
      {CONFIG.coverImage && (
        <img
          className="cover-wolf"
          src={`${import.meta.env.BASE_URL}${CONFIG.coverImage}`}
          alt="Emblème de l'École du Loup"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <p className="lead">
        « Voici tout ce que ma mémoire a su garder, élève — mes années, mon
        savoir, et un secret que je réserve à qui s'en montrera digne. Prouve
        ta maîtrise au fil de ces pages, et le grimoire te livrera ce qu'il
        cache. »
      </p>
      <p className="corner-hint">Replie le coin de la page pour l'ouvrir ❯</p>
    </Page>
  )
}

function Intro({ onNext, onBack }) {
  return (
    <Page
      back={{ label: 'La couverture', onClick: onBack }}
      next={{ label: 'Tourner la page', onClick: onNext }}
    >
      <div className="subtitle">Préface du vieux loup</div>
      <h2 className="title">Avant que ma main ne tremble</h2>
      <div className="flourish">❧</div>
      <div className="prose dropcap">
        <p>
          Si tu lis ces lignes, c'est que je ne suis plus là pour te les dire à
          voix haute, au coin du feu de Kaer Morhen. Qu'importe : un sorceleur
          n'a jamais eu besoin d'un maître à ses côtés pour apprendre. Il lui
          faut un grimoire, une nuit longue, et l'entêtement de ne pas refermer
          le livre.
        </p>
        <p>
          J'ai vu passer tant d'élèves entre ces murs. Certains sont devenus des
          légendes ; d'autres reposent sous la neige, sans nom gravé. À chacun,
          j'ai voulu transmettre ce que les Épreuves ne donnent pas : la
          patience, le doute, et le goût des choses bien préparées. Le reste,
          la route le réclamera bien assez tôt.
        </p>
        <p>
          Alors j'ai pris la plume — un geste plus étranger à ma main que
          l'acier — pour coucher ici tout ce que ma mémoire a su garder. L'art
          des décoctions, oui, mais aussi les terres que tu fouleras et les
          couleurs sous lesquelles tu marcheras : tout le savoir d'un sorceleur,
          je le confie à celui ou celle qui viendra après moi.
        </p>
        <p>
          Lis lentement. Devine, trompe-toi, recommence. Chaque épreuve que tu
          sauras franchir te rapprochera d'un secret que j'ai gardé pour toi
          seul. Tourne la page, élève.
        </p>
      </div>
    </Page>
  )
}

function Index({ solved, allSolved, solvedCount, onPick, onNext, onBack }) {
  const remaining = POTIONS.length - solvedCount
  return (
    <Page
      back={{ label: 'La préface', onClick: onBack }}
      next={{
        label: allSolved ? 'Poursuivre le voyage' : `Encore ${remaining} à découvrir`,
        onClick: onNext,
        disabled: !allSolved,
      }}
    >
      <h2 className="title">Les Cinq Décoctions</h2>
      <div className="flourish">⚜ ⚜ ⚜</div>
      <p className="prose riddle" style={{ textAlign: 'center' }}>
        Chaque page cache le nom d'une potion. Nomme-la, et l'encre effacée
        révélera son indice.
      </p>
      <ul className="potion-list">
        {POTIONS.map((p) => (
          <li
            key={p.id}
            className={solved[p.id] ? 'done' : ''}
            onClick={() => onPick(p.id)}
          >
            <span className="vial" style={{ color: p.color }}>
              ⚗
            </span>
            <span className="name">{solved[p.id] ? p.display : '???'}</span>
            <span className="seal">{solved[p.id] ? '✦' : '🔒'}</span>
          </li>
        ))}
      </ul>
    </Page>
  )
}

function Chapter({ potion, solved, onSolved, onBack, completes }) {
  const [revealed, setRevealed] = useState(solved)

  const handleSolved = () => {
    setRevealed(true)
    onSolved()
  }

  return (
    <Page back={{ label: 'Le grimoire', onClick: onBack }}>
      <h2
        className={`title${revealed ? ' word-reveal' : ''}`}
        style={{ color: revealed ? potion.color : undefined }}
      >
        {revealed ? potion.display : 'Une page noircie'}
      </h2>
      <div className="flourish">❧</div>

      {revealed ? (
        <>
          <div className="prose dropcap fade-in">
            {potion.story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="hint-card fade-in">
            <div className="label">Indice gravé</div>
            <div className="text">« {potion.hint} »</div>
          </div>
        </>
      ) : (
        <>
          <p className="prose riddle">
            Le texte de cette page s'est effacé avec les années. Seul demeure ce
            griffonnage dans la marge :
          </p>
          <p className="margin-note">« {potion.clue} »</p>
          <p className="prose riddle" style={{ textAlign: 'center' }}>
            Retrouve le nom de la potion pour que l'encre de Vesemir réapparaisse.
          </p>
          <Motus answer={potion.word} onSolved={handleSolved} completes={completes} />
        </>
      )}
    </Page>
  )
}

function Finale({ onBack, onHome }) {
  const { concert, recipientName } = CONFIG
  const [revealed, setRevealed] = useState(false)
  const revealRef = useRef(null)

  // when the gift appears, glide down to it
  useEffect(() => {
    if (revealed && revealRef.current) {
      revealRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [revealed])

  return (
    <Page
      className="finale"
      back={
        revealed
          ? { label: 'Revenir au début', onClick: onHome }
          : { label: 'Les blasons', onClick: onBack }
      }
    >
      <h2 className="title">Le Secret de Vesemir</h2>
      <div className="flourish">✦ ✦ ✦</div>
      <p className="prose riddle">
        « Tu as retrouvées toutes les décoctions, tu connais désormais les terres du
        Nord et les monstres qui les peuplent. Rassemble maintenant les fragments, {recipientName} : »
      </p>
      <ul className="hint-list">
        {[...POTIONS, ...KINGDOMS, ...MONSTERS].map((item) => (
          <li key={item.id}>{item.hint}</li>
        ))}
      </ul>
      <p className="prose riddle">
        Tout cela ne désignait qu'une seule et même chose. Quand tu seras prêt à
        la découvrir, élève, brise le dernier sceau.
      </p>

      {revealed ? (
        <div className="reveal-box fade-in" ref={revealRef}>
          <p className="gift-eyebrow">Une nuit unique de musique, loin d'ici, marquée d'avance dans le ciel.</p>
          <p className="gift-title">{concert.title}</p>
          <p className="gift-info">
            <span className="seats">{concert.seats} places</span>
          </p>
          <p className="gift-datecity">
            {concert.date} · {concert.city}
          </p>
          <p className="gift-venue">{concert.venue}</p>
          <p style={{ fontStyle: 'italic', marginTop: '1em' }}>
            « Joyeux anniversaire. Que le Chemin te soit doux. — Vesemir »
          </p>
        </div>
      ) : null}

      {!revealed && (
        <div className="actions">
          <button className="btn-witcher" onClick={() => setRevealed(true)}>
            Révéler le présent
          </button>
        </div>
      )}
    </Page>
  )
}
