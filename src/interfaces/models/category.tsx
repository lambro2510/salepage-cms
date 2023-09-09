import { CategoryType } from '../enum/CategoryType';

export interface Category {
    categoryId: string,
    categoryName: string,
    categoryType: CategoryType,
    description: string,
    timeType: CategoryType,
    timeValue: number,
    productType: string
  }

  
  
  
  
  
  