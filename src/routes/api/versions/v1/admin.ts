interface AddItemRequest {
    name : string;
    description ?: string | null;
    price : number;
    quantity ?: number | null;
}
export const adminController = {
    // Define your admin controller functions here
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
    }
};