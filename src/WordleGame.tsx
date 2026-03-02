import { useCallback, useEffect, useState } from 'react'
import { useI18n } from './i18n'

const WORDS_FR = [
  // A
  'abime','abord','abris','achat','acide','acier','adieu','adore',
  'agile','agite','aigle','allee','alter','amant','ambre','amour',
  'ample','ancre','anime','annee','apres','arbre','arche','arene',
  'arret','assez','astre','atome','avale','avant','avare','avide',
  'avion',
  // B
  'bague','balle','bande','barge','baron','barre','batir','baton',
  'bazar','belle','berge','biche','bijou','bilan','bison','blanc',
  'blond','boite','bombe','bonne','borne','bosse','botte','boule',
  'bravo','bride','brise','brume','bulle','butin',
  // C
  'cable','cadet','calme','canon','carat','carpe','carre','carte',
  'cause','ceder','celui','cerne','chair','chant','chaos','chaud',
  'chene','chien','chose','cible','cidre','clair','clore','cobra',
  'coeur','colle','colon','comte','conge','copie','coque','corde',
  'corps','coude','coupe','court','crabe','crane','credo','creux',
  'crime','crise','cruel',
  // D
  'dague','danse','debut','delta','dense','depot','dette','devin',
  'digne','diode','disco','doigt','douce','doyen','drame','droit',
  'duvet',
  // E
  'ebahi','ecart','eclat','ecrin','ecrou','egale','eleve','eloge',
  'email','emise','emois','emule','encre','enfin','engin','ennui',
  'entre','envie','epais','epice','epine','epoux','essor','etage',
  'etape','etude','evade','eveil','exode','extra',
  // F
  'fable','faite','farce','fatal','faune','faute','femme','fente',
  'ferme','fiche','figue','flair','fleau','fleur','folie','fonte',
  'forge','forme','fosse','foule','franc','frein','frere','frire',
  'front','fruit','fugue',
  // G
  'gagne','garde','geler','genre','geste','gilet','givre','glace',
  'gland','gober','golfe','gorge','gosse','grace','grade','grain',
  'grand','grave','greve','grise','guide','guise',
  // H
  'haine','halle','halte','hamac','harpe','heros','hetre','heure',
  'hibou','hiver','homme','honte','hotel','houle','huile','hurle',
  // I
  'ideal','idole','image',
  // J
  'jabot','jambe','jauge','jeune','jolie','jouer','joute','joyau',
  // L
  'label','lapin','large','laser','lasse','leche','lecon','leger',
  'liane','libre','liege','linge','lisse','litre','livre','logis',
  'lotir','louer','louve','loyal','lueur','lutte',
  // M
  'magma','magie','maire','malin','manie','marge','masse','match',
  'mauve','meche','melee','melon','merle','metis','meute','mixer',
  'monde','monte','moule','multi','murer','myope',
  // N
  'nappe','nasse','natte','naval','neige','nette','noble','noces',
  'noire','norme','noter','nuage','nuire','nulle',
  // O
  'offre','olive','ongle','opera','opter','ordre','orgue','otage',
  'ouvre',
  // P
  'paire','palme','panda','panel','panne','paree','paroi','passe',
  'pause','paver','perle','perdu','peser','phare','piece','pince',
  'pixel','plage','plane','plier','plomb','pluie','point','pompe',
  'porte','poste','poule','prise','probe','prude','pulse','purge',
  // Q
  'quete','queue',
  // R
  'raide','rampe','raser','ratio','ravin','recit','refus','regle',
  'rejet','relax','repas','reste','revue','rider','rivet','robot',
  'roman','ronde','rouge','roule','route','ruser',
  // S
  'sabot','sauce','scene','seche','seize','selon','senat','siege',
  'sigle','signe','sobre','socle','soeur','solde','sonde','songe',
  'sorte','sotte','soude','soupe','sourd','stade','stage','stand',
  'style','sueur','suite','sujet','super',
  // T
  'tabac','tache','talon','taupe','tenue','terme','tiare','tirer',
  'tiret','titre','tombe','tondu','tordu','totem','trace','train',
  'trait','treve','trier','tripe','troue','trous','tuile','tyran',
  // U
  'ultra','usage','usine','usure',
  // V
  'vague','vaine','valve','vaste','venal','verge','verse','veste',
  'vibre','video','vigne','ville','vingt','viole','vitre','voile',
  'voter','vouer','voulu',
  // Z
  'zeste',
]

