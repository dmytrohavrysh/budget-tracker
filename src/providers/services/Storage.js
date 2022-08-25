import { transactionsService, categoriesService, usersService } from "./FirestoreService";

async function getTransactions(year, month) {
    year = year || new Date().getFullYear();
    month = month || new Date().getMonth();
    return await transactionsService.getTransactions({year, month});
}
async function addTransaction(transaction) {
    return await transactionsService.addTransaction(transaction);
}

async function getCategories() {
    return await categoriesService.getCategories();
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

export { getTransactions, addTransaction, getCategories, getUserInfo, addUser,updateUserInfo };