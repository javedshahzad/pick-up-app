import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { NetworkService } from './services/network.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StorageService } from './services/storage.service';

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
    private platform:Platform,
    private splash:SplashScreen,
    private statusbar:StatusBar,
    private storage:StorageService
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
      this.splash.hide();
      this.statusbar.backgroundColorByHexString('#0273fe');
      this.network.watchNetwork();
      this.storage.init();
      this.storage.set("name","javed shahzad nns").then((res)=>{
        console.log(":saved");
        console.log(res);
      });
    })
  }
  logout(){
    localStorage.removeItem('userData');
    this.nav.navigateRoot("/login");
  }
}
