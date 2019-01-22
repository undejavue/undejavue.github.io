export class EmissionsDto {
    co: number;
    co2: number;
    no: number;
    no2: number;
    so2: number;

    constructor() {
        this.co = 0.000;
        this.co2 = 0.0;
        this.no = 0.000;
        this.no2 = 0.000;
        this.so2 = 0.000;
    }
}
