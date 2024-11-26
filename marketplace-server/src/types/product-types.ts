interface Image {
    id: string;
}

export interface SendProduct {
    id: string;
    title: string;
    price: number;
    description: string;
    likes: number;
    mainImageId: string;
    images: Image[];
    authorId: string;
}

export interface SendProductAndTotal {
    products: SendProduct[],
    total: number
}