import { LocalNotificationSchema } from "@capacitor/local-notifications";

export class Remedy {
    id: number;
    name: string = '';
    type: string;
    doses: number = 0;
    interval: number = 0;
    startAt: Date;
    days: number = 0;
    notifications: LocalNotificationSchema[] = [];

    constructor(name: string, type: string, doses: number, interval: number, startAt: Date, days: number) {
        this.id = Math.floor(Math.random() * 9999) + 1;

        this.name = name;
        this.type = type;
        this.doses = doses;
        this.interval = interval;
        this.startAt = startAt;
        this.days = days;
    }
}