import { useCallback, useMemo, useState } from 'react'
import './App.css'

type LevelType = 'facil' | 'medio' | 'dificil'

const CELLSBYLEVEL: Record<LevelType, number> = {
  "facil": 9,
  "medio": 16,
  "dificil": 25
}

function App() {
  const [nivel, setNivel] = useState<LevelType>('facil')
  const [gameKey, setGameKey] = useState(false)

  const cellsMines = useMemo(() => {
    const min = 0
    const arraySize = CELLSBYLEVEL[nivel]
    const max = Math.floor(arraySize * 0.3)
    return Array.from({ length: max }).map(() => Math.floor(Math.random() * (arraySize - min)) + min)

  }, [nivel, gameKey])

  const checkHowManyMinesAround = useCallback((index: number) => {
    const arraySize = Math.sqrt(CELLSBYLEVEL[nivel])
    const totalCells = CELLSBYLEVEL[nivel]
    let minesAround = 0
    const col = index % arraySize

    const neighbors = [
      { offset: -arraySize - 1, validCol: col > 0 },
      { offset: -arraySize, validCol: true },
      { offset: -arraySize + 1, validCol: col < arraySize - 1 },
      { offset: -1, validCol: col > 0 },
      { offset: 1, validCol: col < arraySize - 1 },
      { offset: arraySize - 1, validCol: col > 0 },
      { offset: arraySize, validCol: true },
      { offset: arraySize + 1, validCol: col < arraySize - 1 },
    ]

    neighbors.forEach(({ offset, validCol }) => {
      const neighborIndex = index + offset
      if (validCol && neighborIndex >= 0 && neighborIndex < totalCells) {
        if (cellsMines.includes(neighborIndex)) {
          minesAround++
        }
      }
    })

    return minesAround
  }, [nivel, cellsMines])

  const handleCellClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (e.currentTarget.dataset.mine === 'true') {
      alert('Game Over')
      return
    }

    const minesAround = checkHowManyMinesAround(Number(e.currentTarget.dataset.index))
    e.currentTarget.innerHTML = minesAround.toString()

  }, [checkHowManyMinesAround])

  const fillCellsWithMines = useCallback((cellsMines: number[]) => {
    const arraySize = CELLSBYLEVEL[nivel]
    return Array.from({ length: arraySize }).map((_, index) => (
      <button key={`${gameKey}-${index}`} className="cell" onClick={handleCellClick} data-mine={cellsMines.includes(index)} data-index={index} />
    ))
  }, [nivel, handleCellClick, gameKey])

  const handleNovoJogo = () => {
    setGameKey(prev => !prev)
  }

  return (
    <>
      <h1>Campo Minado</h1>
      <div className="option-container">
        <button className='novo-jogo-button' onClick={handleNovoJogo}>Novo Jogo</button>
        <div className="nivel-container">
          <label htmlFor="nivel">Nivel</label>
          <select name="nivel" id="nivel" onChange={(e) => { setNivel(e.target.value as LevelType); setGameKey(prev => !prev) }}>
            <option value="facil">Facil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Dificil</option>
          </select>
        </div>
      </div>

      <div id='game' className={`${nivel}`}>
        {fillCellsWithMines(cellsMines)}
      </div>
    </>
  )
}

export default App
