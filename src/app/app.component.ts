import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { NetworkService } from './services/network.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Listings', url: '/tabs', icon: 'mail' },
    { title: 'Picture pending', url: '/pendings', icon: 'paper-plane' },
    { title: 'Logout', url: '/login', icon: 'heart' },
  ];
  userData: any;
  constructor(
    private nav:NavController,
    private network: NetworkService,
    private platform:Platform
  ) {}
  ngOnInit(): void {
    
    this.userData=JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData)
    if(this.userData?.driver_id && this.userData?.token){
      this.nav.navigateRoot("tabs")
    }else{
      this.nav.navigateRoot("login")
    }
   this.initApp()
  }
  initApp()
  {
    this.platform.ready().then((res)=>{
      this.network.watchNetwork();
    })
  }
  logout(){
    localStorage.clear();
    this.nav.navigateRoot("/login");
  }
}
