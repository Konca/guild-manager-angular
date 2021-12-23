import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginStatusChanged = new BehaviorSubject<boolean>(false)
  

  constructor() { }


}