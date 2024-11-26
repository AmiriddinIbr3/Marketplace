export function delay(sec: number) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export function getRandomElementFromArray(arr: any[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function getExpirationInMinutes(minutes: number): number {
    return minutes * 60;
}

export function getExpirationInHours(hours: number): number {
    return hours * 3600;
}