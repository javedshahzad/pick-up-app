import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  todayListings: any=[];
  searchArray: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController,
    private network:NetworkService
  ) {}
  ngOnInit(): void {
    console.log(navigator.onLine)
    this.api.setDriver();
    if(this.network.isConnctedNetwork){
      this.getTodayListings();
    }else{
      this.todayListings=JSON.parse(localStorage.getItem('todayListings'));
    }
   
  }
    getTodayListings(){
      this.util.showLoader();
      this.api.getListings("today").subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.util.hideLoader();
          this.todayListings=res;
          this.searchArray=res;
          localStorage.setItem('todayListings',JSON.stringify(this.todayListings));
        }
       
      })
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
          this.getTodayListings();
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
          this.getTodayListings();
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
    Search(eve){
      const str = eve.detail.value;
      if(str){
        let arrdata=this.searchArray;
        let x =arrdata.filter((a)=>a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
        this.todayListings=x;
      }else{
        this.todayListings=this.searchArray;
      }
    }
}
