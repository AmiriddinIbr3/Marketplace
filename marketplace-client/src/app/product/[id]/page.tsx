"use client";
import ProductService from "@/services/RestAPI/requests/productService";
import BtnsShare from "@/components/BtnsShare/BtnsShare";
import { IProduct } from "@/types/product/IProduct";
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

export default function Product({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isUploaded, setUploaded] = useState<boolean>(false);

  const fetchProduct = useCallback(() => {
    ProductService.getProduct(params.id)
      .then(response => {
        setProduct(response.data);
        setUploaded(true);
      })
      .catch((error) => {
        console.error("Failed to fetch product", error);
        setUploaded(true);
      });
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (!isUploaded) {
    return <div>Loading...</div>;
  }

  if (product) {
    return (
      <>
        <Head>
          <meta name="description" content={product.description} />
          <meta property="og:title" content={product.title} />
          <meta property="og:description" content={product.description} />
          {/* <meta property="og:image" content={product.imageUrl} /> */}
        </Head>

        <h2>{product.title}</h2>
        <p>{product.price}</p>
        <p>{product.description}</p>
        <p>{product.likes}</p>

        <BtnsShare />
      </>
    );
  }

  return <div>Product not found</div>;
}