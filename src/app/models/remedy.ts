export class Remedy {
    name: string = '';
    type: string;
    quantity: number = 0;
    interval: number = 0;
    startAt: Date;
    confirmedDates: Date[];  // Adicionando esta propriedade

    constructor(name: string, type: string, quantity: number, interval: number, startAt: Date) {
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.interval = interval;
        this.startAt = startAt;
        this.confirmedDates = [];
    }
}
