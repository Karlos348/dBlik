export default class Product {
    
    id: number;
    name: string;
    image: string;
    price: number;
    
    constructor(id: number, name: string, image: string, price: number) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
    }
}