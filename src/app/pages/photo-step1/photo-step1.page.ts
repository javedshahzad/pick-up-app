import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-step1',
  templateUrl: './photo-step1.page.html',
  styleUrls: ['./photo-step1.page.scss'],
})
export class PhotoStep1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  damagedCar(eve){
    console.log(eve);
  }
}
