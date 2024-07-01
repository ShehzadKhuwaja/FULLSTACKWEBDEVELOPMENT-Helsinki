const calculateBmi = (height: number, weight: number): string => {
    const bmi = (weight * 10000) / height ** 2

    if (18.5 <= bmi && bmi <= 24.5) {
        return 'Normal (healthy weight)'
    } else if (bmi < 18.5) {
        return 'underweight'
    } else if (24.5 < bmi && bmi <= 29.9) {
        return 'overweight'
    } else {
        return 'obese'
    }
}

console.log(calculateBmi(180, 74))