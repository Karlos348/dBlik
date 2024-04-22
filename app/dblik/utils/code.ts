const CODE_MIN: number = 100000;
const CODE_MAX: number = 999999;

export function generateCode() {
    return Math.floor(Math.random() * (CODE_MAX - CODE_MIN + 1)) + CODE_MIN;
}