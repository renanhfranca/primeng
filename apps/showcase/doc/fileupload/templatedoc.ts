import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'file-upload-template-demo',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>
                Uploader UI is customizable using a ng-template called <i>file</i> that gets the <a href="https://www.w3.org/TR/FileAPI/">File</a> instance as the implicit variable. Second ng-template named <i>content</i> can be used to place custom
                content inside the content section which would be useful to implement a user interface to manage the uploaded files such as removing them. This template gets the selected files as the implicit variable. Third and final ng-template
                option is <i>toolbar</i> to display custom content at toolbar.
            </p></app-docsectiontext
        >
        <div class="card">
            <p-toast />
            <p-fileupload name="myfile[]" url="https://www.primefaces.org/cdn/api/upload.php" [multiple]="true" accept="image/*" maxFileSize="1000000" (onUpload)="onTemplatedUpload()" (onSelect)="onSelectedFiles($event)">
                <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                        <div class="flex gap-2">
                            <p-button (onClick)="choose($event, chooseCallback)" icon="pi pi-images" [rounded]="true" [outlined]="true" />
                            <p-button (onClick)="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" [rounded]="true" [outlined]="true" severity="success" [disabled]="!files || files.length === 0" />
                            <p-button (onClick)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" />
                        </div>
                        <p-progressbar [value]="totalSizePercent" [showValue]="false" class="w-full" class="md:w-20rem h-1 w-full md:ml-auto">
                            <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                        </p-progressbar>
                    </div>
                </ng-template>
                <ng-template #content let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback" let-removeUploadedFileCallback="removeUploadedFileCallback">
                    <div class="flex flex-col gap-8 pt-4">
                        <div *ngIf="files?.length > 0">
                            <h5>Pending</h5>
                            <div class="flex flex-wrap gap-4">
                                <div *ngFor="let file of files; let i = index" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                    <div>
                                        <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                    </div>
                                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <p-badge value="Pending" severity="warn" />
                                    <p-button icon="pi pi-times" (click)="onRemoveTemplatingFile($event, file, removeFileCallback, index)" [outlined]="true" [rounded]="true" severity="danger" />
                                </div>
                            </div>
                        </div>
                        <div *ngIf="uploadedFiles?.length > 0">
                            <h5>Completed</h5>
                            <div class="flex flex-wrap gap-4">
                                <div *ngFor="let file of uploadedFiles; let i = index" class="card m-0 px-12 flex flex-col border border-surface items-center gap-4">
                                    <div>
                                        <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                    </div>
                                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <p-badge value="Completed" class="mt-4" severity="success" />
                                    <p-button icon="pi pi-times" (onClick)="removeUploadedFileCallback(index)" [outlined]="true" [rounded]="true" severity="danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
                <ng-template #file></ng-template>
                <ng-template #empty>
                    <div class="flex items-center justify-center flex-col">
                        <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
                        <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                    </div>
                </ng-template>
            </p-fileupload>
        </div>
        <app-code [code]="code" selector="file-upload-template-demo"></app-code>
    `,
    providers: [MessageService]
})
export class TemplateDoc {
    files = [];

    totalSize: number = 0;

    totalSizePercent: number = 0;

    constructor(
        private config: PrimeNG,
        private messageService: MessageService
    ) {}

    choose(event, callback) {
        callback();
    }

    onRemoveTemplatingFile(event, file, removeFileCallback, index) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event) {
        this.files = event.currentFiles;
        this.files.forEach((file) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback) {
        callback();
    }

    formatSize(bytes) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    }

    code: Code = {
        basic: `<p-toast />
