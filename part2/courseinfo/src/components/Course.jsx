import Content from "./Content"
import Header from "./Header"
import Total from "./Total"

const Course = ({course}) => {

    const total = course.parts.reduce((sum, part) => sum += part.exercises, 0)
    
    return (
       <div>
        <Header course={course.name} />
        <Content parts={course.parts}/>
        <Total sum={total}/>
       </div> 
    )
}

export default Course