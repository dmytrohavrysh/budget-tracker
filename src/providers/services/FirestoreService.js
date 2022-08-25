import { collection, doc, getDoc, getDocs, addDoc, query, where, updateDoc} from "firebase/firestore";
import {firestore} from "../../firebase";

let transactionsCollection;
const categoriesCollection = collection(firestore, "categories");
const usersCollection = collection(firestore, "users");

// ============================================================
const setCollection = (email) => {
    transactionsCollection = collection(firestore, "transactions-"+email)
}

const getTransactions = async ({email, year, month}) => {
    setCollection(email)
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

const addTransaction = async ({email, category, type, sum, from, date}) => {
    setCollection(email)
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

const transactionsService = {getTransactions, addTransaction, setCollection}
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
const addUser = async (user) => {
    const newUser = {
        name: user?.name,
        surname: user?.surname,
        email: user.email
    }
    
    const newDocRef = await addDoc(usersCollection, newUser);
    return newDocRef.id;
}

const getUserInfo = async (email) => {
    const userRef = doc(firestore, 'users', email);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()) {
        return userSnap.data();
    } else {
        throw new Error('No such user!');
    }
}

const updateUserInfo = async ({name, surname, email}) => {
    const userRef = doc(firestore, 'users', email);

    return await updateDoc(userRef, {name, surname})
    
}
const usersService = {addUser, getUserInfo, updateUserInfo}
export {usersService}