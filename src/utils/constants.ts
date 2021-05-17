export const enum ErrorTypes {
  invalidProductDataError = "invalidProductDataError",
  invalidAccessoryDataError = "invalidAccessoryDataError",
  invalidCategoryDataError = "invalidCategoryDataError",
  invalidSubcategoryDataError = "invalidSubcategoryDataError",
  invalidNewsPostDataError = "invalidNewsPostDataError",
  productNotFoundError = "productNotFoundError",
  accessoriesNotFoundError = "accessoriesNotFoundError",
  categoriesNotFoundError = "categoriesNotFoundError",
  subcategoriesNotFoundError = "subcategoriesNotFoundError",
  newsPostNotFoundError = "newsPostNotFoundError",
}

export const enum ErrorMessages {
  invalidProductDataError = "Cannot create product with this data.",
  invalidAccessoryDataError = "Cannot create accessory with this data.",
  invalidCategoryDataError = "Cannot create category with this data.",
  invalidSubcategoryDataError = "Cannot create subcategory with this data.",
  invalidNewsPostDataError = "Cannot create news post with this data.",
  productNotFoundError = "Product with this id was not found.",
  accessoryNotFoundError = "Accessory with this id was not found.",
  categoriesNotFoundError = "Cannot find categories.",
  subcategoriesNotFoundError = "Cannot find subcategories with this category id.",
  newsPostsNotFoundError = "Cannot find news posts.",
}
