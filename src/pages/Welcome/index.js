import styles from './Welcome.module.css';
import { Link } from 'react-router-dom';

export default function Welcome() {
  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading1}>This is the best app to track your monthly expenses!</h1>
      <h2 className={styles.heading2}>With BudgetDiary you can:</h2>
      <ul className={styles.list}>
        <li className={styles.list__item}>Track monthly expenses and income<img className={styles.image} src={require('../../images/main_page.jpg')}/></li>
        <li className={styles.list__item}><img className={styles.image} src={require('../../images/add_transaction.jpg')} />It's easy and convenient to add expenses or income</li>
        <li className={styles.list__item}>Compare the flow of funds for different months<img className={styles.image} src={require('../../images/statistic.jpg')} /></li>
        <li className={styles.list__item}>And much more!</li>
      </ul>
      <p className={styles.text}>And of course, you can easily install it on your smartphone/laptop or any other device!</p>
      <p className={styles.text}><Link to="/login" className={styles.link}>Sign up</Link> and start using BudgetDiary right now</p>
    </div>
  )
}