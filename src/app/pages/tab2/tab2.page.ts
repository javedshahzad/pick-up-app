import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  todayListings: any=[];
  searchArray: any=[];
  emptySearch:boolean=false;
  ifalreadyHave: any=[];
  PickupSaveOffline: any=[];
  userData: any;
  BringBackSaveOffline: any=[];
  ifalreadyHaveBringBack: any=[];
  
  PickupArray=[];
  PickupIndex:any=0;
  PickupLength:any=0;
  PickupChecks:any=1;
  PickupSyncData: any='';

  BringBackArray=[];
  BringBackIndex:any=0;
  BringBackLength:any=0;
  BringBackChecks:any=1;
  BringBackSyncData: any='';

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private nav : NavController,
    private network:NetworkService,
    private storage:StorageService,
    private WatchNetwork: Network,
  ) {}
  ngOnInit(): void {
    console.log(navigator.onLine)
    this.api.setDriver();
    this.GetAndSetListings();
    this.watchNetworks();
   
  }
  GetAndSetListings(){
    if(this.network.isConnctedNetwork){
      this.getTodayListings();
    }else{
      this.storage.getObject('todayListings').then((res)=>{
        console.log(res);
        this.todayListings=res;
      });
    }
  }
    getTodayListings(){
      this.api.getListings("today").subscribe((res:any)=>{
        console.log(res);
        if(res){
          this.todayListings=res;
          this.searchArray=res;
          this.storage.setObject('todayListings',this.todayListings).then((res)=>{
                  
          });
          //localStorage.setItem('todayListings',JSON.stringify(this.todayListings));

        }
       
      })
    }
    gotoUrl(url){
      this.nav.navigateForward(url);
    }
    pickup(item){
      if(this.network.isConnctedNetwork){
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
          });
      }else{
        this.storage.getObject('PickupOffline').then((res)=>{
          this.ifalreadyHave= res ? res : [];
        });
         if(this.ifalreadyHave.length > 0){
          this.PickupSaveOffline= this.ifalreadyHave
         }
          this.PickupSaveOffline.push(item);
          this.storage.setObject('PickupOffline',this.PickupSaveOffline).then((res)=>{
            //saved
            console.log(res,"Pickup dataaaaaaaa")
            this.updatedArrayForPIckup(item);
            this.util.toast("Vehicle has been pickup");
          });
      
      }

    }

    updatedArrayForPIckup(item){
      this.userData=JSON.parse(localStorage.getItem("userData"));
        //find the index of object from array that you want to update
        const objIndex = this.todayListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);

        // Make sure to avoid incorrect replacement
        // When specific item is not found
        if (objIndex === -1) {
        return;
        }

        // make new object of updated object.   
        const updatedObj = { ...this.todayListings[objIndex], driver_id_pick_up: this.userData?.driver_id,driver_trigram_pick_up: "ADU"};

        // make final new array of objects by combining updated object.
        const UpdatedListings = [
        ...this.todayListings.slice(0, objIndex),
        updatedObj,
        ...this.todayListings.slice(objIndex + 1),
        ];

        console.log("original data=", this.todayListings);
        console.log("updated data=", UpdatedListings);
        this.storage.setObject('todayListings',UpdatedListings).then((res)=>{
          this.GetAndSetListings();
        });
    }
    bringBack(item){
      if(this.network.isConnctedNetwork){
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
            this.util.toast("Vehicle has been Back");
            this.getTodayListings();
          }
        });
      }else{
        this.storage.getObject('BringBackOffline').then((res)=>{
          this.ifalreadyHaveBringBack = res ? res : [];
        });
         if(this.ifalreadyHaveBringBack.length > 0){
          this.BringBackSaveOffline= this.ifalreadyHaveBringBack
         }
          this.BringBackSaveOffline.push(item);
          this.storage.setObject('BringBackOffline',this.BringBackSaveOffline).then((res)=>{
            //saved
            this.storage.getObject('BringBackOffline').then((back)=>{
              console.log(back);
            })
            console.log(res,"Bring back")
            this.updatedArrayForBringBack(item);
            this.util.toast("Vehicle has been back");
          });
      }
    }
    updatedArrayForBringBack(item){
      this.userData=JSON.parse(localStorage.getItem("userData"));
        //find the index of object from array that you want to update
        const objIndex = this.todayListings.findIndex(obj => obj.vehicle_id === item.vehicle_id);

        // Make sure to avoid incorrect replacement
        // When specific item is not found
        if (objIndex === -1) {
        return;
        }

        // make new object of updated object.   
        const updatedObj = { ...this.todayListings[objIndex], driver_id_pick_up: "0",driver_trigram_pick_up: "***"};

        // make final new array of objects by combining updated object.
        const UpdatedListings = [
        ...this.todayListings.slice(0, objIndex),
        updatedObj,
        ...this.todayListings.slice(objIndex + 1),
        ];

        console.log("original data=", this.todayListings);
        console.log("updated data=", UpdatedListings);
        this.storage.setObject('todayListings',UpdatedListings).then((res)=>{
          this.GetAndSetListings();
        });
    }

    againUnset(item){
      if(this.network.isConnctedNetwork){
        let data=[{
          "way":"pick_up",
          "vehicle_id":item.vehicle_id,
          "action":"unset"
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
              this.util.toast("Vehicle unsetd");
              this.getTodayListings();
            }
          })
      }else{
        this.bringBack(item);
      }
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
      this.emptySearch=false;
      const str = eve.detail.value;
      console.log(str);
      if(str){
        let arrdata=this.searchArray;
        let x =arrdata.filter((a)=>a.vehicle_registration.toUpperCase().includes(str.toUpperCase()));
       this.todayListings=x;
       if(x.length === 0){
        this.emptySearch=true;
       }
      }else{
        this.todayListings=this.searchArray;
      }
    }

    watchNetworks(){
         // watch network for a connection
         this.WatchNetwork.onConnect().subscribe((net) => {

          console.log(net,'network connected!');
          // We just got a connection but we need to wait briefly
          // before we determine the connection type. Might need to wait.
          // prior to doing any api requests as well.
          setTimeout(() => {
          console.log('We got a connection, woohoo!');
          this.network.isConnctedNetwork=true;
          this.uploadPickup();
          this.uploadBringBack();
          }, 1000);
          });
    }


    // pickup

    uploadPickup(){
      this.storage.getObject('PickupOffline').then((res)=>{
        console.log(res);
        this.PickupArray= res ? res : [];
        this.PickupLength=this.PickupArray.length;
        if(this.PickupLength > 0){
         this.PickupSyncData = this.PickupArray[this.PickupIndex];
         console.log(this.PickupSyncData);
          this.UploadToServerPickup(this.PickupSyncData)
        }
      })
    }
    UploadToServerPickup(item){
      let data=[{
        "way":"pick_up",
        "vehicle_id":item?.vehicle_id,
        "action":"set"
      },
        {
          "way":"bring_back",
          "vehicle_id":item?.vehicle_id,
          "action":"unset"
          },
    ]
      var strigifydata=JSON.stringify(data);
        this.api.pickupAndBringBack(strigifydata).subscribe((res:any)=>{
          console.log(res);
          if(res){
            if(this.PickupLength === this.PickupChecks){
              console.log("saved uploaded PickupOffline");
              this.storage.remove('PickupOffline');
            }else{
              this.RemoveUploadedItemForPickup(this.PickupIndex);
              this.PickupChecks++;
              this.PickupIndex++;
              this.uploadPickup();
            }
          }
        });
    }
    RemoveUploadedItemForPickup(id){
      this.PickupArray.splice(0, 1);
      console.log(this.PickupArray,"Deleted")
      this.storage.setObject('PickupOffline',this.PickupArray).then((res)=>{
        //saved updated
        this.storage.getObject('PickupOffline').then((res)=>{
          this.PickupArray = res ? res : [];
        })
      });
      console.log(this.PickupArray,"Deleted")
}

