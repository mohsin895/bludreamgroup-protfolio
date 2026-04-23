export interface ColorVariant {
    name: string
    code: string
    image: string
}

export interface SizeOption {
    label: string
    value: string
    available: boolean
}

export interface Product {
    id: number
    name: string
    slug: string
    price: number
    originalPrice: number | null
    image: string
    images: string[]
    category: string
    category_id: number
    isNew: boolean
    isSale: boolean
    description: string
    details: string[]
    dimensions?: string
    materials?: string
    sku: string
    colorVariants?: ColorVariant[]
    sizeOptions?: SizeOption[]
}

export const products: Product[] = []

export const categories = []

export function getProductById(id: number): Product | undefined {
    return products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
    if (category === "all") return products
    return products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
}