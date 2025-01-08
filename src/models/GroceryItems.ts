/************** Grocery Item Model ***************/

// types for the options object used in the AddItem method
interface addItemOptions {
    name: string;
    description?: string;
    quantity?: number | null;
    price: number;
}

// types for the options object used in the UpdateItem method
interface UpdateItemOptions {
    id: number;
    name : string;
    description ?: string | null;
    price : number;
    quantity ?: number | null;
}

// types for the options object used in the UpdateQuantity method
interface UpdateQuantityOptions {
    id: number;
    quantity : number;
}

// types for the options object used in the DeleteItem method
interface DeleteItemOptions {
    id: number;
}

const GroceryItems = (connection : any) => {
    const module : Record<string, any> = {}

    // Add items to Grocery Shop list
    module.AddItem = (options: addItemOptions, callback :(err: any, result?: any) => void): void => {
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
    },

    // Update item details in Grocery Shop list
    module.UpdateItem = (options: UpdateItemOptions, callback :(err: any, result?: any) => void): void => {
        let quantityBlock : string = '';
        let descriptionBlock : string = '';
        if(options.quantity) {
            quantityBlock += `, quantity = ${options.quantity}`
        }
        if(options.description){
            descriptionBlock += `, description = "${options.description}"`
        }
        connection.query(`UPDATE grocery_items SET name = '${options.name}', price = ${options.price} ${quantityBlock} ${descriptionBlock} WHERE id = ${options.id};`, (err: any, result: any) => {
            if(err) {
                callback(true)
            } else {
                callback(false, true)
            }
        })
    },

    // Update item quantity 
    module.UpdateQuantity = (options: UpdateQuantityOptions, callback :(err: any, result?: any) => void): void => {
        let quantityBlock : string = '';
        if(options.quantity < 0) {
            quantityBlock += `quantity = quantity - ${Math.abs(options.quantity)}`
        } else {
            quantityBlock += `quantity = quantity + ${Math.abs(options.quantity)}`
        }
        connection.query(`UPDATE grocery_items SET ${quantityBlock} WHERE id = ${options.id};`, (err: any, result: any) => {
            if(err) {
                callback(true)
            } else {
                callback(false, true)
            }
        })
    },

    // Delete item from Grocery Shop list
    module.DeleteItem = (options: DeleteItemOptions, callback :(err: any, result?: any) => void): void => {
        connection.query(`UPDATE grocery_items SET is_deleted = 1 WHERE id = ${options.id};`, (err: any, result: any) => {
            if(err) {
                callback(true)
            } else {
                callback(false, true)
            }
        })
    },

    // Get all items list from Grocery shop
    module.GetItemList = (callback :(err: any, result?: any) => void): void => {
        connection.query(`SELECT * FROM grocery_items WHERE is_deleted = 0;`, (err: any, result: any) => {
            if(err) {
                callback(true)
            } else {
                callback(false, result)
            }
        })
    }

    return module;
}

export default GroceryItems;