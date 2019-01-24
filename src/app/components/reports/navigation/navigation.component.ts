import { Component, OnInit, Input } from '@angular/core';
import { PollutionTypeEnum } from '../../../api/contracts/reports/pollution-type.enum';
import { ReportPeriodEnum } from '../../../api/contracts/reports/report-period.enum';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() reportId: string;

  // items: INavItem[];
  type: any;
  period: any;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.type = PollutionTypeEnum.Concentration;
    this.period = ReportPeriodEnum.ByDay;

   /*  this.items = [
      {
        routerLink: ['/map'],
        queryParams: {},
        id: 'map',
        title: 'Интерактивная карта'
      },
      {
        routerLink: ['/reports-about', this.reportId],
        queryParams: {},
        id: 'reports-about',
        title: 'Информация об объекте'
      },
      {
        routerLink: ['/reports-list'],
        queryParams: {},
        id: 'reports-list',
        title: 'Список объектов'
      },
      {
        routerLink: ['/reports', this.reportId],
        queryParams: { type: 'concentration', period: 'byday' },
        id: 'concentration-byday',
        title: 'Отчет \'Концентрация за сутки\''
      },
      {
        routerLink: ['/reports', this.reportId],
        queryParams: { type: 'emission', period: 'byday' },
        id: 'emission-byday',
        title: 'Отчет \'Выбросы за сутки\''
      },
      {
        routerLink: ['/reports', this.reportId],
        queryParams: { type: 'emission', period: 'bymonth' },
        id: 'emission-bymonth',
        title: 'Выбросы - месячный отчет'
      },
      {
        routerLink: ['/reports', this.reportId],
        queryParams: { type: 'emission', period: 'byyear' },
        id: 'emission-byyear',
        title: 'Выбросы - сводный отчет за год'
      },
    ];

    this.activatedRoute.queryParams.pipe()
    .subscribe(params => {
      if (params && params['type'] && params['period']) {
        this.type = params['type'] ;
        this.period = params['period'];
      }
    }); */

  }

  isActive(tabId: string) {
    const result = tabId === `${this.type}-${this.period}`;
    return result;
  }

}