const WORDS_EN = [
  'about','actor','alarm','alert','alone','angle','apple','arena',
  'arise','arrow','aside','audio','avoid','award','aware','baker',
  'beach','being','below','bench','blade','blame','blast','blaze',
  'blend','block','blood','board','bonus','brave','bread','break',
  'brick','bring','broke','brown','build','burst','cabin','candy',
  'carry','catch','cause','chair','chaos','charm','chart','cheap',
  'check','chess','chest','chief','child','chunk','civil','claim',
  'clash','class','clean','clear','clock','close','cloud','coach',
  'coral','count','court','cover','crack','craft','crane','crash',
  'cream','crisp','cross','crowd','crown','cruel','crush','curve',
  'daily','dance','delay','drama','dream','dress','drink','drive',
  'drown','eager','earth','elite','empty','enemy','enjoy','enter',
  'error','essay','event','every','exact','exist','extra','fable',
  'faint','fairy','faith','fancy','fault','feast','fence','fever',
  'field','fight','final','first','flame','flesh','float','floor',
  'focus','force','forge','found','frame','front','fruit','funny',
  'ghost','giant','given','glass','globe','glory','gloss','glove',
  'grace','grade','grain','grand','grant','graph','grasp','grass',
  'grave','great','green','grief','grill','groan','group','grove',
  'guess','happy','harsh','haven','heavy','hedge','hobby','honor',
  'horse','hotel','house','human','humor','hurry','ideal','image',
  'jewel','joint','joker','judge','juice','jumbo','karma','knack',
  'knife','knock','known','kudos','label','laser','later','layer',
  'learn','leave','legal','lemon','level','light','liver','local',
  'logic','loose','lower','loyal','lucky','lunar','lyric','magic',
  'major','maker','manor','match','mayor','media','mercy','merge',
  'merit','metal','might','minor','model','money','moral','motel',
  'motto','mount','mouse','mouth','movie','music','nasty','naval',
  'nerve','never','night','noble','noise','north','novel','nurse',
  'ocean','offer','often','olive','orbit','order','other','outer',
  'panic','panel','paper','pasta','patch','pause','peace','pearl',
  'pilot','pinch','pixel','pizza','place','plain','plane','plant',
  'point','polar','power','press','price','pride','prize','probe',
  'proof','proud','pulse','punch','queen','query','quiet','quirk',
  'quota','quote','radar','radio','raise','rally','range','rapid',
  'reach','react','realm','rebel','relay','risky','rival','river',
  'robot','rocky','rouge','rough','round','route','royal','ruler',
  'rusty','saint','sauce','scale','scare','scene','scent','scope',
  'score','scout','seize','sense','serve','seven','shade','shake',
  'shame','shape','share','shark','sharp','shell','shift','shirt',
  'shock','shore','short','shout','since','sixth','skill','slave',
  'sleep','slice','slide','slope','smart','smell','smile','smoke',
  'snake','solid','solve','sound','south','space','spare','speak',
  'spell','spend','spine','sport','spray','staff','stage','stain',
  'stale','stamp','start','state','steam','steel','stone','storm',
  'story','study','style','sugar','sunny','super','surge','swear',
  'swift','sword','syrup','table','taste','teach','tiger','tight',
  'title','toast','token','topic','total','touch','tough','tower',
  'toxic','track','trade','trail','trait','treat','trend','trial',
  'tribe','troop','trout','truck','truly','tryst','tulip','tutor',
  'twice','twist','ultra','unify','union','unite','until','upper',
  'upset','urban','usage','usher','usual','value','vapor','vault',
  'venom','verse','video','vigor','viral','visit','vista','vital',
  'vivid','voice','voter','wagon','waver','weary','wedge','whole',
  'witch','woman','world','worry','worse','would','wound','wrath',
  'wrist','wrote','yacht','yeast','young','youth','zesty',
]

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active'

interface CellState {
  letter: string
  state: LetterState
}

const ROWS = 6
const COLS = 5

function buildBoard(): CellState[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as LetterState }))
  )
}

const KEYBOARD_ROWS_FR = [
  ['A','Z','E','R','T','Y','U','I','O','P'],
  ['Q','S','D','F','G','H','J','K','L','M'],
  ['ENTER','W','X','C','V','B','N','⌫'],
]

const KEYBOARD_ROWS_EN = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

interface Props {
  onClose: () => void
}

