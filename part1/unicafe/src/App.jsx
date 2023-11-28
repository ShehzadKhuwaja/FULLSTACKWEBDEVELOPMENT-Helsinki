import { useState } from 'react'

const Header = () => <h1>give feedback</h1>

const Button = ({name, onClick}) => {
  return (
    <button onClick={onClick}>{name}</button>
  )
}

const Display = ({name, count}) => {
  return (
    <div>{name} {count}</div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGoodByOne = () => setGood(good + 1)
  const increaseNeutralByOne = () => setNeutral(neutral + 1)
  const increaseBadByOne = () => setBad(bad + 1)

  const all = good + neutral + bad
  const avg = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <Header />
      <Button onClick={increaseGoodByOne} name="good"/>
      <Button onClick={increaseNeutralByOne} name="neutral"/>
      <Button onClick={increaseBadByOne} name="bad"/>
      <h2>Statistics</h2>
      <Display name="good" count={good} />
      <Display name="neutral" count={neutral} />
      <Display name="bad" count={bad} />
      <Display name="all" count={all} />
      <Display name="average" count={avg} />
      <div>positive {positive} %</div>
    </div>
  )
}

export default App
