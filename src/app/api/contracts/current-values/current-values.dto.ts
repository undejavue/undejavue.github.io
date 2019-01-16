import { ConcentrationsDto } from './concentrations.dto';
import { EmissionsDto } from './emissions.dto';
import { GasDto } from './gas.dto';
import { PpmDto } from './ppm.dto';

export class CurrentValuesDto {
    concentrations: ConcentrationsDto;
    emissions: EmissionsDto;
    gas: GasDto;
    ppm: PpmDto;
    updatedOn: string;

    constructor() {
        this.concentrations = new ConcentrationsDto();
        this.emissions = new EmissionsDto();
        this.gas = new GasDto();
        this.ppm = new PpmDto();
        this.updatedOn = 'data is unavailable';
    }
}
