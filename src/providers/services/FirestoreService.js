import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where} from "firebase/firestore";
import {firestore} from "../../firebase";

const transactionsCollection = collection(firestore, "transactions");
const categoriesCollection = collection(firestore, "categories");
const currenciesCollection = collection(firestore, "currencies");
const remoteStateCollection = collection(firestore, "remote-state");

const getRemoteDate = async () => {
    const resDoc = await getDoc(doc(firestore, 'remote-state', 'current-date'));
    return {year: resDoc.data().year, month: resDoc.data().month};
}

const getRemoteLastUpdate = async () => {
    let resDoc = await getDoc(doc(firestore, 'remote-state', 'last-update'));
    return resDoc.data()['last-update'];
}

const updateRemoteDate = async (year=new Date().getFullYear(), month=new Date().getMonth()) => {
    const dateDoc = doc(remoteStateCollection, 'current-date');
    await updateDoc(dateDoc, {year, month});
}

const updateLastUpdate = async (timestamp) => {
    const dateDoc = doc(remoteStateCollection, 'last-update');
    updateDoc(dateDoc, {'last-update': timestamp});
}

const remoteStateService = {getRemoteDate, getRemoteLastUpdate, updateRemoteDate, updateLastUpdate};
export { remoteStateService };
// ============================================================
const getTransactions = async (year, month) => {
    const q = query(transactionsCollection, where('date', '>=', new Date(year, month, 1)), where('date', '<=', new Date(year, month + 1, 0)));
    let transactionsSnapshot;
    try {
        transactionsSnapshot = (await getDocs(q)).docs;
    } catch (error) {
        throw new Error('Cannot get transactions');
    }
    const transactions = [];
    for(const doc of transactionsSnapshot) {
        const data = doc.data();
        const category = (await getDoc(data.category));
        const currency = (await getDoc(data.currency));
        const transaction = {
            id: doc.id,
            sum: data.sum,
            from: data.from,
            category: category.data().name,
            categoryId: category.id,
            currency: currency.data(),
            currencyId: currency.id,
            date: new Date(data.date.seconds*1000)
        }
        transactions.push(transaction);
    }
    transactions.sort((a, b) => b.date - a.date);
    return transactions;
}

const addTransaction = async (category, currency, type, sum, from, date) => {
    const categoryRef = doc(firestore, 'categories', category.toLowerCase());
    const currencyRef = doc(firestore, 'currencies', currency.toLowerCase());
    const currDate = new Date(date);
    const transaction = {
        sum: type === 'income' ? parseFloat(sum) : -parseFloat(sum),
        category: categoryRef,
        currency: currencyRef,
        from,
        date: currDate
    }
    
    const newDocRef = await addDoc(transactionsCollection, transaction);
    return newDocRef.id;
}

const transactionsService = {getTransactions, addTransaction}
export { transactionsService };
// ============================================================
const getCategories = async () => {
    let categoriesSnapshot;
    try {
        categoriesSnapshot = (await getDocs(categoriesCollection)).docs;
    } catch (error) {
        throw new Error('Cannot get categories');
    }
    const categories = [];
    for(const doc of categoriesSnapshot) {
        const data = doc.data();
        categories.push({name: data.name, id: doc.id});
    }
    return categories;
}

const categoriesService = {getCategories}
export { categoriesService };
// ============================================================
const getCurrencies = async () => {
    let currenciesSnapshot;
    try {
        currenciesSnapshot = (await getDocs(currenciesCollection)).docs;
    } catch (error) {
        throw new Error('Cannot get currencies');
    }
    const currencies = [];
    for(const doc of currenciesSnapshot) {
        const data = doc.data();
        currencies.push({name: data.name, id: doc.id, symbol: data.symbol});
    }
    return currencies;
}

const currenciesService = {getCurrencies}
export { currenciesService };