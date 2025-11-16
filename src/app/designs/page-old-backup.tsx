// "use client";

// import React, { useState, useEffect } from "react";
// import { useGetDesignsQuery, useGetCategoriesQuery } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { LikeButton } from "@/components/LikeButton";
// import Link from "next/link";
// import Image from "next/image";
// import { Design } from "@/lib/allTypes";
// import { useSearchParams } from "next/navigation";
// import { Search, Filter, X, Heart, Download, Eye, Grid3x3, LayoutGrid, ChevronDown, Star } from "lucide-react";

// type ViewMode = "grid" | "compact";

// export default function DesignsPage() {
//   const searchParams = useSearchParams();

//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
//   const [selectedComplexities, setSelectedComplexities] = useState<string[]>(() => {
//     const param = searchParams.get("complexityLevel");
//     return param ? param.split(",") : [];
//   });
//   const [minPrice, setMinPrice] = useState<number>(Number(searchParams.get("minPrice")) || 0);
//   const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get("maxPrice")) || 1000);
//   const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
//   const [showFilters, setShowFilters] = useState(false);

//   const itemsPerPage = viewMode === "compact" ? 24 : 12;
//   const { data: categoriesData } = useGetCategoriesQuery();

//   const rawCategories = categoriesData?.data || [];
//   const categories = (rawCategories as any[]).map((c: any) => ({
//     id: c.id ?? c._id,
//     name: c.name,
//     subcategories: (c.subcategories || []).map((sc: any) => ({
//       id: sc.id ?? sc._id,
//       name: sc.name,
//     })),
//   }));

//   const mainCategory = selectedCategory || undefined;
//   const subCategory = selectedSubcategory || undefined;
//   const queryParams = {
//     page: currentPage,
//     limit: itemsPerPage,
//     ...(searchQuery && { search: searchQuery }),
//     ...(mainCategory && { mainCategory }),
//     ...(subCategory && { subCategory }),
//     ...(selectedComplexities.length > 0 && {
//       complexityLevel: selectedComplexities.join(","),
//     }),
//     ...(minPrice > 0 && { minPrice }),
//     ...(maxPrice < 1000 && { maxPrice }),
//     status: "Active",
//   };

//   const { data: designsResponse, isLoading: designsLoading } = useGetDesignsQuery(queryParams);
//   const designs: Design[] = designsResponse?.data || [];
//   const pagination = designsResponse?.pagination || {};

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (searchQuery) params.set("search", searchQuery);
//     if (mainCategory) params.set("mainCategory", mainCategory);
//     if (subCategory) params.set("subCategory", subCategory);
//     if (selectedComplexities.length > 0) params.set("complexityLevel", selectedComplexities.join(","));
//     if (minPrice > 0) params.set("minPrice", minPrice.toString());
//     if (maxPrice < 1000) params.set("maxPrice", maxPrice.toString());
//     if (currentPage > 1) params.set("page", currentPage.toString());

//     const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
//     window.history.replaceState({}, "", newUrl);
//   }, [searchQuery, mainCategory, subCategory, selectedComplexities, minPrice, maxPrice, currentPage]);

//   const clearAllFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("");
//     setSelectedSubcategory("");
//     setSelectedComplexities([]);
//     setMinPrice(0);
//     setMaxPrice(1000);
//     setCurrentPage(1);
//   };

//   const activeFiltersCount = [
//     searchQuery !== "",
//     !!selectedCategory,
//     !!selectedSubcategory,
//     selectedComplexities.length > 0,
//     minPrice > 0,
//     maxPrice < 1000,
//   ].filter(Boolean).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       {/* Header with Search */}
//       <div className="bg-white border-b border-gray-200   shadow-sm">
//         <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
//           {/* Title and Breadcrumb */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
//             <div>
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
//                 Design Marketplace
//               </h1>
//               <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
//                 <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</Link>
//                 <span className="text-gray-300">/</span>
//                 <span className="text-gray-900 font-medium">Designs</span>
//                 <span className="text-gray-300">•</span>
//                 <span className="text-gray-600">{pagination.totalItems || 0} designs</span>
//               </div>
//             </div>

