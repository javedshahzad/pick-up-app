import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  tomorrowListings: any=[];
  searchArray: any=[];
  emptySearch:boolean=false;
  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController,
    private network:NetworkService,
    private storage:StorageService
  ) {}
  ngOnInit(): void {
   if(this.network.isConnctedNetwork){
    this.getTomorrowListings();
  }else{
    this.storage.getObject('tomorrowListings').then((res)=>{
      this.tomorrowListings=res;
    });
  }
  }
  getTomorrowListings(){
    this.api.getListings("tomorrow").subscribe((res:any)=>{
      console.log(res);
      if(res){
        this.tomorrowListings=res;
        this.searchArray=res;
        this.storage.setObject('tomorrowListings',this.tomorrowListings).then((res)=>{
                  
        });;
        //localStorage.setItem('tomorrowListings',JSON.stringify(this.tomorrowListings));
      }
     
    })
  }

  Search(eve){
    const str = eve.detail.value;
    if(str){
      let arrdata=this.searchArray;
      let x =arrdata.filter((a)=>a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
      this.tomorrowListings=x;
      if(x.length === 0){
        this.emptySearch=true;
       }
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
