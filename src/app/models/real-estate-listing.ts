export interface RealEstateListing {
    id?: number;
    title: string;
    propertyType: string;
    listingType: string;
    price: number;
    location: {
      country: string;
      city: string;
      postalCode: string;
      street?: string;
    };
    specifications: {
      livingArea: number;
      rooms: number;
    };
    features: {
      hasBalcony: boolean;
      hasGarden: boolean;
      heating?: string[];
      floors?: string[];
    };
    contact: {
      name: string;
      email: string;
      phone: string;
    };
    images: string[];
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
  }