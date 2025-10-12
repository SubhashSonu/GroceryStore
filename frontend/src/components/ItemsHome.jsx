import React, { useEffect, useState } from "react";
import { itemsHomeStyles } from "../assets/dummyStyles";
import BannerHome from "./BannerHome";
import { useNavigate } from "react-router-dom";
import { FaThList } from "react-icons/fa";
import { useCart } from "../CartContext";
import { categories, products } from "../assets/dummyData";

const ItemsHome = () => {
  const [activeCategory, setActiveCategory] = useState(() => {
    return localStorage.getItem("activeCategory" || "All");
  });

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);

  const navigate = useNavigate();
  const { cart,addToCart,updateQuantity, removeFromCart} = useCart();

  const [searchTerm, setSearchTerm] = useState("");

  // search Features
  const productMatchesSearch = (product,term)=>{
             if(!term) return true
             const cleanTerm = term.trim().toLowerCase()

             const searchWords = cleanTerm.split(/\s+/);

             return searchWords.every(word =>
              product.name.toLowerCase().includes(word)
             )
  }

  // search across all products
  const searchProducts = searchTerm
          ? products.filter(product =>
            productMatchesSearch(product,searchTerm))
            : (activeCategory ==="All"
              ? products : products.filter((product) => product.category === activeCategory)
            )

  const getQuantity = (productId) =>{
    const item = cart.find((ci) => ci.id === productId);
    return item ? item.quantity : 0
  }

  const handleIncrease = (product) => addToCart(product,1);
  const handleDecrease = (product) => {
    const qty = getQuantity(product.id);
    if(qty>1) updateQuantity(product.id,qty-1)
    else removeFromCart(product.id);
  }

  // Redirect to items
  const redirectToItemsPage = ()=>{
    navigate('/items',{state:{category:activeCategory}})
  }
          

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Create sidebar category
  const sidebarCategories = [
    {
      name: "All Items",
      icon: <FaThList className="text-lg" />,
      value: "All",
    },
    ...categories,
  ];

  return (
    <div className={itemsHomeStyles.page}>
      <BannerHome onSearch={handleSearch} />

      <div className="flex flex-col lg:flex-row flex-1">
        <aside className={itemsHomeStyles.sidebar}>
          <div className={itemsHomeStyles.sidebarHeader}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
              }}
              className={itemsHomeStyles.sidebarTitle}
            >
              FreshCart
            </h1>
            <div className={itemsHomeStyles.sidebarDivider}></div>
          </div>

          <div className={itemsHomeStyles.categoryList}>
            <ul className="space-y-3">
              {sidebarCategories.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => {
                      setActiveCategory(category.value || category.name);
                      setSearchTerm("");
                    }}
                    className={`${itemsHomeStyles.categoryItem}
                        ${
                          activeCategory ===
                            (category.value || category.name) && !searchTerm
                            ? itemsHomeStyles.activeCategory
                            : itemsHomeStyles.inactiveCategory
                        }`}
                  >
                    <div className={itemsHomeStyles.categoryIcon}>
                      {category.icon}
                    </div>
                    <span className={itemsHomeStyles.categoryName}>
                      {category.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className={itemsHomeStyles.mainContent}>
          {/* Main Category Scroll */}
          <div className={itemsHomeStyles.mobileCategories}>
            <div className="flex space-x-4">
              {sidebarCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.value || cat.name);
                    setSearchTerm("");
                  }}
                  className={`${itemsHomeStyles.mobileCategoryItem}
                        ${
                          activeCategory === (cat.value || cat.name) &&
                          !searchTerm
                            ? itemsHomeStyles.activeMobileCategory
                            : itemsHomeStyles.inactiveMobileCategory
                        }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
           {/* search result */}

           {searchTerm && (
            <div className={itemsHomeStyles.searchResults}>
                <div className="flex items-center justify-center">
                    <span className="text-emerald-700 font-medium">
                        Search results for: <span className="font-bold">"{searchTerm}"</span>

                    </span>
                    <button onClick={() => setSearchTerm('')}
                        className="ml-4 text-emerald-500 hover:text-shadow-emerald-700 p-1 rounded-full translation-colors">
                            <span className="text-sm bg-emerald-100 px-2 py-1 rounded-full">
                                Clear
                            </span>

                    </button>

                </div>

            </div>
           )}
           <div className="text-center mb-6">
            <h2 className={itemsHomeStyles.sectionTitle}
            style={{
              fontFamily: "'Playfair Display', serif"
            }}>
              {searchTerm ? "Search Results" :
              (activeCategory ==="All" ? 'Featured Products' : `Best ${activeCategory}`)}

            </h2>
            <div className={itemsHomeStyles.sectionDivider}/>

           </div>

           {/* Product Grid */}
           <div className={itemsHomeStyles.productsGrid}>
             {searchProducts.length > 0 ? (
              searchProducts.map((product) =>{
                 const qty = getQuantity(product.id)
                 return(
                  <div key={product.id}
                  className={itemsHomeStyles.productCard}>
                    <div className={itemsHomeStyles.imageContainer}>
                      <img src={product.image} alt={product.name}
                      className={itemsHomeStyles.productImage}
                      onError={(e) =>{
                        e.target.onerror=null;
                        e.target.parentNode.innerHtml = `
                        <div class='flex items-center justify-center w-full h-full bg-gray-200'>
                        <span class='text-gray-500 text-sm'>No Image</span>
                        </div>`
                      }}
                      />

                    </div>


                    <div className={itemsHomeStyles.productContent}>
                      <h3 className={itemsHomeStyles.productTitle}>
                        {product.name}
                      </h3>
                      <div className={itemsHomeStyles.priceContainer}>

                      </div>

                    </div>
                    

                  </div>

                 )
              })
             ) :{}}
           </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsHome;
