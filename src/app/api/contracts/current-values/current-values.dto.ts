import { ConcentrationsDto } from './concentrations.dto';
import { EmissionsDto } from './emissions.dto';
import { GasDto } from './gas.dto';
import { PpmDto } from './ppm.dto';

export class CurrentValuesDto {
    concentration: ConcentrationsDto;
    emission: EmissionsDto;
    gas: GasDto;
    ppm: PpmDto;
    updatedOn: string;

    constructor() {
        this.concentration = new ConcentrationsDto();
        this.emission = new EmissionsDto();
        this.gas = new GasDto();
        this.ppm = new PpmDto();
        this.updatedOn = 'data is unavailable';
    }
}
