import { PollutionTypeEnum } from '../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../api/contracts/reports/report-period.enum';


export const getReportTitle = (type: PollutionTypeEnum, period: ReportPeriodEnum) => {
    const t = type === PollutionTypeEnum.Concentration ? 'Концентрации' : 'Выбросы';
    let p = '';
    switch (period) {
        case ReportPeriodEnum.ByDay: p = 'выбранные сутки'; break;
        case ReportPeriodEnum.ByMonth: p = 'месяц'; break;
        case ReportPeriodEnum.ByYear: p = 'год'; break;
    }
    return `${t} загрязняющих веществ за ${p}`;
};

export const getMonth = (d: string) => {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
     const date = new Date(d);

    return  monthNames[date.getMonth()];
};

export const toCamelCase = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
