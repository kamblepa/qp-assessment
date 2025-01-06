/***** User Cart Model *****/

// types for the options object used in the get user cart method
interface GetUserCartOptions {
    userId: number;
}

// types for the options object used in the add to cart method
interface AddToCartOptions {
    userId: number;
    cart: string;
}

// types for the options object used in the get product name method
interface GetProductNameOptions {
    itemId: string;
}

interface CartLineItem {
    itemId: number;
    quantity: number;
    price: number;
}

//the Cart Module
const Cart = (connection: any) => {
    const module: Record<string, any> = {};

    /* Get User Cart Method */
    module.GetUserCart = (options: GetUserCartOptions, callback: (err: any, result?: any) => void): void => {
        connection.query(`SELECT * FROM cart WHERE user_id = '${options.userId}';`, (err: any, cart: any) => {
            if (err) {
                callback(err);
            } else {
                callback(false, cart.length ? cart[0] : null)
            }
        })
    }

    /* Add to Cart Method */
    module.AddToCart = (options: AddToCartOptions, callback: (err: any, result?: any) => void): void => {
        connection.query(`INSERT INTO cart(user_id, cart) VALUES(?, ?) ON DUPLICATE KEY UPDATE cart = ?;`,[options.userId, options.cart, options.cart], (err: any, result: any) => {
            if (err) {
                callback(err);
            } else {
                callback(false, result)
            }
        })
    }

    /* Get product name */
    module.getProductName = (options: GetProductNameOptions, callback: (err: any, result?: any) => void): void => {
        connection.query(`SELECT * FROM grocery_items WHERE id = '${options.itemId}';`, (err: any, product: any) => {
            if (err) {
                callback(err);
            } else {
                callback(false, product.length ? product[0] : null)
            }
        })
    }

    /* Complete user order */
    module.CompleteOrder = (options: GetUserCartOptions, callback: (err: any, result?: any) => void): void => {
        connection.query(`SELECT * FROM cart WHERE user_id = '${options.userId}';`, (err: any, cart: any) => {
            if (err) {
                callback(err);
            } else {
                let cartData = JSON.parse(cart[0].cart);
                let saleAmount = cartData.cartTotal
                // Create order
                connection.query(`INSERT INTO orders SET user_id = ?, amount = ?;`, [options.userId, saleAmount], (err: any, result: any) => {
                    if (err) {
                        callback(err)
                    } else {
                        let orderId = result.insertId;
                        const values = cartData.line.map((c: CartLineItem) => [orderId, c.itemId, c.quantity, c.price]);
                        // Insert Order items
                        connection.query('INSERT INTO order_items (order_id, item_id, quantity, price) VALUES ?', [values], (err: any, result1: any) => {
                            if(err) {
                                callback(err)
                            } else {
                                // Clear cart after order complete
                                connection.query('UPDATE cart SET cart = ? WHERE user_id = ?', [JSON.stringify({ line: [], cartTotal: 0 }), options.userId], (err: any, cartResult : any) => {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        // Prepare the SQL update query for grocery_items table
                                        const updateValues = cartData.line.map((c: CartLineItem) => [c.quantity, c.itemId]);

                                        const sql = `
                                            UPDATE grocery_items 
                                            SET quantity = quantity - ? 
                                            WHERE id = ?;
                                        `;

                                        // Create an array of promises for all update queries
                                        const updatePromises = updateValues.map((value: any) => {
                                            return new Promise((resolve, reject) => {
                                                connection.query(sql, value, (err: any, result2: any) => {
                                                    if (err) {
                                                        reject(err); // Reject the promise if there is an error
                                                    } else {
                                                        resolve(result2); // Resolve the promise on success
                                                    }
                                                });
                                            });
                                        });

                                        // Use Promise.all to wait for all update queries to complete
                                        Promise.all(updatePromises)
                                        .then(() => {
                                            callback(false); // Success callback
                                        })
                                        .catch((err) => {
                                            console.error("Error updating grocery items:", err);
                                            callback(err);
                                        });
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    }

    return module;
}

export default Cart;