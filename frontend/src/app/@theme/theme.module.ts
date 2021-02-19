import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbAlertModule,
  NbCheckboxModule,
  NbInputModule,
  NbCardModule,
  NbBadgeModule,
  NbRadioModule,
  NbPopoverModule,
  NbTabsetModule,
  NbDatepickerModule,
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import {
  FooterComponent,
  HeaderComponent,
  // SearchInputComponent,
} from './components';

import { DataTableModule } from './modules/ng-data-table/DataTableModule';

import { DataFilterPipe } from './pipes';

import { MustMatchDirective } from './directives/must-match.directive';

import { OneColumnLayoutComponent, SampleLayoutComponent } from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { LIGHT_MIXED_THEME } from './styles/theme.light-mixed';
import { DARK_MIXED_THEME } from './styles/theme.dark-mixed';

const NB_MODULES = [
  NbActionsModule,
  NbLayoutModule,
  NbTabsetModule,
  NbDatepickerModule,
  NbMomentDateModule,
  NbMenuModule,
  NbUserModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbAlertModule,
  NbCheckboxModule,
  NbInputModule,
  NbRadioModule,
  NbPopoverModule,
  NbCardModule,
  NbBadgeModule,
  // NbListModule,
];
const SHARED_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  DataTableModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  // SearchInputComponent,
  OneColumnLayoutComponent,
  SampleLayoutComponent,
];
const PIPES = [DataFilterPipe];
const DIRECTIVES = [MustMatchDirective];

@NgModule({
  imports: [...SHARED_MODULES, ...NB_MODULES],
  exports: [
    ...SHARED_MODULES,
    ...NB_MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [
            DEFAULT_THEME,
            COSMIC_THEME,
            CORPORATE_THEME,
            LIGHT_MIXED_THEME,
            DARK_MIXED_THEME,
          ]
        ).providers,
      ],
    };
  }
}
