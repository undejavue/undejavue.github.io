export class PollutionModel {
    name: string;
    desc?: string;
    value: number;
    limit?: number;

    constructor(name, value, limit?, desc?) {
        this.name = name;
        this.value = value;
        this.limit = limit;
        this.desc = desc;
    }
}