//             {/* View Toggle */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded-lg transition-all ${
//                   viewMode === "grid"
//                     ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//                 title="Grid view"
//               >
//                 <LayoutGrid className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode("compact")}
//                 className={`p-2 rounded-lg transition-all ${
//                   viewMode === "compact"
//                     ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//                 title="Compact view"
//               >
//                 <Grid3x3 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all lg:hidden"
//               >
//                 <Filter className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search designs..."
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//               className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all text-sm"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Top Filter Bar */}
//           <div className={`flex flex-wrap items-center gap-2 mt-3 ${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden lg:flex'}`}>
//             {/* Categories Dropdown */}
//             <div className="relative group">
//               <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-red-500 transition-all flex items-center gap-1.5">
//                 <span>{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Category"}</span>
//                 <ChevronDown className="w-3.5 h-3.5" />
//               </button>
//               <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-80 overflow-y-auto">
//                 <div className="p-1">
//                   <button
//                     onClick={() => { setSelectedCategory(""); setSelectedSubcategory(""); setCurrentPage(1); }}
//                     className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
//                   >
//                     All Categories
//                   </button>
//                   {categories.map((cat) => (
//                     <div key={cat.id}>
//                       <button
//                         onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory(""); setCurrentPage(1); }}
//                         className={`w-full text-left px-3 py-2 text-sm font-medium rounded transition-colors ${
//                           selectedCategory === cat.id ? "bg-red-50 text-red-600" : "text-gray-900 hover:bg-gray-50"
//                         }`}
//                       >
//                         {cat.name}
//                       </button>
//                       {cat.subcategories.length > 0 && (
//                         <div className="ml-3 space-y-0.5">
//                           {cat.subcategories.map((sub: any) => (
//                             <button
//                               key={sub.id}
//                               onClick={() => {
//                                 setSelectedCategory(cat.id);
//                                 setSelectedSubcategory(sub.id);
//                                 setCurrentPage(1);
//                               }}
//                               className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
//                                 selectedSubcategory === sub.id ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
//                               }`}
//                             >
//                               {sub.name}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Complexity Pills */}
//             {["Basic", "Intermediate", "Advanced"].map((level) => (
//               <button
//                 key={level}
//                 onClick={() => {
//                   setSelectedComplexities((prev) =>
//                     prev.includes(level) ? prev.filter((c) => c !== level) : [...prev, level]
//                   );
//                   setCurrentPage(1);
//                 }}
//                 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                   selectedComplexities.includes(level)
//                     ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
//                     : "bg-white border border-gray-200 text-gray-700 hover:border-green-500"
//                 }`}
//               >
//                 {level}
//               </button>
//             ))}

//             {/* Price Range */}
//             <div className="relative group">
//               <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-amber-500 transition-all flex items-center gap-1.5">
//                 <span>
//                   {minPrice > 0 || maxPrice < 1000
//                     ? `$${minPrice} - $${maxPrice}`
//                     : "Price"}
//                 </span>
//                 <ChevronDown className="w-3.5 h-3.5" />
//               </button>
//               <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-4">
//                 <label className="block text-xs font-semibold text-gray-700 mb-2">Min Price</label>
//                 <input
//                   type="number"
//                   value={minPrice}
//                   onChange={(e) => { setMinPrice(Number(e.target.value)); setCurrentPage(1); }}
//                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 focus:outline-none text-sm mb-3"
//                   placeholder="Min"
//                 />
//                 <label className="block text-xs font-semibold text-gray-700 mb-2">Max Price</label>
//                 <input
//                   type="number"
//                   value={maxPrice}
//                   onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
//                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 focus:outline-none text-sm"
//                   placeholder="Max"
//                 />
//               </div>
//             </div>

//             {/* Clear Filters */}
//             {activeFiltersCount > 0 && (
//               <button
//                 onClick={clearAllFilters}
//                 className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-1.5"
//               >
//                 <X className="w-3.5 h-3.5" />
//                 Clear ({activeFiltersCount})
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//         {designsLoading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
//               <div className="w-16 h-16 border-4 border-red-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
//             </div>
//             <p className="mt-4 text-lg text-gray-600 font-semibold">Loading designs...</p>
//           </div>
//         ) : designs.length > 0 ? (
//           <>
//             {/* Grid View */}
//             {viewMode === "grid" && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 sm:gap-5">
//                 {designs.map((design) => {
//                   const preview = (design as any)?.previewImageUrls?.[0] || (design as any)?.previewImageUrl || "";
//                   const categoryObj = (design as any)?.mainCategory || (design as any)?.category || (design as any)?.subCategory || null;
//                   const designerName = (design as any)?.designer?.name || (design as any)?.designerName;

