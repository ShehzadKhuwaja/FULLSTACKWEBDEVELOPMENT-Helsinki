interface Achievement {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const calculateExercises = (days: number[], target: number): Achievement => {
    const periodLength = days.length
    const trainingDays = days.filter(hour => hour !== 0).length
    const sum = days.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const average = sum / periodLength
    const success = average >= target

    let rating = null
    let ratingDescription = null

    if (success) {
        rating = 3
        ratingDescription = 'Excellent'
    } else if ((target - average) <= 0.5) {
        rating = 2
        ratingDescription = 'not too bad but could be better'
    } else {
        rating = 1
        ratingDescription = 'need improvement'
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))