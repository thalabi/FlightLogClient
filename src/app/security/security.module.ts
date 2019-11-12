import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DropdownModule, ProgressSpinnerModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordMaskPipe } from '../util/password-mask-pipe';
import { CopyUserComponent } from './copy-user/copy-user.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, ButtonModule, DropdownModule, ProgressSpinnerModule
  ],
  providers: [
    AuthGuard
  ],
  declarations: [
    LoginComponent,
    //PasswordMaskPipe,
    ChangePasswordComponent,
    CopyUserComponent
  ],
  exports: [
    //ChangePasswordComponent
  ]
})
export class SecurityModule { }
