import { transactionsService, categoriesService, usersService } from "./FirestoreService";

async function getTransactions(year, month, email) {
    year = year || new Date().getFullYear();
    month = month || new Date().getMonth();
    return await transactionsService.getTransactions({year, month, email});
}
async function addTransaction(transaction, email) {
    return await transactionsService.addTransaction({...transaction, email});
}

async function getCategories(email) {
    return await categoriesService.getCategories(email);
}

function initCollection(email) {
    transactionsService.setCollection(email);    
}

async function addUser(user) {
    return await usersService.addUser(user);
}

async function getUserInfo(email) {
    return await usersService.getUserInfo(email);
}
async function updateUserInfo(newInfo) {
    return await usersService.updateUserInfo(newInfo);
}

export { getTransactions, addTransaction, initCollection, getCategories, getUserInfo, addUser, updateUserInfo };