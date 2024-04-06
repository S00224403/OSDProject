export interface Order {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: 
        {
            addressLine: string;
            town: string;
            county: string;
            zip: string;
        }; 
    orderDate: Date;
    products: [
        {
            productId: string;
            quantity: number;
            price: number;
        }
    ];
}
