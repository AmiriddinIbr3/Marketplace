"use client";
import { useEffect, useState, useCallback } from 'react';
import styles from './ListProduct.module.css';
import ProductService from '@/services/RestAPI/requests/productService';
import { IProduct } from "@/types/product/IProduct";
import CardProduct from '../CardProduct/CardProduct';
import Link from 'next/link';

export default function ListProduct() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number | undefined>();
    const limit: number = 10;

    const fetchProducts = useCallback(() => {
        ProductService.getProducts(page, limit)
            .then(response => {
                const { total, products } = response.data;
                setTotal(Math.ceil(total / limit));
                setProducts(products);
            });
    }, [page, limit]);

    const handlePageChange = (newPage: number) => {
        if (!total) return;
        if (newPage > 0 && newPage <= total) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return(
        <div className='h-full w-full flex flex-col justify-between'>
            <div className={styles.container}>
                {products.map(product => 
                    <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                    >
                        <CardProduct
                            id={product.id}
                            price={product.price}
                            description={product.description}
                            title={product.title}
                            likes={product.likes}
                            mainImageId={product.mainImageId}
                            imagesIds={product.images}
                        />
                    </Link>
                )}
            </div>
            {total !== undefined && total > 1 &&
                <div className={styles.pagination}>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {total}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === total}
                    >
                        Next
                    </button>
                </div>
            }
        </div>
    );
}