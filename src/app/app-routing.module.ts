// In Angular, the best practice is to load and configure the router in a separate, top-level module that is dedicated to routing and imported by the root AppModule.
// By convention, the module class name is AppRoutingModule and it belongs in the app-routing.module.ts in the src/app folder.
// CLI COMMAND: ng generate module app-routing --flat --module=app
    //--flat : Puts the file in src/app instead of its own folder.
    //--module=app : Tells the CLI to register it in the imports array of the AppModule.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// Routes tell the Router which view to display when a user clicks a link or pastes a URL into the browser address bar.
  // path	: A string that matches the URL in the browser address bar.
  // component : The component that the router should create when navigating to this route.
  // This tells the router to match that URL to path: 'heroes' and display the HeroesComponent when the URL is something like localhost:4200/heroes.
const routes: Routes = [
  // This route redirects a URL that fully matches the empty path to the route whose path is '/dashboard'.
  // After the browser refreshes, the router loads the DashboardComponent and the browser address bar shows the /dashboard URL.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // The colon (:) character in the path indicates that :id is a placeholder for a specific hero id.
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
];

// The @NgModule metadata initializes the router and starts it listening for browser location changes.
@NgModule({
  // adds the RouterModule to the AppRoutingModule imports array and configures it with the routes in one step by calling RouterModule.forRoot():
  // The method is called forRoot() because you configure the router at the application's root level. The forRoot() method supplies the service providers and directives needed for routing, and performs the initial navigation based on the current browser URL.
  imports: [RouterModule.forRoot(routes)],
  // AppRoutingModule exports RouterModule so it will be available throughout the application.
  exports: [RouterModule]
})
export class AppRoutingModule { }
