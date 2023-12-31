import { useState } from 'react'

const Header = () => <h1>give feedback</h1>

const Button = ({name, onClick}) => {
  return (
    <button onClick={onClick}>{name}</button>
  )
}

const StatisticLine = ({name, value}) => {
  return (
    <tr>
    <td>{name}</td>
    <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const avg = (good - bad) / all
  const positive = (good / all) * 100
  
  if (all != 0) {
    return (
      <table>
        <tbody>
          <StatisticLine name="good" value={good} />
          <StatisticLine name="neutral" value={neutral} />
          <StatisticLine name="bad" value={bad} />
          <StatisticLine name="all" value={all} />
          <StatisticLine name="average" value={avg} />
          <StatisticLine  name="positive" value={positive + " %"}/>
        </tbody>
      </table>
    )
  } else {
    return (
      <p>No feedback is given</p>
    )
  }
  
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGoodByOne = () => setGood(good + 1)
  const increaseNeutralByOne = () => setNeutral(neutral + 1)
  const increaseBadByOne = () => setBad(bad + 1)

  return (
    <div>
      <Header />
      <Button onClick={increaseGoodByOne} name="good"/>
      <Button onClick={increaseNeutralByOne} name="neutral"/>
      <Button onClick={increaseBadByOne} name="bad"/>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
