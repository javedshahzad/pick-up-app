import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  yesterdayListings: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService
  ) {}
  ngOnInit(): void {
    this.getYesterdayListings();
  }
  getYesterdayListings(){
    this.util.showLoader();
    this.api.getListings("yesterday").subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.hideLoader();
        this.yesterdayListings=res;
      }
     
    })
  }

}
