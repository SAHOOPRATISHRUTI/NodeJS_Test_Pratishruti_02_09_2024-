import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../services/service.service'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  employees: any[] = [];
  addEmployeeForm!: FormGroup;
  employeeName: any;

  totalItems: number = 0;
  itemsPerPage: number = 2;
  p: number = 1;
  searchKey: string = '';
  updatedTime: any;

  constructor(
    private httpService: ServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addEmployeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      unit: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.employeeName = navigation.extras.state['employeeName'];
    }
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      this.httpService.createEmployee(this.addEmployeeForm.value).subscribe(
        response => {
          console.log('Employee added successfully', response);
          this.toastr.success(response.message);
          this.addEmployeeForm.reset();
          this.loadEmployees(); 
        },
        error => {
          console.log('Error while adding employee', error);
          this.toastr.error(error.error.message);
        }
      );
    }
  }
  

  loadEmployees(): void {
    const order = -1;
    const payload = {
      searchKey: this.searchKey,

    };
  
    this.httpService.getEmployees(order, this.itemsPerPage,this.p, payload).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.totalItems = response.data.totalEmployees || 0;
          this.employees = response.data.employeeData.map((employee: any) => ({
            ...employee,
            formattedDate: this.formatDate(employee.updatedAt),
            formattedTime: this.formatTime(employee.updatedAt)
          }));
          this.updatedTime = this.employees[0]?.formattedDate || '';
        } else {
          this.toastr.error('Unexpected response format');
        }
      },
      error => {
        this.toastr.error('Failed to load employees');
      }
    );
  }
  
  
  
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  }

  formatTime(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', options);
  }

  onSearch(): void {
    this.p = 1;
    this.loadEmployees();
  }
  
  onItemsPerPageChange(event: Event): void {
    this.p = 1;
    this.loadEmployees();
  }



  get showingRange(): string {
    const start = (this.p - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.p * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }


  onStatusChange(employeeId: string, isActive: boolean): void {
    const action = isActive ? 'activate' : 'deactivate';
    this.httpService.updateEmployeeStatus(employeeId, action).subscribe(
      response => {
        console.log(`${action}d employee successfully`, response);
        this.toastr.success(response.message || 'Status updated successfully');
        this.loadEmployees();
      },
      error => {
        console.log(`Error while ${action}ing employee`, error);
        this.toastr.error(`Error while ${action}ing employee`);
        this.loadEmployees();
      }
    );
  }
     

  // onPageChange(page: number): void {
  //   this.p = page;
  //   this.loadEmployees();
  // }
  
}
