import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MinesComponent} from './mines/mines.component';

const routes: Routes = [
    {path: '', component: MinesComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
