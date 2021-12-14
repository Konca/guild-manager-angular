import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MouseOverAnimation } from './header/mouse-over-animation.directive';
import { HomeComponent } from './home/home/home.component';
import { RaidBuilderComponent } from './raidBuilder/raid-builder/raid-builder.component';
import { CraftingComponent } from './crafting/crafting/crafting.component';
import { GuildRosterComponent } from './guildRoster/guild-roster/guild-roster.component';
import { ContactComponent } from './contact/contact/contact.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { OpenRaidComponent } from './forms/open-raid/open-raid.component';
import { FormsModule } from '@angular/forms';
import { FormContainerComponent } from './forms/form-container/form-container.component';
import { StdButtonComponent } from './UI/std-button/std-button.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'raidBuilder', component: RaidBuilderComponent },
  { path: 'crafting', component: CraftingComponent },
  { path: 'guildRoster', component: GuildRosterComponent },
  { path: 'contact', component: ContactComponent },
];
const config = {
  //firebase config here
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MouseOverAnimation,
    HomeComponent,
    RaidBuilderComponent,
    CraftingComponent,
    GuildRosterComponent,
    ContactComponent,
    OpenRaidComponent,
    FormContainerComponent,
    StdButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
