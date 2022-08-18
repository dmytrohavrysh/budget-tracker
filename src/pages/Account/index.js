import { useState, memo } from "react"

const Test = memo(() => {
    console.log('!!!!!!')
    return (<h1>Hello!</h1>)
})

const Account = () => {
    const [x, changeX] = useState(0);

    const click = () => {
        changeX(x + 1);
    }
    return (
        <div>
            <Test />
            <h1>Account</h1>
            <button onClick={click}>Ok</button>
        </div>
    );
}

export default Account;