import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { SysRoutingModule } from './sys-routing.module';
import { SysLogComponent } from './log/log.component';

const COMPONENTS: Type<any>[] =
    [
        SysLogComponent
    ];

@NgModule({
    imports: [SharedModule, SysRoutingModule],
    declarations: COMPONENTS,
})
export class SysModule { }