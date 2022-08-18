import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  yesterdayListings: any=[];
  searchArray: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController
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
      }this.searchArray=res;
     
    })
  }
  Search(eve){
    const str = eve.detail.value;
    if(str){
      let arrdata=this.searchArray;
      let x =arrdata.filter((a)=>a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
      this.yesterdayListings=x;
    }else{
      this.yesterdayListings=this.searchArray;
    }
  }
  gotoUrl(url){
    this.nav.navigateForward(url);
  }
  pickup(item){
    let data=[{
    "way":"pick_up",
    "vehicle_id":item.vehicle_id,
    "action":"set"
  },
    {
      "way":"bring_back",
      "vehicle_id":item.vehicle_id,
      "action":"unset"
      },
]
  var strigifydata=JSON.stringify(data);
    this.api.pickupAndBringBack(strigifydata).subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.toast("Vehicle Picked up");
        this.getYesterdayListings();
      }
    })
  }
  bringBack(item){
    let data=[
      {
      "way":"bring_back",
      "vehicle_id":item.vehicle_id,
      "action":"unset"
      },
      {
        "way":"pick_up",
        "vehicle_id":item.vehicle_id,
        "action":"unset"
       }
    ];
    var strigifydata=JSON.stringify(data);
    this.api.pickupAndBringBack(strigifydata).subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.toast("Vehicle Backed");
        this.getYesterdayListings();
      }
    })
  }
  ckeckUp(item){
    console.log(item);
    this.nav.navigateForward("/checkup",{queryParams:{data:item}});
  }
  gotoNote(item){
    console.log(item);
    this.nav.navigateForward("/note",{queryParams:{data:item}});
  }
  gotophotoStep1(item){
    console.log(item);
    this.nav.navigateForward("/photo-step1",{queryParams:{data:item}});
  }
}
