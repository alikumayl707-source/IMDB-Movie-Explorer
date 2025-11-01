import { inject, Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    toastService = inject(ToastrService);

    showSuccessToast = (message: string) => { this.toastService.success(message, 'Success') }
    showErrorToast = (message: string) => { this.toastService.error(message, 'Error') }
    showInfoToast = (message: string) => { this.toastService.info(message, 'Info') }


}