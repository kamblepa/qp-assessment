/**********Model Initi *********/

import dbConnect from '../dbConnect';
import Users from './Users';
import GroceryItems from './GroceryItems';

//Exporting all models with dbConnect
export default {
    Users : Users(dbConnect),
    GroceryItems : GroceryItems(dbConnect)
}