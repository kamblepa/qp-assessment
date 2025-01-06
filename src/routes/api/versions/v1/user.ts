import async from 'async';
interface LoginRequest {
    emailId: string;
    password: string;
}
interface User {
    // the structure of a user object based on your model's response
    id?: number;
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    role_id?: number;
    role_name?: string;
    // Add any other user properties
}

interface CartLineItem {
    itemId: number;
    name ?: string;
    price: number;
    quantity: number;
};
  
interface Cart {
    line: CartLineItem[];
    cartTotal: number;
};

interface AddToCartRequest {
    userId: number;
    itemId: number;
    quantity: number;
    price: number;
}

interface GetUserCartRequest {
    userId: number;
}

interface RemoveFromCartRequest {
    userId: number;
    itemId: number;
}

interface ProductData {
    name: string;
    description : string | null;
};

interface CompleteOrderRequest {
    userId: number;
}

export const userController = {

    // Login
    'login': function (model: any, request: LoginRequest, method: string, cb: (err: any, result: any) => void) {
        if (method === 'POST') {
            const { emailId, password } = request;

            model.Users.Login({ emailId, password }, (err: any, user: User | null) => {
                if (err) {
                    cb(true, { success: false, error: err });
                } else {
                    cb(false, { success: true, userPresent: user ? 1 : 0, userDetails: user });
                }
            });
        } else {
            cb(true, { success: false });
        }
    },

    // Get Item List
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
    },

    // Get User Cart
    'getUserCart' : function(model: any, request: GetUserCartRequest, method: string, cb: (err: any, result: any) => void) {
        if (method === 'POST') {        
            const { userId } = request;    
            model.Cart.GetUserCart({ userId }, async (err: any, userCart: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    try {
                        // Parse the user's cart or initialize a new cart object
                        let cart: Cart = userCart && userCart.cart ? JSON.parse(userCart.cart) : { line: [], cartTotal: 0 };
                        if (cart && cart.line) {
                            // Using Promise.all to handle async operations
                            const updatedLine = await Promise.all(cart.line.map(async (lineItem: CartLineItem) => {
                                try {
                                    const productData = await new Promise<ProductData>((resolve, reject) => {
                                        model.Cart.getProductName({ itemId: lineItem.itemId }, (err: any, productData: ProductData) => {
                                            if (err) reject(err);
                                            else resolve(productData);
                                        });
                                    });
    
                                    if (productData) {
                                        lineItem.name = productData.name;
                                    }
                                } catch (error) {
                                    console.error("Error fetching product data:", error);
                                }
                                return lineItem;
                            }));
                            cart.line = updatedLine;
                        }
    
                        cb(false, { success: true, cart });
                    } catch (error) {
                        cb(true, { success: false });
                    }
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Add item to cart or update item in Cart
    'addToCart' : function(model: any, request: AddToCartRequest, method: string, cb: (err: any, result: any) => void) {
        if (method === 'POST') {     
            const { userId, itemId, quantity, price } = request;
            
            // Retrieve the user's existing cart from the database
            model.Cart.GetUserCart({ userId }, (err: any, userCart: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    // Parse the user's cart or initialize a new cart object
                    let cart: Cart = userCart && userCart.cart ? JSON.parse(userCart.cart) : { line: [], cartTotal: 0 };
                    let line = cart.line || [];

                    // Find the index of the item in the cart, if it exists 
                    const lineIdx = line.findIndex((item: CartLineItem) => item.itemId === itemId);
                    if (lineIdx !== -1) {
                        // Update the existing item in the cart
                        line[lineIdx] = {
                            itemId: itemId,
                            price: price,
                            quantity: quantity
                        }
                    } else {
                        // Add a new item to the cart
                        line.push({
                            itemId: itemId,
                            price: price,
                            quantity: quantity
                        })
                    }

                    // Calculate the total cost of all items in the cart
                    let cartTotal = 0
                    line.forEach((l) => {
                        cartTotal += (l.price * l.quantity)
                    })

                    // Update the cart object with the updated line items and total
                    cart = {
                        line,
                        cartTotal
                    }
                    model.Cart.AddToCart({ userId, cart: JSON.stringify(cart) }, (err: any, result: any) => {
                        if(err) {
                            cb(true, { success : false, error: err})
                        } else {
                            cb(false, { success : true, data: result})
                        }
                    })
                }
            })
        } else {
            cb(true, { success: false })
        }
    },
    
    // Remove item from cart
    'removeFromCart' : function(model: any, request: RemoveFromCartRequest, method: string, cb: (err: any, result: any) => void) {
        if (method === 'POST') {     
            const { userId, itemId } = request;
            model.Cart.GetUserCart({ userId }, (err: any, userCart: any) => {
                if(err) {
                    cb(true, { success : false, error: err})
                } else {
                    // Parse the user's cart or initialize a new cart object
                    let cart: Cart = userCart && userCart.cart ? JSON.parse(userCart.cart) : { line: [], cartTotal: 0 };
                    let line = cart.line || [];

                    // Remove the item from the Line Array
                    const updatedLine = line.filter((item: CartLineItem) => item.itemId !== itemId);

                    // Recalculate the total cost of all items in the cart
                    let cartTotal = 0
                    updatedLine.forEach((l) => {
                        cartTotal += (l.price * l.quantity)
                    })

                    // Update the cart object with the updated line items and total
                    cart = {
                        line : updatedLine,
                        cartTotal
                    }
                    model.Cart.AddToCart({ userId, cart: JSON.stringify(cart) }, (err: any, result: any) => {
                        if(err) {
                            cb(true, { success : false, error: err})
                        } else {
                            cb(false, { success : true, data: result})
                        }
                    })
                }
            })
        } else {
            cb(true, { success: false })
        }
    },

    // Complete order from user and clear cart
    'completeOrder' : function(model: any, request: CompleteOrderRequest, method: string, cb: (err: any, result: any) => void) {
        if (method === 'POST') {     
            const { userId } = request;
            model.Cart.CompleteOrder({ userId }, (err: any, result: any) => {
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
};
