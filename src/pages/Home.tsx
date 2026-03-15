import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { categories, products } from '../data';

const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);

export function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative w-full bg-gray-50/50 py-24 sm:py-32">
        <div className="container-base flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 py-1 px-3 text-sm tracking-wider uppercase text-gray-500 border-gray-300">
            Welcome to Krylo
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 drop-shadow-sm">Krylo</h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Tech accessories for a cleaner desk setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg shadow-md hover:shadow-lg transition-all">
                Shop products
              </Button>
            </Link>
            <a href="#featured" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full text-lg">
                View featured
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="container-base">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <Link to="/products" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
            Browse all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.slug}`}>
              <Card className="h-full overflow-hidden hover:border-gray-400 hover:shadow-md transition-all group bg-gray-50 cursor-pointer">
                <div className="h-24 w-full bg-gray-200 overflow-hidden">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4 text-center">
                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 text-sm sm:text-base">{category.name}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="container-base">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
          <p className="text-gray-500">Hand-picked essentials for peak productivity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group drop-shadow-sm hover:drop-shadow-lg transition-all">
              <Card className="h-full flex flex-col overflow-hidden border-transparent bg-gray-50 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                <div className="aspect-square bg-gray-200 w-full relative overflow-hidden">
                  <img src={product.images[0] || ''} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  <Badge className="absolute top-3 left-3 bg-gray-900 text-white border-0 z-10">Featured</Badge>
                </div>

                <CardHeader className="flex-grow pb-2 p-5">
                  <div className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">
                    {product.brand} &middot; {product.category}
                  </div>
                  <CardTitle className="text-lg leading-tight text-gray-900 group-hover:underline decoration-gray-300 underline-offset-4">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 mt-auto flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-lg">${product.price.toFixed(2)}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
