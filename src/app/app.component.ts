import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validators';
import { PasswordValidator } from './shared/password.validator';
import { RegistrationService } from "./registration.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'reactive-forms';
  
  registrationFrom :any =  FormGroup;

  get userName(){
    return this.registrationFrom.get('userName');
  }
  get email(){
    return this.registrationFrom.get('email');
  }
  get alternateEmails(){
    return this.registrationFrom.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.fb.control(''));
  }
  constructor(private fb: FormBuilder, private _registrationService : RegistrationService){}

  ngOnInit(){
    this.registrationFrom =this.fb.group({
      userName : ['' , [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email : '',
      subscribe :[false],
      password : [''],
      confirmPassword : [''],
      address : this.fb.group({
        city :[],
        state : [],
        postalCode : [],
      }),
      alternateEmails : this.fb.array([])
    }, { validator : PasswordValidator});
    this.registrationFrom.get('subscribe').valueChanges
      .subscribe((checkedValue: any) =>{
        const email = this.registrationFrom.get('email');
        if(checkedValue){
          email.setValidators(Validators.required);
        }else{
          email.clearValidators();
        }
        email.updateValueAndValidity();
      })
  }

  
  // registrationFrom = new FormGroup({
  //   username : new FormControl('devansh'),
  //   password : new FormControl(''),
  //   confirmPassword : new FormControl(''),
  //   address : new FormGroup({
  //     city : new FormControl(''),
  //     state : new FormControl(''),
  //     postalCode : new FormControl('')
  //   })


  // });
  loadApiData(){
     this.registrationFrom.patchValue({
        userName : 'Devansh',
        password : 'test',
        confirmPassword : 'test',
        // address : {
        //   city : 'City',
        //   state : 'State',
        //   postalCode : '1234'

        // }
     })
  }
  onSubmit(){
    console.log(this.registrationFrom.value);
    this._registrationService.register(this.registrationFrom.value)
      .subscribe(
        response => console.log('Success !', response),
        error => console.log('Error!', error)
      )
      
  }
}
