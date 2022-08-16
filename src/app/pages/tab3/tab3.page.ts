import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  tomorrowListings: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController
  ) {}
  ngOnInit(): void {
   this.getTomorrowListings();
  }
  getTomorrowListings(){
    this.util.showLoader();
    this.api.getListings("tomorrow").subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.hideLoader();
        this.tomorrowListings=res;
      }
     
    })
  }
  gotoUrl(url){
    this.nav.navigateForward(url);
  }
}
