import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AssignmentPart2';
  isHandset$: Observable<boolean>;
  showMenu = false;
  loggedIn = false;
  role='';
  constructor( public auth: AuthService, private breakpointObserver: BreakpointObserver, @Inject(DOCUMENT) public document: Document) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map((result: { matches: any; }) => result.matches)
    );
    
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  ngOnInit(): void {
    this.auth.user$.subscribe( res => console.log(res) );
    if(this.auth.user$){
      this.auth.user$.subscribe( res => 
        {
          if(res?.email == 'adminosd@gmail.com'){
            localStorage.setItem('role', 'admin');
            this.getRole();
          }
          else{
            localStorage.setItem('role', 'user');
            this.getRole();
          }
        } );
        
    }
  }
  getRole(){
    this.role = localStorage.getItem('role') || '';
  }
  handleLogOut() {
    localStorage.setItem('role', '');
    this.auth.logout({
    });
  }

  handleLogIn() {
   this.auth.loginWithRedirect({
      appState: {
        target: this.document.location.pathname,
      },
    });
    
  }
}

