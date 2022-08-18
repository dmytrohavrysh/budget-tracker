function connect() {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    let openRequest = indexedDB.open("Transactions", 1);

    openRequest.onupgradeneeded = function() {
        debugger
        let db = openRequest.result;
        if(!db.objectStoreNames.contains("local_transactions")) {
            db.createObjectStore("local_transactions", {keyPath: "id"});
        }
    };

    openRequest.onerror = function() {
        console.error("Error", openRequest.error);
    };

    return openRequest;
}

function addTransaction(request, category, currency, type, sum, from, date, id) {
    let db = request.result;
    let transaction = db.transaction(["local_transactions"], "readwrite");
    let objectStore = transaction.objectStore("local_transactions");
    const currDate = new Date(date);
    objectStore.add({
        id,
        category,
        currency,
        type,
        sum: type === 'income' ? parseFloat(sum) : -parseFloat(sum),
        from,
        date: currDate
    });
}

function loadData(request, data) {
    if(request.readyState === 'done') {
        let db = request.result;
        let transaction = db.transaction(["local_transactions"], "readwrite");
        let objectStore = transaction.objectStore("local_transactions");
        objectStore.clear();
        for(let t of data) {
            objectStore.put(t);
        }
        return transaction;
    }
}

function getData(request) {
    return new Promise((resolve, reject) => {
        let db = request.result;
        let transaction = db.transaction(["local_transactions"], "readonly");
        let objectStore = transaction.objectStore("local_transactions");
        let data = [];
        const cursor = objectStore.openCursor();
        cursor.onsuccess = function(event) {
            let cursor = event.target.result;
            if(cursor) {
                data.push(cursor.value);
                cursor.continue();
            } else {
                data.sort((a, b) => b.date - a.date);
                resolve(data);
            }
        }
    }); 
}

function isUpdateNeeded(remote_last_update, remote_year_month) {
    return remote_last_update.valueOf() !== localStorage.getItem("local_last_update") || 
        !(remote_year_month.month === +localStorage.getItem("local_data_month") && 
            remote_year_month.year === +localStorage.getItem("local_data_year"));
}

const IndexedDBService = {connect, addTransaction, loadData, getData, isUpdateNeeded};
export { IndexedDBService };