//                   return (
//                     <Link key={design._id!} href={`/designs/${design._id!}`} className="group">
//                       <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl">
//                         {/* Image */}
//                         <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
//                           {preview && (
//                             <Image
//                               src={preview}
//                               alt={design.title}
//                               fill
//                               className="object-cover group-hover:scale-105 transition-transform duration-500"
//                               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 20vw"
//                             />
//                           )}
//                           {/* Overlay */}
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
//                           {/* Badges */}
//                           <div className="absolute top-2 left-2 flex gap-1.5">
//                             {design.discountedPrice === 0 && (
//                               <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">FREE</span>
//                             )}
//                             {categoryObj && (
//                               <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded">{categoryObj.name}</span>
//                             )}
//                           </div>

//                           {/* Like Button */}
//                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <LikeButton designId={design._id!} />
//                           </div>

//                           {/* Stats */}
//                           <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
//                             <span className="flex items-center gap-1">
//                               <Heart className="w-3.5 h-3.5" />
//                               {(design as any).likesCount || 0}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Download className="w-3.5 h-3.5" />
//                               {(design as any).downloadCount || 0}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="p-3">
//                           <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5 group-hover:text-red-600 transition-colors">
//                             {design.title}
//                           </h3>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               {design.discountedPrice === 0 ? (
//                                 <span className="text-lg font-bold text-green-600">FREE</span>
//                               ) : (
//                                 <>
//                                   <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
//                                     {design.currencyDisplay}{design.discountedPrice?.toFixed(2)}
//                                   </span>
//                                   {design.basePrice > design.discountedPrice && (
//                                     <span className="text-xs text-gray-400 line-through">
//                                       {design.currencyDisplay}{design.basePrice.toFixed(2)}
//                                     </span>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                             {(design as any).rating > 0 && (
//                               <div className="flex items-center gap-0.5 text-xs">
//                                 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
//                                 <span className="font-medium text-gray-700">{(design as any).rating.toFixed(1)}</span>
//                               </div>
//                             )}
//                           </div>
//                           {designerName && (
//                             <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">by {designerName}</p>
//                           )}
//                         </div>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Compact View */}
//             {viewMode === "compact" && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3">
//                 {designs.map((design) => {
//                   const preview = (design as any)?.previewImageUrls?.[0] || (design as any)?.previewImageUrl || "";

//                   return (
//                     <Link key={design._id!} href={`/designs/${design._id!}`} className="group">
//                       <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
//                         <div className="relative aspect-square bg-gray-100 overflow-hidden">
//                           {preview && (
//                             <Image
//                               src={preview}
//                               alt={design.title}
//                               fill
//                               className="object-cover group-hover:scale-110 transition-transform duration-500"
//                               sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
//                             />
//                           )}
//                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                          
//                           {design.discountedPrice === 0 && (
//                             <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">FREE</span>
//                           )}

//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Eye className="w-6 h-6 text-white drop-shadow-lg" />
//                           </div>
//                         </div>
//                         <div className="p-2">
//                           <h3 className="font-medium text-gray-900 text-xs line-clamp-1 mb-1 group-hover:text-red-600 transition-colors">
//                             {design.title}
//                           </h3>
//                           {design.discountedPrice === 0 ? (
//                             <span className="text-xs font-bold text-green-600">FREE</span>
//                           ) : (
//                             <span className="text-sm font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
//                               {design.currencyDisplay}{design.discountedPrice?.toFixed(2)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Pagination */}
//             {pagination.totalPages > 1 && (
//               <div className="mt-8 flex justify-center">
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <button
//                     onClick={() => setCurrentPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
//                       currentPage === 1
//                         ? "text-gray-300 cursor-not-allowed"
//                         : "text-gray-700 hover:bg-red-50 hover:text-red-600"
//                     }`}
//                   >
//                     Prev
//                   </button>

//                   {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
//                     let pageNum;
//                     if (pagination.totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else {
//                       if (currentPage <= 3) pageNum = i + 1;
//                       else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
//                       else pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={i}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
//                           currentPage === pageNum
//                             ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}

//                   <button
//                     onClick={() => setCurrentPage(currentPage + 1)}
//                     disabled={currentPage === pagination.totalPages}
//                     className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
//                       currentPage === pagination.totalPages
//                         ? "text-gray-300 cursor-not-allowed"
//                         : "text-gray-700 hover:bg-red-50 hover:text-red-600"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-20">
//             <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
//               <Search className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">No Designs Found</h3>
//             <p className="text-gray-600 mb-6">
//               {searchQuery || activeFiltersCount > 0
//                 ? "Try adjusting your filters or search terms"
//                 : "No designs are currently available"}
//             </p>
//             {activeFiltersCount > 0 && (
//               <Button onClick={clearAllFilters} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-semibold">
//                 Clear All Filters
//               </Button>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
