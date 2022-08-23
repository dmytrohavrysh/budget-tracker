import { collection, doc, getDoc, getDocs, addDoc, query, where} from "firebase/firestore";
import {firestore} from "../../firebase";

const transactionsCollection = collection(firestore, "transactions");
const categoriesCollection = collection(firestore, "categories");

// ============================================================
const getTransactions = async ({year, month}) => {
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
        const transaction = {
            id: doc.id,
            sum: data.sum,
            from: data.from,
            category: category.data().name,
            categoryId: category.id,
            date: new Date(data.date.seconds*1000)
        }
        transactions.push(transaction);
    }
    transactions.sort((a, b) => b.date - a.date);
    return transactions;
}

const addTransaction = async ({category, type, sum, from, date}) => {
    const categoryRef = doc(firestore, 'categories', category.toLowerCase());
    const currDate = new Date(date);
    const transaction = {
        sum: type === 'income' ? parseFloat(sum) : -parseFloat(sum),
        category: categoryRef,
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