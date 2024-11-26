import { axiosWithAuth } from "@/services/RestAPI";
import { IProduct } from "@/types/product/IProduct";
import { AxiosResponse } from "axios";

export default class ProductService {
  static getProduct(productId: string): Promise<AxiosResponse<IProduct>> {
    return new Promise((resolve, reject) => {
      axiosWithAuth.get(`product/${productId}`, {
        params: {
          id: productId,
        }
      })
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  static getProducts(page = 1, limit = 10): Promise<AxiosResponse<{
    products: IProduct[],
    total: number
  }>> {
    return new Promise((resolve, reject) => {
      axiosWithAuth.get('product', {
        params: {
          page,
          limit
        }
      })
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  static likeProduct(productId: string): Promise<AxiosResponse<void>> {
    return new Promise((resolve, reject) => {
      axiosWithAuth.post(`product/like/${productId}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  static getLikesCount(productId: string): Promise<AxiosResponse<number>> {
    return new Promise((resolve, reject) => {
      axiosWithAuth.get(`product/getLikesCount/${productId}`)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
}