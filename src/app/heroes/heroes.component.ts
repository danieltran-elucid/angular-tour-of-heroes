import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';


// decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-heroes', //The component's CSS element selector. This matches the name of the HTML element that identifies this component within a parent component's template.
  templateUrl: './heroes.component.html', //The location of the component's template file.
  styleUrls: ['./heroes.component.css'] //The location of the component's private CSS styles.
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];

  // The constructor parameter simultaneously defines a private heroService property and identifies it as a HeroService injection site.
  // When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of HeroService
  // ***Reserve the constructor for minimal initialization such as wiring constructor parameters to properties. The constructor shouldn't do anything***
  constructor(private heroService: HeroService) {}
  // The ngOnInit() is a lifecycle hook. Angular calls ngOnInit() shortly after creating a component. It's a good place to put initialization logic.
  // call getHeroes() inside the ngOnInit lifecycle hook and let Angular call ngOnInit() at an appropriate time after constructing a HeroesComponent instance.
  ngOnInit(): void {
    this.getHeroes();
  }

  // method to retrieve the heroes from the service.
  // will return an Observable because it will eventually use the Angular HttpClient.get method to fetch the heroes and HttpClient.get() returns an Observable.
  getHeroes(): void {
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
        // waits for the Observable to emit the array of heroes —which could happen now or several minutes from now. The subscribe() method passes the emitted array to the callback, which sets the component's heroes property.
  }

  // When the given name is non-blank, the handler creates a Hero-like object from the name (it's only missing the id) and passes it to the services addHero() method.
  // When addHero() saves successfully, the subscribe() callback receives the new hero and pushes it into to the heroes list for display.
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  // Although the component delegates hero deletion to the HeroService, it remains responsible for updating its own list of heroes. The component's delete() method immediately removes the hero-to-delete from that list, anticipating that the HeroService will succeed on the server.
  // There's really nothing for the component to do with the Observable returned by heroService.deleteHero() but it must subscribe anyway.
  // ***If you neglect to subscribe(), the service will not send the delete request to the server. As a rule, an Observable does nothing until something subscribes***
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }


}
