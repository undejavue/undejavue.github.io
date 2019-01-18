import { ConcentrationsDto } from './concentrations.dto';
import { EmissionsDto } from './emissions.dto';
import { GasDto } from './gas.dto';
import { PpmDto } from './ppm.dto';

export class CurrentValuesDto {
    Concentration: ConcentrationsDto;
    Emission: EmissionsDto;
    Gas: GasDto;
    Ppm: PpmDto;
    UpdatedOn: string;

    constructor() {
        this.Concentration = new ConcentrationsDto();
        this.Emission = new EmissionsDto();
        this.Gas = new GasDto();
        this.Ppm = new PpmDto();
        this.UpdatedOn = 'data is unavailable';
    }
}
