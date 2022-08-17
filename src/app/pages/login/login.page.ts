import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm :FormGroup;
  constructor(
    private formbuilder: FormBuilder,
    private api :ApiService,
    private nav : NavController,
    private util : UtilsService
  ) { }

  ngOnInit() {
    this.initForm();
  }
  initForm(){
        this.loginForm = this.formbuilder.group({
          phone:["",Validators.compose([Validators.required])]
        })
  }
  login(){
    this.util.showLoader();
    this.api.loginAuth(this.loginForm.value.phone).subscribe((res:any)=>{
     if(res.driver_id && res.token){
      this.util.hideLoader();
      localStorage.setItem("userData",JSON.stringify(res));
      this.util.toast("Login successfull");
      this.api.setDriver();
      this.nav.navigateForward("tabs");

     }
    },error =>{
      this.util.hideLoader();
      this.util.toast("Login Error");
    })
  }
}
