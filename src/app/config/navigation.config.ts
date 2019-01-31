export enum NavigationTabs {
    Map = 'map',
    ReportDetails = 'report-details',
    ReportInfo = 'report-info',
    ReportsList = 'reports-list',
    ReportCDay = 'concentration-byday',
    ReportEDay = 'emission-byday',
    ReportEMonth = 'emission-bymonth',
    ReportEYear = 'emission-byyear'
}

export const navigationItems = () => {
  return [
    {
      routerLink: ['/map'],
      queryParams: {},
      id: NavigationTabs.Map,
      title: 'Интерактивная карта'
    },
    {
      routerLink: ['/reports/list'],
      queryParams: {},
      id: NavigationTabs.ReportsList,
      title: 'Список объектов'
    },
  ];
};

export const navigationWithDetails = (reportId: string) => {
return  [
    {
      routerLink: ['/map'],
      queryParams: {},
      id: NavigationTabs.Map,
      title: 'Интерактивная карта'
    },
    {
      routerLink: ['/reports/list'],
      queryParams: {},
      id: NavigationTabs.ReportsList,
      title: 'Список объектов'
    },
    {
      routerLink: ['/report/info', reportId],
      queryParams: {},
      id: NavigationTabs.ReportInfo,
      title: 'Информация об объекте'
    },
    {
      routerLink: ['/report/details', reportId],
      queryParams: { type: 'concentration', period: 'byday' },
      id: NavigationTabs.ReportCDay,
      title: 'Отчет \'Концентрация за сутки\''
    },
    {
      routerLink: ['/report/details', reportId],
      queryParams: { type: 'emission', period: 'byday' },
      id: NavigationTabs.ReportEDay,
      title: 'Отчет \'Выбросы за сутки\''
    },
/*     {
      routerLink: ['/report/details', reportId],
      queryParams: { type: 'emission', period: 'bymonth' },
      id: NavigationTabs.ReportEMonth,
      title: 'Выбросы - месячный отчет'
    }, */
    {
      routerLink: ['/report/details', reportId],
      queryParams: { type: 'emission', period: 'byyear' },
      id: NavigationTabs.ReportEYear,
      title: 'Выбросы - сводный отчет за год'
    },
  ];
};
