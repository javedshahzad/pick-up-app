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
  NotesData: any=[];

  constructor(
    private api:ApiService,
    private util:UtilsService,
    private active:ActivatedRoute,
    private nav:NavController,
    private network:NetworkService
  ) { }

  ngOnInit() {
    this.DamageData = JSON.parse(localStorage.getItem("damageData")) ? JSON.parse(localStorage.getItem("damageData")) :[];
    this.NotesData = JSON.parse(localStorage.getItem("notesData")) ? JSON.parse(localStorage.getItem("notesData")) :[];
    console.log(this.DamageData)
  }
  syncData(){
    if(this.network.isConnctedNetwork){
      if(this.DamageData.length > 0){
        this.DamageData.forEach(element => {
          this.util.uploadFile(element.base64Image,'set-vehicle-pictures.php',element.vehicle_id);
          let formdata= new FormData();
          formdata.append("damage", element.damage);
          this.api.SetVehiclePictures(element.vehicle_id,formdata).subscribe((res:any)=>{
            console.log(res);
          })
        });
        localStorage.setItem('damageData',"");
      }
      if(this.NotesData.length > 0){
        this.NotesData.forEach(element => {
          this.util.uploadFile(element.base64Image,'set-note-pictures.php',element.vehicle_id);
            // set notes 
            let data ={
              "note":element.note,
              "pictures_to_delete":element.pictures_to_delete
              }
              var stringify = JSON.stringify(data);
              this.api.SetNote(element.vehicle_id,stringify).subscribe((res:any)=>{
              console.log(res);
              })
        });
        localStorage.setItem('notesData',"");
      }
    }else{
      this.util.toast("Please connect to a network to sync")
    }
  }
}
