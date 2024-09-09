import { Component } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr'
import { state } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm:FormGroup;

constructor(private fb:FormBuilder,
            private router:Router,
            private toaster:ToastrService,
            private service:ServiceService
)
{
  this.loginForm= this.fb.group({
    email:['',[Validators.required,Validators.email]]
  });
}

get email(){
  return this.loginForm.get('email')
}

onSubmit(){
  if(this.loginForm.valid){
    const email = this.loginForm.get('email')?.value;
    sessionStorage.setItem('email',email);
    this.service.requestOTP(this.loginForm.value.email).subscribe(
      {
        next:(response:any)=>{
          this.toaster.success('OTP generated Sucessfully',response.otp)
          console.log('OTP generated Sucessfully',response);
          this.router.navigate(['/otp'],{state: {email: email}});
        },
        error:(error)=>{
          this.toaster.error('Error generating OTP',error.error.message)
          console.error('Error generating OTP',error);
        }
      }
    )
  }else{
    this.toaster.error('Please enter a valid Email')
  }
}

}
