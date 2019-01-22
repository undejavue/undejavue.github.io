import { PollutionTypeEnum } from './pollution-type.enum';
import { ReportPeriodEnum } from './report-period.enum';
import { ReportDatasetDto } from './report-dataset.dto';

export class ReportDto {
    type: PollutionTypeEnum;
    period: ReportPeriodEnum;
    datasets: ReportDatasetDto [];
    limits: any;
}
