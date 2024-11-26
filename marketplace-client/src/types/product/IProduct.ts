export interface ImageInterface {
    id: string;
}

export interface IProduct {
    id: string;
    title: string;
    price: number;
    description: string;
    likes: number;
    mainImageId: string;
    images: ImageInterface[];
};