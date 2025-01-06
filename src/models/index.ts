/**********Model Initi *********/

import dbConnect from '../dbConnect';
import Users from './Users';
import GroceryItems from './GroceryItems';
import Cart from './Cart';

//Exporting all models with dbConnect
export default {
    Users : Users(dbConnect),
    GroceryItems : GroceryItems(dbConnect),
    Cart : Cart(dbConnect),
}