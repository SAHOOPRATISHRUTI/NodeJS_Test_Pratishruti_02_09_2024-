import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { ToastrService } from 'ngx-toastr';
import { state } from '@angular/animations';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';
  email: string | null = null;
  

  constructor(private router: Router, private authService: ServiceService,private toastr:ToastrService) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation?.extras.state){
      this.email = navigation.extras.state['email'];
    }

  }

  ngOnInit() {
    // if (typeof window !== 'undefined' && window.sessionStorage) {
    //   this.email = sessionStorage.getItem('email');
    //   console.log('Email from session:', this.email);
    // }
  }
  

  verifyOtp() {
    const enteredOtp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
  
    if (!this.email) {
      console.log('Email not found in session.');
      this.toastr.error('Email not found in session.');
      return;
    }
  
    this.authService.verifyOtp(this.email, enteredOtp).subscribe(
      (response: any) => {
        console.log('Response:', response); 
        if (response.sucess) {
          localStorage.setItem('token',response.data.token)
          this.toastr.success('Login Sucessful')
          console.log('Login Successful');
          
          const employeeName=response.data.employee.employeeName;
          console.log(employeeName)
          this.router.navigate(['/user-dashboard'], {state:{employeeName: employeeName}});


          // Store the employee name in session storage
          // sessionStorage.setItem('employeeName', employeeName);
        } else {
          console.log('OTP verification failed:', response.message);
          this.toastr.error('OTP verification failed. ' + response.message );
        }
      },
      (error) => {
        console.error('Error verifying OTP', error);
        this.toastr.error(error.error.message);
      }
    );
    
  }
  
  getOtp() {
    if (this.email) {
      this.authService.requestOTP(this.email).subscribe(
        (response: any) => {
          if (response.sucess) {
            this.toastr.success('OTP resent successfully.', 'Success');
           
          } else {
            this.toastr.error('Failed to resend OTP. Please try again.', 'Error');
            
          }
        },
        (error) => {
          this.toastr.error('Error sending OTP, please try again later.', 'Error');
          
        }
      );
    } else {
      this.toastr.warning('Email not found. Please try logging in again.', 'Warning');
      console.log('Email not found.');
    }
  }
  

  moveFocus(event: any, nextInput: string): void {
    const input = event.target as HTMLInputElement;
    const maxLength = parseInt(input.maxLength.toString(), 10);
    const currentLength = input.value.length;
    if (currentLength >= maxLength) {
      const element = document.getElementsByName(nextInput)[0] as HTMLInputElement;
      if (element) {
        element.focus();
      }
    }
  }

  
  moveBack(event: KeyboardEvent, prevInput: string): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value.length === 0) {
      const element = document.getElementsByName(prevInput)[0] as HTMLInputElement;
      if (element) {
        element.focus();
      }
    }
  }
}