//Bring back

uploadBringBack(){
  this.storage.getObject('BringBackOffline').then((res)=>{
    console.log(res);
    this.BringBackArray= res ? res : [];
    this.BringBackLength=this.BringBackArray.length;
    if(this.BringBackLength > 0){
     this.BringBackSyncData = this.BringBackArray[this.BringBackIndex];
     console.log(this.BringBackSyncData)
      this.UploadToServerBringBack(this.BringBackSyncData)
    }
  })
}
UploadToServerBringBack(item){
  let data=[
    {
    "way":"bring_back",
    "vehicle_id":item?.vehicle_id,
    "action":"unset"
    },
    {
      "way":"pick_up",
      "vehicle_id":item?.vehicle_id,
      "action":"unset"
     }
  ];
  var strigifydata=JSON.stringify(data);
    this.api.pickupAndBringBack(strigifydata).subscribe((res:any)=>{
      console.log(res);
      if(res){
        if(this.BringBackLength === this.BringBackChecks){
          console.log("saved uploaded BringBackOffline");
          this.storage.remove('BringBackOffline');
        }else{
          this.RemoveUploadedItemForPickup(this.BringBackIndex);
          this.BringBackChecks++;
          this.BringBackIndex++;
          this.uploadBringBack();
        }
      }
    });
}
RemoveUploadedItemForBringBack(id){
  console.log(this.BringBackArray,"Bring back array")
  this.BringBackArray.splice(0, 1);
  this.storage.setObject('BringBackOffline',this.BringBackArray).then((res)=>{
    //saved updated
    this.storage.getObject('BringBackOffline').then((res)=>{
      this.BringBackArray = res ? res : [];
    })
  });
  console.log(this.BringBackArray,"Bring back array")
}

}
