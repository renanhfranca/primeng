import { Code } from '@/domain/code';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
    selector: 'filter-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Filter value is checked against the property of an object configured with the <i>filterBy</i> property.</p>
        </app-docsectiontext>
        <div class="card">
            <p-picklist
                [source]="sourceProducts"
                [target]="targetProducts"
                [dragdrop]="true"
                [responsive]="true"
                filterBy="name"
                sourceFilterPlaceholder="Search by name"
                targetFilterPlaceholder="Search by name"
                breakpoint="1400px"
                scrollHeight="20rem"
            >
                <ng-template let-option let-selected="selected" #option>
                    <div class="flex flex-wrap p-1 items-center gap-4 w-full">
                        <img class="w-12 shrink-0 rounded" src="https://primefaces.org/cdn/primeng/images/demo/product/{{ option.image }}" [alt]="option.name" />
                        <div class="flex-1 flex flex-col">
                            <span class="font-medium text-sm">{{ option.name }}</span>
                            <span
                                [ngClass]="{
                                    'text-surface-500': !selected,
                                    'dark:text-surface-400': !selected,
                                    'text-inherit': selected
                                }"
                                >{{ option.category }}</span
                            >
                        </div>
                        <span class="font-bold sm:ml-8">{{ '$' + option.price }}</span>
                    </div>
                </ng-template>
            </p-picklist>
        </div>
        <app-code [code]="code" selector="picklist-filter-demo" [extFiles]="extFiles"></app-code>
    `
})
export class FilterDoc {
    sourceProducts!: Product[];

    targetProducts!: Product[];

    constructor(
        private carService: ProductService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.carService.getProductsSmall().then((products) => {
            this.sourceProducts = products;
            this.cdr.markForCheck();
        });
        this.targetProducts = [];
    }

    code: Code = {
        basic: `<p-picklist
    [source]="sourceProducts"
    [target]="targetProducts"
    [dragdrop]="true"
    [responsive]="true"
    filterBy="name"
    sourceFilterPlaceholder="Search by name"
    targetFilterPlaceholder="Search by name"
    breakpoint="1400px"
    scrollHeight="20rem"
>
    <ng-template let-option let-selected="selected" #option>
        <div class="flex flex-wrap p-1 items-center gap-4 w-full">
            <img
                class="w-12 shrink-0 rounded"
                src="https://primefaces.org/cdn/primeng/images/demo/product/{{ option.image }}"
                [alt]="option.name"
            />
            <div class="flex-1 flex flex-col">
                <span class="font-medium text-sm">{{ option.name }}</span>
                <span
                    [ngClass]="{
                        'text-surface-500': !selected,
                        'dark:text-surface-400': !selected,
                        'text-inherit': selected,
                    }"
                    >{{ option.category }}</span
                >
            </div>
            <span class="font-bold sm:ml-8">{{ '$' + option.price }}</span>
        </div>
    </ng-template>
</p-picklist>`,

        html: `<div class="card">
    <p-picklist
        [source]="sourceProducts"
        [target]="targetProducts"
        [dragdrop]="true"
        [responsive]="true"
        filterBy="name"
        sourceFilterPlaceholder="Search by name"
        targetFilterPlaceholder="Search by name"
        breakpoint="1400px"
        scrollHeight="20rem"
    >
        <ng-template let-option let-selected="selected" #option>
            <div class="flex flex-wrap p-1 items-center gap-4 w-full">
                <img
                    class="w-12 shrink-0 rounded"
                    src="https://primefaces.org/cdn/primeng/images/demo/product/{{ option.image }}"
                    [alt]="option.name"
                />
                <div class="flex-1 flex flex-col">
                    <span class="font-medium text-sm">{{ option.name }}</span>
                    <span
                        [ngClass]="{
                            'text-surface-500': !selected,
                            'dark:text-surface-400': !selected,
                            'text-inherit': selected,
                        }"
                        >{{ option.category }}</span
                    >
                </div>
                <span class="font-bold sm:ml-8">{{ '$' + option.price }}</span>
            </div>
        </ng-template>
    </p-picklist>
</div>`,

        typescript: `import { Component, ChangeDetectorRef } from '@angular/core';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'picklist-filter-demo',
    templateUrl: './picklist-filter-demo.html',
    standalone: true,
    imports: [PickListModule, CommonModule],
    providers: [ProductService]
})
export class PicklistFilterDemo {
    sourceProducts!: Product[];

    targetProducts!: Product[];

    constructor(
      private carService: ProductService,
      private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.carService.getProductsSmall().then(products => {
            this.sourceProducts = products;
            this.cdr.markForCheck();
        });
        this.targetProducts = [];
    }
}`,

        data: `
/* ProductService */
{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
},
...`,

        service: ['ProductService']
    };

    extFiles = [
        {
            path: 'src/domain/product.ts',
            content: `
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`
        }
    ];
}
