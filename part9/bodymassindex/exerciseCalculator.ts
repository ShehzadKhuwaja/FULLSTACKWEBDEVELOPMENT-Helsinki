interface Achievement {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

interface ExerciseInputs {
    target: number;
    days: number[];
}

const parseArgs = (args: string[]): ExerciseInputs => {
    if (args.length < 4) throw new Error('Not enough arguments');

    for (let i = 2; i < args.length; i++) {
        if (isNaN(Number(args[i]))) {
            throw new Error('Provided values were not numbers!')
        }
    }
    return {
        target: Number(args[2]),
        days: args.map(Number).filter((_, index) => index > 2)
    }
}

const calculateExercises = (days: number[], target: number): Achievement => {
    const periodLength = days.length;
    const trainingDays = days.filter(hour => hour !== 0).length;
    const sum = days.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / periodLength;
    const success = average >= target;

    let rating = null;
    let ratingDescription = null;

    if (success) {
        rating = 3;
        ratingDescription = 'Excellent';
    } else if ((target - average) <= 0.5) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 1;
        ratingDescription = 'need improvement';
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

//console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

try {
   const { target, days } = parseArgs(process.argv);
   console.log(calculateExercises(days, target));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}