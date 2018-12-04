import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss']
})
export class DistanceComponent implements OnInit {
  myForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  @Output() distance: EventEmitter<number> = new EventEmitter();

  ngOnInit() {
    this.myForm = new FormGroup({distance: new FormControl()});
    this.myForm.valueChanges.pipe().subscribe(value => {
      this.distance.emit(value);
    });
  }

  onSubmit(e) {}

}
