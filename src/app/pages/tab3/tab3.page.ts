import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  tomorrowListings: any=[];
  searchArray: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController,
    private network:NetworkService
  ) {}
  ngOnInit(): void {
   if(this.network.isConnctedNetwork){
    this.getTomorrowListings();
  }else{
    this.tomorrowListings=JSON.parse(localStorage.getItem('tomorrowListings'));
  }
  }
  getTomorrowListings(){
    this.util.showLoader();
    this.api.getListings("tomorrow").subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.util.hideLoader();
        this.tomorrowListings=res;
        this.searchArray=res;
        localStorage.setItem('tomorrowListings',JSON.stringify(this.tomorrowListings));
      }
     
    })
  }

  Search(eve){
    const str = eve.detail.value;
    if(str){
      let arrdata=this.searchArray;
      let x =arrdata.filter((a)=>a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
      this.tomorrowListings=x;
    }else{
      this.tomorrowListings=this.searchArray;
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
        this.getTomorrowListings();
        this.util.toast("Vehicle Picked up");
    
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
        this.getTomorrowListings();
        this.util.toast("Vehicle Backed");
      
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
