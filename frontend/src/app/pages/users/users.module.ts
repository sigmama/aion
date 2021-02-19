import { NgModule, OnInit } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';
import { UsersContainerComponent } from './containers/users-container.component';
import { UsersComponent } from './components/users.component';
import { UserModalComponent } from './components/modal/user-modal.component';

import { reducer } from './state/user.reducer';
import { UserEffects } from './state/user.effects';

@NgModule({
  declarations: [UsersContainerComponent, UsersComponent, UserModalComponent],
  imports: [
    ThemeModule,
    NbDialogModule.forChild(),
    StoreModule.forFeature('userState', reducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})
export class UsersModule implements OnInit {
  ngOnInit() {}
}
