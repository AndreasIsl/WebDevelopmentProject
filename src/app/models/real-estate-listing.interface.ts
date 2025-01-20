export interface RealEstateListing {
    id?: number;
    title: string;
    price: number;
    propertyType: string;
    listingType: 'sale' | 'rent';
    location: {
        country: string;
        city: string;
        postalCode: string;
        street?: string;
    };
    specifications: {
        livingArea: number;
        landArea?: number;
        rooms?: number;
        condition?: string;
        buildingType?: string;
    };
    features: {
        hasBalcony?: boolean;
        hasGarden?: boolean;
        hasTerrace?: boolean;
        hasParking?: boolean;
        hasGarage?: boolean;
        hasElevator?: boolean;
        hasBasement?: boolean;
    };
    energyDetails?: {
        heatingType?: string;
        energyClass?: string;
        hwbValue?: number;
    };
    contact: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
    };
    images: string[];
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
} 