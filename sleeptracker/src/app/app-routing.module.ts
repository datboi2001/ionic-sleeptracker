import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  {
    path: 'sleep-log',
    loadChildren: () => import('./sleep-log/sleep-log.module').then( m => m.SleepLogPageModule)
  },
  {
    path: 'sleepiness-log',
    loadChildren: () => import('./sleepiness-log/sleepiness-log.module').then( m => m.SleepinessLogPageModule)
  },
  {
    path: 'view-data',
    loadChildren: () => import('./view-data/view-data.module').then( m => m.ViewDataPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
