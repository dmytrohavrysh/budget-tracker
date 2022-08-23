import { transactionsService, categoriesService } from "./FirestoreService";

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


export { getTransactions, addTransaction, getCategories };