import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MouseOverAnimation } from './header/mouse-over-animation.directive';
import { HomeComponent } from './routes/home/home/home.component';
import { RaidBuilderComponent } from './routes/raidBuilder/raid-builder/raid-builder.component';
import { CraftingComponent } from './routes/crafting/crafting/crafting.component';
import { GuildRosterComponent } from './routes/guildRoster/guild-roster/guild-roster.component';
import { ContactComponent } from './routes/contact/contact/contact.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { OpenRaidComponent } from './forms/open-raid/open-raid.component';
import { FormsModule } from '@angular/forms';
import { FormContainerComponent } from './forms/form-container/form-container.component';
import { StdButtonComponent } from './UI/std-button/std-button.component';
import { RaidDescriptionComponent } from './routes/raidBuilder/raid-description/raid-description.component';
import { RaidListComponent } from './routes/raidBuilder/raid-list/raid-list.component';
import { PlayerListItemComponent } from './routes/raidBuilder/player-list-item/player-list-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RedirectComponent } from './discord/redirect/redirect.component';

import config from '../assets/apiKeys/firebaseKey.json';
import { SettingsComponent } from './routes/settings/settings.component';
import { OpenGuildComponent } from './forms/open-guild/open-guild.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'raidBuilder/:guildId/:raidId', component: RaidBuilderComponent },
  { path: 'crafting', component: CraftingComponent },
  { path: 'guildRoster', component: GuildRosterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'api/auth/discord/redirect', component: RedirectComponent },
];
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
    RaidDescriptionComponent,
    RaidListComponent,
    PlayerListItemComponent,
    SettingsComponent,
    OpenGuildComponent,
  ],
  imports: [
    DragDropModule,
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
