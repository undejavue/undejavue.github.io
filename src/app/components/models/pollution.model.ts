export class PollutionModel {
    name: string;
    desc?: string;
    value: number;
    limit?: number;
    dim: string;

    constructor(name, value, dim, limit?, desc?) {
        this.name = name;
        this.value = value;
        this.limit = limit;
        this.desc = desc;
        this.dim = dim;
    }
}
