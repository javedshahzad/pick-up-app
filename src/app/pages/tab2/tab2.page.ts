import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  todayListings: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController
  ) {}
  ngOnInit(): void {
    this.api.setDriver();
    this.getTodayListings();
  }
    getTodayListings(){
      this.util.showLoader();
      this.api.getListings("today").subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.util.hideLoader();
          this.todayListings=res;
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
    }]
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
      let data=[{
        "way":"bring_back",
        "vehicle_id":item.vehicle_id,
        "action":"set"
      }];
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
}
