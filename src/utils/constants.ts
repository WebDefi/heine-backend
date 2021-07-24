export const enum ErrorTypes {
  invalidCreationDataError = "invalidCreationDataError",
  notFoundError = "notFoundError",
  invalidUpdateDataError = "invalidUpdateDataError",
  invalidDeleteDataError = "invalidDeleteDataError",
}

export const enum ErrorMessages {
  invalidCreationDataError = "Cannot create object with this data",
  notFoundError = "Cannot find object with this data",
  invalidUpdateDataError = "Cannot update object with this data",
  invalidDeleteDataError = "Cannot delete object with this data",
}

export const enum ObjectTypes {
  category = "Category",
  subcategory = "Subcategory",
  product = "Product",
  accessoryCategory = "Accessory_category",
  accessorySubcategory = "Accessory_subcategory",
  accessory = "Accessory",
  newsPost = "News post"
}