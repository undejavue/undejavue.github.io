export class EmissionsDto {
    CO: number;
    CO2: number;
    NO: number;
    NO2: number;
    SO2: number;

    constructor() {
        this.CO = 0.000;
        this.CO2 = 0.0;
        this.NO = 0.000;
        this.NO2 = 0.000;
        this.SO2 = 0.000;
    }
}
