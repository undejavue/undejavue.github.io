import { PollutionTypeEnum } from '../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../api/contracts/reports/report-period.enum';

export const getReportTitle = (type: PollutionTypeEnum, period: ReportPeriodEnum) => {
    const t = type === PollutionTypeEnum.Concentration ? 'Концентрации' : 'Выбросы';
    let p = '';
    switch (period) {
        case ReportPeriodEnum.ByDay: p = 'выбранные сутки'; break;
        case ReportPeriodEnum.ByDay: p = 'месяц'; break;
        case ReportPeriodEnum.ByDay: p = 'год'; break;
    }
    return `${t} загрязняющих веществ за ${p}`;
};
