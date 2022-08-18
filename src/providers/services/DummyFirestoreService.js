const getRemoteDate = async () => {
    return {year: 2022, month: 6};
}

const getRemoteLastUpdate = async () => {
    return 12345;
}

const updateRemoteDate = async (year=new Date().getFullYear(), month=new Date().getMonth()) => {
    
}

const updateLastUpdate = async (timestamp) => {
    
}

const remoteStateService = {getRemoteDate, getRemoteLastUpdate, updateRemoteDate, updateLastUpdate};
export { remoteStateService };
// ============================================================
const getTransactions = async (year, month) => {
    let transactions = [
        {id: 1, sum: 100, category: 'Food', currency: 'USD', from: 'Walmart', date: new Date(2021, 5, 1), currency: '$'},
        {id: 2, sum: 200, category: 'Food', currency: 'USD', from: 'Walmart', date: new Date(2021, 5, 2), currency: '$'},
        {id: 3, sum: 300, category: 'Food', currency: 'USD', from: 'Walmart', date: new Date(2021, 5, 3), currency: '$'},
    ]
    // const q = query(transactionsCollection, where('date', '>=', new Date(year, month, 1)), where('date', '<=', new Date(year, month + 1, 0)));
    // let transactionsSnapshot;
    // try {
    //     transactionsSnapshot = (await getDocs(q)).docs;
    // } catch (error) {
    //     throw new Error('Cannot get transactions');
    // }
    // const transactions = [];
    // for(const doc of transactionsSnapshot) {
    //     const data = doc.data();
    //     const category = (await getDoc(data.category));
    //     const currency = (await getDoc(data.currency));
    //     const transaction = {
    //         id: doc.id,
    //         sum: data.sum,
    //         from: data.from,
    //         category: category.data().name,
    //         categoryId: category.id,
    //         currency: currency.data(),
    //         currencyId: currency.id,
    //         date: new Date(data.date.seconds*1000)
    //     }
    //     transactions.push(transaction);
    // }
    // transactions.sort((a, b) => b.date - a.date);
    return transactions;
}

const addTransaction = async (category, currency, type, sum, from, date) => {
    // const categoryRef = doc(firestore, 'categories', category.toLowerCase());
    // const currencyRef = doc(firestore, 'currencies', currency.toLowerCase());
    // const currDate = new Date(date);
    // const transaction = {
    //     sum: type === 'income' ? parseFloat(sum) : -parseFloat(sum),
    //     category: categoryRef,
    //     currency: currencyRef,
    //     from,
    //     date: currDate
    // }
    
    // const newDocRef = await addDoc(transactionsCollection, transaction);
    // return newDocRef.id;
    return 1
}

const transactionsService = {getTransactions, addTransaction}
export { transactionsService };
// ============================================================
const getCategories = async () => {
    let categories = [
        {id: 1, name: 'Food'},
        {id: 2, name: 'Transport'},
        {id: 3, name: 'Salary'},
    ]
    // let categoriesSnapshot;
    // try {
    //     categoriesSnapshot = (await getDocs(categoriesCollection)).docs;
    // } catch (error) {
    //     throw new Error('Cannot get categories');
    // }
    // const categories = [];
    // for(const doc of categoriesSnapshot) {
    //     const data = doc.data();
    //     categories.push({name: data.name, id: doc.id});
    // }
    return categories;
}

const categoriesService = {getCategories}
export { categoriesService };
// ============================================================
const getCurrencies = async () => {
    let currencies = [
        {id: 1, name: 'USD', symbol: '$'},
        {id: 2, name: 'EUR', symbol: '€'},
    ]

    // let currenciesSnapshot;
    // try {
    //     currenciesSnapshot = (await getDocs(currenciesCollection)).docs;
    // } catch (error) {
    //     throw new Error('Cannot get currencies');
    // }
    // const currencies = [];
    // for(const doc of currenciesSnapshot) {
    //     const data = doc.data();
    //     currencies.push({name: data.name, id: doc.id, symbol: data.symbol});
    // }
    return currencies;
}

const currenciesService = {getCurrencies}
export { currenciesService };