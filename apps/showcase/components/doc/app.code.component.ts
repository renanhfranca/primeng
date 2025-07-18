import { Code, ExtFile, RouteFile } from '@/domain/code';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Component, ElementRef, Inject, Input, NgModule, PLATFORM_ID, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { useCodeSandbox, useStackBlitz } from './codeeditor';

@Component({
    selector: 'app-code',
    standalone: true,
    imports: [CommonModule, ButtonModule, TooltipModule],
    template: `
        <div *ngIf="code" class="doc-section-code">
            <div class="doc-section-code-buttons animate-scalein animate-duration-300">
                <ng-container *ngIf="fullCodeVisible">
                    <button *ngIf="code.html" (click)="changeLang('html')" class="py-0 px-2 rounded-border h-8" [ngClass]="{ 'code-active': lang === 'html' }">
                        <span>HTML</span>
                    </button>
                    <button *ngIf="code.typescript" (click)="changeLang('typescript')" class="py-0 px-2 rounded-border h-8" [ngClass]="{ 'code-active': lang === 'typescript' }">
                        <span>TS</span>
                    </button>
                    <button *ngIf="code.scss" (click)="changeLang('scss')" class="py-0 px-2 rounded-border h-8" [ngClass]="{ 'code-active': lang === 'scss' }">
                        <span>SCSS</span>
                    </button>

                    <button
                        *ngIf="code.data"
                        pTooltip="View Data"
                        tooltipPosition="bottom"
                        tooltipStyleClass="doc-section-code-tooltip"
                        (click)="changeLang('data')"
                        class="h-8 w-8 p-0 inline-flex items-center justify-center"
                        [ngClass]="{ 'doc-section-code-active text-primary': lang === 'data' }"
                    >
                        <i class="pi pi-database"></i>
                    </button>
                </ng-container>
                <button *ngIf="!hideToggleCode" pTooltip="Toggle Full Code" tooltipStyleClass="doc-section-code-tooltip" tooltipPosition="bottom" class="h-8 w-8 p-0 inline-flex items-center justify-center" (click)="toggleCode()">
                    <i class="pi pi-code"></i>
                </button>

                <button
                    pTooltip="Edit in StackBlitz"
                    tooltipPosition="bottom"
                    tooltipStyleClass="doc-section-code-tooltip"
                    *ngIf="!hideStackBlitz && !hideToggleCode"
                    class="h-8 w-8 p-0 inline-flex items-center justify-center"
                    (click)="openStackBlitz()"
                >
                    <svg role="img" width="13" height="18" viewBox="0 0 13 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: 'block'">
                        <path d="M0 10.6533H5.43896L2.26866 18.1733L12.6667 7.463H7.1986L10.3399 0L0 10.6533Z" />
                    </svg>
                </button>

                <button type="button" class="h-8 w-8 p-0 inline-flex items-center justify-center" (click)="copyCode()" pTooltip="Copy Code" tooltipPosition="bottom" tooltipStyleClass="doc-section-code-tooltip">
                    <i class="pi pi-copy"></i>
                </button>
            </div>

            <div dir="ltr">
                <pre *ngIf="lang === 'basic' && importCode" class="language-javascript"><code #codeElement>
{{code.basic}}

</code></pre>

                <pre *ngIf="lang === 'basic' && !importCode" class="language-markup"><code #codeElement>
{{code.basic}}

</code></pre>

                <pre *ngIf="lang === 'html'" class="language-markup"><code #codeElement>
{{code.html}}

</code></pre>

                <pre *ngIf="lang === 'typescript'" class="language-typescript"><code #codeElement>
{{code.typescript}}

</code></pre>

                <pre *ngIf="lang === 'data'" class="language-json"><code #codeElement>
{{code.data}}

</code></pre>

                <pre *ngIf="lang === 'scss'" class="language-scss"><code #codeElement>
{{code.scss}}

</code></pre>

                <pre *ngIf="lang === 'command'" class="language-shell"><code #codeElement>
{{code.command}}

</code></pre>
            </div>
        </div>
    `
})
export class AppCodeComponent {
    @Input() code!: Code;

    @Input() service!: any;

    @Input() selector!: string;

    @Input() extFiles: ExtFile[] = [];

    @Input() routeFiles: RouteFile[] = [];

    @Input({ transform: booleanAttribute }) hideToggleCode: boolean = false;

    @Input({ transform: booleanAttribute }) hideCodeSandbox: boolean = true;

    @Input({ transform: booleanAttribute }) hideStackBlitz: boolean = false;

    @Input({ transform: booleanAttribute }) importCode: boolean = false;

    @ViewChild('codeElement') codeElement: ElementRef;

    fullCodeVisible: boolean = false;

    lang!: string;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        @Inject(DOCUMENT) public document: Document
    ) {}

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (window['Prism'] && this.codeElement && !this.codeElement.nativeElement.classList.contains('prism')) {
                window['Prism'].highlightElement(this.codeElement.nativeElement);
                this.codeElement.nativeElement.classList.add('prism');
                this.codeElement.nativeElement.parentElement.setAttribute('tabindex', '-1');
            }
        }
    }

    ngOnInit() {
        this.lang = this.getInitialLang();
    }

    changeLang(lang: string) {
        this.lang = lang;
    }

    getInitialLang(): string {
        if (this.code) {
            return Object.keys(this.code)[0];
        }
    }

    async copyCode() {
        await navigator.clipboard.writeText(this.code[this.lang]);
    }

    getCode(lang: string = 'basic') {
        if (this.code) {
            if (this.fullCodeVisible || this.hideToggleCode) {
                return this.code[lang];
            } else {
                return this.code['basic'];
            }
        }
    }

    toggleCode() {
        this.fullCodeVisible = !this.fullCodeVisible;
        this.fullCodeVisible && (this.code.html ? (this.lang = 'html') : (this.lang = 'typescript'));
        !this.fullCodeVisible && (this.lang = 'basic');
    }

    openStackBlitz() {
        if (this.code) {
            let str = this.code.typescript;

            const importModuleStatement = "import { ImportsModule } from './imports';";

            if (!str.includes(importModuleStatement)) {
                let modifiedCodeWithImportsModule = str.replace(/import\s+{[^{}]*}\s+from\s+'[^']+';[\r\n]*/g, (match) => {
                    if (match.includes('Module') && !match.includes('ReactiveFormsModule') && !match.includes('Ref')) {
                        return '';
                    }
                    return match;
                });

                modifiedCodeWithImportsModule = modifiedCodeWithImportsModule.replace(/\bimports:\s*\[[^\]]*\]/, 'imports: [ImportsModule]');

                const finalModifiedCode = modifiedCodeWithImportsModule.replace(/import\s+\{[^{}]*\}\s+from\s+'@angular\/core';/, (match) => match + '\n' + importModuleStatement);

                str = finalModifiedCode;
            }

            const stackBlitzObject = { ...this.code, typescript: str };

            useStackBlitz({ code: stackBlitzObject, selector: this.selector, extFiles: this.extFiles, routeFiles: this.routeFiles });
        }
    }

    openCodeSandbox() {
        if (this.code) {
            useCodeSandbox({ code: this.code, selector: this.selector, extFiles: this.extFiles, routeFiles: this.routeFiles });
        }
    }
}

@NgModule({
    imports: [AppCodeComponent],
    exports: [AppCodeComponent]
})
export class AppCodeModule {}
