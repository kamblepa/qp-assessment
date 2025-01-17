// types for the options object used in the Add Item function
interface AddItemRequest {
    name : string;
    description ?: string | null;
    price : number;
    quantity ?: number | null;
}

// types for the options object used in the Update Item function
interface UpdateItemRequest {
    id: number;
    name : string;
    description ?: string | null;
    price : number;
    quantity ?: number | null;
}

// types for the options object used in the Update Quantity function
interface UpdateQuantityRequest {
    id: number;
    quantity: number;
}

// types for the options object used in the Delete Item function
interface DeleteItemRequest {
    id: number;
}
export const adminController = {
    // Function to add item to Grocery shop list
    'addItem' : function(model: any, request: AddItemRequest, method: string, cb: (err: boolean, result: any) => void) {
        if (method === 'POST') {
            const {name, description, price, quantity} = request;
            
            model.GroceryItems.AddItem({name, description, price, quantity}, (err: any, result: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    cb(false, { success : true, data: result})
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Function to update item details in Grocery shop 
    'updateItem' : function(model: any, request: UpdateItemRequest, method: string, cb: (err: boolean, result: any) => void) {
        if (method === 'POST') {
            const {id, name, description, price, quantity} = request;
            
            model.GroceryItems.UpdateItem({id, name, description, price, quantity}, (err: any, result: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    cb(false, { success : true, data: result})
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Function to update quantity of item
    'updateQuantity' : function(model: any, request: UpdateQuantityRequest, method: string, cb: (err: boolean, result: any) => void) {
        if (method === 'POST') {
            const {id, quantity} = request;
            
            model.GroceryItems.UpdateQuantity({id, quantity}, (err: any, result: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    cb(false, { success : true, data: result})
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Function to detele item from Grocery shop list
    'deleteItem' : function(model: any, request: DeleteItemRequest, method: string, cb: (err: boolean, result: any) => void) {
        if (method === 'POST') {
            const {id} = request;
            
            model.GroceryItems.DeleteItem({id}, (err: any, result: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    cb(false, { success : true, data: result})
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Function to get all items list fro Grocery shop
    'getItemList' : function(model: any, request: any, method: string, cb: (err: any, result: any) => void) {
        if (method === 'GET') {            
            model.GroceryItems.GetItemList((err: any, result: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    cb(false, { success : true, data: result})
                }
            })
        } else {
            cb(true, { success: false })
        }
    }
};