<p-fileupload name="myfile[]" url="https://www.primefaces.org/cdn/api/upload.php" [multiple]="true" accept="image/*" maxFileSize="1000000" (onUpload)="onTemplatedUpload()" (onSelect)="onSelectedFiles($event)">
    <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
            <div class="flex gap-2">
                <p-button (onClick)="choose($event, chooseCallback)" icon="pi pi-images" [rounded]="true" [outlined]="true" />
                <p-button (onClick)="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" [rounded]="true" [outlined]="true" severity="success" [disabled]="!files || files.length === 0" />
                <p-button (onClick)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" />
            </div>
            <p-progressbar [value]="totalSizePercent" [showValue]="false" class="w-full" class="md:w-20rem h-1 w-full md:ml-auto">
                <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
            </p-progressbar>
        </div>
    </ng-template>
    <ng-template #content let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback" let-removeUploadedFileCallback="removeUploadedFileCallback">
        <div class="flex flex-col gap-8 pt-4">
            <div *ngIf="files?.length > 0">
                <h5>Pending</h5>
                <div class="flex flex-wrap gap-4">
                    <div *ngFor="let file of files; let i = index" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                        <div>
                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                        </div>
                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                        <div>{{ formatSize(file.size) }}</div>
                        <p-badge value="Pending" severity="warn" />
                        <p-button icon="pi pi-times" (click)="onRemoveTemplatingFile($event, file, removeFileCallback, index)" [outlined]="true" [rounded]="true" severity="danger" />
                    </div>
                </div>
            </div>
            <div *ngIf="uploadedFiles?.length > 0">
                <h5>Completed</h5>
                <div class="flex flex-wrap gap-4">
                    <div *ngFor="let file of uploadedFiles; let i = index" class="card m-0 px-12 flex flex-col border border-surface items-center gap-4">
                        <div>
                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                        </div>
                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                        <div>{{ formatSize(file.size) }}</div>
                        <p-badge value="Completed" class="mt-4" severity="success" />
                        <p-button icon="pi pi-times" (onClick)="removeUploadedFileCallback(index)" [outlined]="true" [rounded]="true" severity="danger" />
                    </div>
                </div>
            </div>
        </div>
    </ng-template>
    <ng-template #file></ng-template>
    <ng-template #empty>
        <div class="flex items-center justify-center flex-col">
            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
            <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
        </div>
    </ng-template>
</p-fileupload>`,
        html: `<div class="card">
    <p-toast />
    <p-fileupload name="myfile[]" url="https://www.primefaces.org/cdn/api/upload.php" [multiple]="true" accept="image/*" maxFileSize="1000000" (onUpload)="onTemplatedUpload()" (onSelect)="onSelectedFiles($event)">
        <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                <div class="flex gap-2">
                    <p-button (onClick)="choose($event, chooseCallback)" icon="pi pi-images" [rounded]="true" [outlined]="true" />
                    <p-button (onClick)="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" [rounded]="true" [outlined]="true" severity="success" [disabled]="!files || files.length === 0" />
                    <p-button (onClick)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" />
                </div>
                <p-progressbar [value]="totalSizePercent" [showValue]="false" class="w-full" class="md:w-20rem h-1 w-full md:ml-auto">
                    <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                </p-progressbar>
            </div>
        </ng-template>
        <ng-template #content let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback" let-removeUploadedFileCallback="removeUploadedFileCallback">
            <div class="flex flex-col gap-8 pt-4">
                <div *ngIf="files?.length > 0">
                    <h5>Pending</h5>
                    <div class="flex flex-wrap gap-4">
                        <div *ngFor="let file of files; let i = index" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                            <div>
                                <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <p-badge value="Pending" severity="warn" />
                            <p-button icon="pi pi-times" (click)="onRemoveTemplatingFile($event, file, removeFileCallback, index)" [outlined]="true" [rounded]="true" severity="danger" />
                        </div>
                    </div>
                </div>
                <div *ngIf="uploadedFiles?.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap gap-4">
                        <div *ngFor="let file of uploadedFiles; let i = index" class="card m-0 px-12 flex flex-col border border-surface items-center gap-4">
                            <div>
                                <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <p-badge value="Completed" class="mt-4" severity="success" />
                            <p-button icon="pi pi-times" (onClick)="removeUploadedFileCallback(index)" [outlined]="true" [rounded]="true" severity="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </ng-template>
        <ng-template #file></ng-template>
        <ng-template #empty>
            <div class="flex items-center justify-center flex-col">
                <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
                <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
            </div>
        </ng-template>
    </p-fileupload>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { MessageService} from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'file-upload-template-demo',
    templateUrl: './file-upload-template-demo.html',
    standalone: true,
    imports: [FileUpload, ButtonModule, BadgeModule, ProgressBar, ToastModule, HttpClientModule, CommonModule],
    providers: [MessageService]
})
export class FileUploadTemplateDemo {
    files = [];

    totalSize : number = 0;

    totalSizePercent : number = 0;

    constructor(private config: PrimeNG, private messageService: MessageService) {}

    choose(event, callback) {
        callback();
    }

    onRemoveTemplatingFile(event, file, removeFileCallback, index) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event) {
        this.files = event.currentFiles;
        this.files.forEach((file) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback) {
        callback();
    }

    formatSize(bytes) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return \`0 \${sizes[0]}\`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return \`\${formattedSize} \${sizes[i]}\`;
    }
}`
    };
}
