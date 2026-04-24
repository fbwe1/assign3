import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react'

const { Badge, Button, Card } = ReactBootstrap

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [selectedSquares, setSelectedSquares] = useState(null)

  function isAdjacent (from, to) {
    const row1 = Math.floor(from / 3)
    const col1 = from % 3
    const row2 = Math.floor(to / 3)
    const col2 = to % 3

    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1
  }

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return
    }

    const currentPlayer = xIsNext ? "X" : "O"
    const pieceCount = squares.filter(s => s === currentPlayer).length
    
    const nextSquares = squares.slice()

    if (pieceCount < 3) {
      if (squares[i]) return

      nextSquares[i] = currentPlayer
      setSquares(nextSquares)
      setXIsNext(!xIsNext)
      return
    }

    if (selectedSquares === null){
      if (squares[i] === currentPlayer) {
        setSelectedSquares(i)
      }
      return
    }

    if (squares[i] === null && isAdjacent(selectedSquares, i)) {
      nextSquares[selectedSquares] = null
      nextSquares[i] = currentPlayer

      const playerHasCenter = squares[4] === currentPlayer
      const movingFromCenter = selectedSquares === 4
      const winsAfterMove = calculateWinner(nextSquares)

      if (playerHasCenter && !movingFromCenter && !winsAfterMove) {
        setSelectedSquares(null)
        return
      }

      setSquares(nextSquares)
      setSelectedSquares(null)
      setXIsNext(!xIsNext)
    } else {
      setSelectedSquares(null)
    }
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = "Winner: " + winner
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O")
  }

  return (
    <>
      <div className='status'>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
    
    
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4 ,6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares [a] === squares[b] && squares[a] === squares[c]){
      return squares[a]
    }
  }
  return null
}