export default function WordleGame({ onClose }: Props) {
  const { lang, t } = useI18n()
  const wordList = lang === 'fr' ? WORDS_FR : WORDS_EN
  const keyboardRows = lang === 'fr' ? KEYBOARD_ROWS_FR : KEYBOARD_ROWS_EN

  const [target, setTarget] = useState(() =>
    wordList[Math.floor(Math.random() * wordList.length)].toUpperCase()
  )
  const [board, setBoard] = useState<CellState[][]>(buildBoard())
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [shake, setShake] = useState(false)
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({})
  const [revealed, setRevealed] = useState<number | null>(null)

  const restart = useCallback(() => {
    setTarget(wordList[Math.floor(Math.random() * wordList.length)].toUpperCase())
    setBoard(buildBoard())
    setCurrentRow(0)
    setCurrentCol(0)
    setStatus('playing')
    setLetterStates({})
    setRevealed(null)
  }, [wordList])

  // restart when language changes
  useEffect(() => { restart() }, [lang])

  const addLetter = useCallback((letter: string) => {
    if (status !== 'playing' || currentCol >= COLS) return
    setBoard((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })))
      next[currentRow][currentCol] = { letter, state: 'active' }
      return next
    })
    setCurrentCol((c) => c + 1)
  }, [status, currentRow, currentCol])

  const deleteLetter = useCallback(() => {
    if (currentCol === 0) return
    const col = currentCol - 1
    setBoard((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })))
      next[currentRow][col] = { letter: '', state: 'empty' }
      return next
    })
    setCurrentCol(col)
  }, [currentRow, currentCol])

  const submitRow = useCallback(() => {
    if (currentCol !== COLS) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    const guess = board[currentRow].map((c) => c.letter).join('')
    const targetArr = target.split('')
    const result: LetterState[] = Array(COLS).fill('absent')
    const used = Array(COLS).fill(false)
    const guessUsed = Array(COLS).fill(false)

    // correct pass
    for (let i = 0; i < COLS; i++) {
      if (guess[i] === targetArr[i]) {
        result[i] = 'correct'
        used[i] = true
        guessUsed[i] = true
      }
    }
    // present pass
    for (let i = 0; i < COLS; i++) {
      if (guessUsed[i]) continue
      for (let j = 0; j < COLS; j++) {
        if (!used[j] && guess[i] === targetArr[j]) {
          result[i] = 'present'
          used[j] = true
          break
        }
      }
    }

    // reveal with delay
    setRevealed(currentRow)
    const delay = COLS * 120 + 100

    setTimeout(() => {
      setBoard((prev) => {
        const next = prev.map((r) => r.map((c) => ({ ...c })))
        result.forEach((s, i) => { next[currentRow][i].state = s })
        return next
      })
      setLetterStates((prev) => {
        const next = { ...prev }
        result.forEach((s, i) => {
          const ltr = guess[i]
          const order: LetterState[] = ['correct', 'present', 'absent', 'empty', 'active']
          if (!next[ltr] || order.indexOf(s) < order.indexOf(next[ltr])) {
            next[ltr] = s
          }
        })
        return next
      })
      setRevealed(null)

      if (guess === target) {
        setStatus('won')
      } else if (currentRow + 1 >= ROWS) {
        setStatus('lost')
      } else {
        setCurrentRow((r) => r + 1)
        setCurrentCol(0)
      }
    }, delay)
  }, [board, currentRow, currentCol, target])

  const handleKey = useCallback((key: string) => {
    if (key === 'ENTER') { submitRow(); return }
    if (key === '⌫' || key === 'BACKSPACE') { deleteLetter(); return }
    if (/^[A-Z]$/.test(key)) addLetter(key)
  }, [submitRow, deleteLetter, addLetter])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleKey])

  const cellClass = (state: LetterState) => {
    if (state === 'correct') return 'wl-correct'
    if (state === 'present') return 'wl-present'
    if (state === 'absent') return 'wl-absent'
    if (state === 'active') return 'wl-active'
    return ''
  }

  const keyClass = (key: string) => {
    const s = letterStates[key]
    if (s === 'correct') return 'wl-key-correct'
    if (s === 'present') return 'wl-key-present'
    if (s === 'absent') return 'wl-key-absent'
    return ''
  }

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal game-modal--wordle" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <div className="game-title-row">
            <h2 className="game-title">Wordle</h2>
            <button className="game-close" onClick={onClose}>✕</button>
          </div>
          <p className="wordle-subtitle">
            {lang === 'fr' ? t.games.wordleSubFr : t.games.wordleSubEn}
          </p>
        </div>

        {status !== 'playing' && (
          <div className="game-overlay-msg">
            <p>{status === 'won' ? t.games.won : `${t.games.lost} — ${target}`}</p>
            <button className="btn-primary" onClick={restart}>{t.games.retry}</button>
          </div>
        )}

        {/* Board */}
        <div className="wl-board">
          {board.map((row, r) => (
            <div
              key={r}
              className={`wl-row ${r === currentRow && shake ? 'wl-shake' : ''}`}
            >
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`wl-cell ${cellClass(cell.state)} ${
                    revealed === r ? `wl-reveal wl-reveal--${c}` : ''
                  }`}
                >
                  {cell.letter}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="wl-keyboard">
          {keyboardRows.map((row, ri) => (
            <div key={ri} className="wl-kb-row">
              {row.map((key) => (
                <button
                  key={key}
                  className={`wl-key ${key.length > 1 ? 'wl-key--wide' : ''} ${keyClass(key)}`}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}