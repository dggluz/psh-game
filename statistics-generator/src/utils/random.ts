export const random = (min: number, max: number): number => {
    if (min === max) {
        return min;
    }

    if (max < min) {
        return random(max, min);
    }

    return min + Math.random() * (max - min);
};

export const randomInt = (min: number, max: number) =>
    Math.round(random(min, max))
;
