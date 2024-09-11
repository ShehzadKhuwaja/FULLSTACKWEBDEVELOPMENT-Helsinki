interface Bmi {
    height: number;
    weight: number;
}


const parseArguments = (args: string[]): Bmi => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        }
    }
    else {
        throw new Error('Provided values were not numbers!');
    }
}

const calculateBmi = (height: number, weight: number): string => {
    const bmi = (weight * 10000) / height ** 2;

    if (18.5 <= bmi && bmi <= 24.5) {
        return 'Normal (healthy weight)';
    } else if (bmi < 18.5) {
        return 'underweight';
    } else if (24.5 < bmi && bmi <= 29.9) {
        return 'overweight';
    } else {
        return 'obese';
    }
}

//console.log(calculateBmi(180, 74));
if (require.main === module) {
    try {
        const { height, weight } = parseArguments(process.argv);
        console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}

export {
    calculateBmi
}