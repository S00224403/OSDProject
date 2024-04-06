import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(public auth: AuthService){}
  ngOnInit(): void {
    this.auth.user$.subscribe( res => console.log(res) );
  }
}
