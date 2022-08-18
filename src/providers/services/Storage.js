import { transactionsService, remoteStateService } from "./FirestoreService";
import { IndexedDBService } from "./IndexedDBService";
let localDB = null;

function init() {
    localDB = IndexedDBService.connect();
    const local_year = localStorage.getItem('local_data_year');
    const local_month = localStorage.getItem('local_data_month');
    if(local_year === null || local_month === null) {
        localStorage.setItem("local_data_month", new Date().getMonth());
        localStorage.setItem("local_data_year", new Date().getFullYear());
    }
    return true;
}

async function updateTransactions() {
    let remote_last_update = (await remoteStateService.getRemoteLastUpdate());
    let remote_year_month = (await remoteStateService.getRemoteDate());
    if(IndexedDBService.isUpdateNeeded(remote_last_update, remote_year_month)) {
        let data = await transactionsService.getTransactions(remote_year_month.year, remote_year_month.month);
        IndexedDBService.loadData(localDB, data);
        localStorage.setItem("local_last_update", remote_last_update.valueOf());
        localStorage.setItem("local_data_month", remote_year_month.month);
        localStorage.setItem("local_data_year", remote_year_month.year);
        return data;
    }
    return IndexedDBService.getData(localDB).then(data => data);
}

async function addTransaction({category, currency, type, sum, from, date}) {
    const id = await transactionsService.addTransaction(category, currency, type, sum, from, date);
    
    IndexedDBService.addTransaction(localDB, category, currency, type, sum, from, date, id);

    const now = new Date();
    await remoteStateService.updateLastUpdate(now);
    await remoteStateService.updateRemoteDate(now.getFullYear(), now.getMonth());
    return await updateTransactions();
}

async function changeRemoteDate({year, month}) {
    await remoteStateService.updateRemoteDate(year, month);
    return await updateTransactions();
}

function getLocalYear() {
    return localStorage.getItem("local_data_year");
}

function getLocalMonth() {
    return localStorage.getItem("local_data_month");
}

export { init, addTransaction, updateTransactions, changeRemoteDate, getLocalMonth, getLocalYear };