import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'checkup',
    loadChildren: () => import('./pages/checkup/checkup.module').then( m => m.CheckupPageModule)
  },
  {
    path: 'note',
    loadChildren: () => import('./pages/note/note.module').then( m => m.NotePageModule)
  },
  {
    path: 'note-save',
    loadChildren: () => import('./pages/note-save/note-save.module').then( m => m.NoteSavePageModule)
  },
  {
    path: 'photo-step1',
    loadChildren: () => import('./pages/photo-step1/photo-step1.module').then( m => m.PhotoStep1PageModule)
  },
  {
    path: 'photo-step2',
    loadChildren: () => import('./pages/photo-step2/photo-step2.module').then( m => m.PhotoStep2PageModule)
  },
  {
    path: 'pendings',
    loadChildren: () => import('./pages/pendings/pendings.module').then( m => m.PendingsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
