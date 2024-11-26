export interface IProduct {
    title: string;
    price: number;
    description?: string;
    images: FileList;
    mainImage?: File | null | undefined;
}