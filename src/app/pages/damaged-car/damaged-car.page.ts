import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-damaged-car',
  templateUrl: './damaged-car.page.html',
  styleUrls: ['./damaged-car.page.scss'],
})
export class DamagedCarPage implements OnInit {
  @Output() getdataFromDamagedcar: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    let data={
      "id":"1",
      "damagedArea":"windshield"
    };
    this.getdataFromDamagedcar.emit(data);
  }
  addclass(id,damageArea){
    console.log(id,damageArea);
    for( let i = 0; i <=34;i++){
      document.getElementById('id'+i)?.classList?.remove('st21-press');
    }
    document.getElementById('id'+id).classList.add('st21-press');
    let data={
      "id":id,
      "damagedArea":damageArea
    }
    this.getdataFromDamagedcar.emit(data)
  }
}
