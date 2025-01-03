/**********Model Initi *********/

import dbConnect from '../dbConnect';
import Users from './Users';

//Exporting all models with dbConnect
export default {
    Users : Users(dbConnect)
}