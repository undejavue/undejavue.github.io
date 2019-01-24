import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  protected page: string;

  constructor(protected route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.url.subscribe(segments => {
      this.page = segments.join('');
    });
  }

}
