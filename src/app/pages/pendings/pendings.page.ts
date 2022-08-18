import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pendings',
  templateUrl: './pendings.page.html',
  styleUrls: ['./pendings.page.scss'],
})
export class PendingsPage implements OnInit {
  DamageData: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController,
    private network:NetworkService
  ) { }

  ngOnInit() {
    this.DamageData = JSON.parse(localStorage.getItem("damageData")) ? JSON.parse(localStorage.getItem("damageData")) :[];
    console.log(this.DamageData)
  }
  syncData(){
    if(this.DamageData.length > 0){
      this.DamageData.forEach(element => {
        this.util.uploadFile(element.base64Image,'set-vehicle-pictures.php',element.vehicle_id);
        let formdata= new FormData();
        formdata.append("damage", element.damage);
        this.api.SetVehiclePictures(element.vehicle_id,formdata).subscribe((res:any)=>{
          console.log(res);
        })
      });
   
    }
  }
}
