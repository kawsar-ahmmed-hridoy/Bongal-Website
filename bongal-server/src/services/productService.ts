import Product, { IProduct } from '../models/Product';

export class ProductService {
  async getAllProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = filters;

    let query: any = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name');

    const total = await Product.countDocuments(query);

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string) {
    const product = await Product.findById(id).populate('seller', 'name email phone');
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(productData: Partial<IProduct>) {
    const product = await Product.create(productData);
    return product;
  }

  async updateProduct(id: string, productData: Partial<IProduct>) {
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}
