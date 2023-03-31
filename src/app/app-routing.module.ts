import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'sleep-log',
    loadChildren: () => import('./pages/sleep-log/sleep-log.module').then(m => m.SleepLogPageModule)
  },
  {
    path: 'sleepiness-log',
    loadChildren: () => import('./pages/sleepiness-log/sleepiness-log.module').then(m => m.SleepinessLogPageModule)
  },
  {
    path: 'view-data',
    loadChildren: () => import('./pages/view-data/view-data.module').then(m => m.ViewDataPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
