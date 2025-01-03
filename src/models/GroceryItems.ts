/************** Grocery Item Model ***************/

// Define types for the options object used in the AddItem method
interface addItemOptions {
    name: string;
    description?: string;
    quantity?: number | null;
    price: number;
}

const GroceryItems = (connection : any) => {
    const module : Record<string, any> = {}

    module.AddItem = (options: addItemOptions, callback :(err: boolean, result?: boolean) => void): void => {
        let quantityBlock : string = '';
        let descriptionBlock : string = '';
        if(options.quantity) {
            quantityBlock += `, quantity = ${options.quantity}`
        }
        if(options.description){
            descriptionBlock += `, description = "${options.description}"`
        }
        connection.query(`INSERT INTO grocery_items SET name = '${options.name}', price = ${options.price} ${quantityBlock} ${descriptionBlock};`, (err: any, result: any) => {
            if(err) {
                callback(true)
            } else {
                callback(false, true)
            }
        })
    }

    return module;
}

export default GroceryItems;