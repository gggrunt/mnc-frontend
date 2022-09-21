import { connect } from 'react-redux'

// component
const Component = (data: {
    count: number
    handleIncrementClick: () => void
    handleDecrementClick: () => void
}) => (
    <div>
        <h1>Hello world: {data.count}</h1>
        <button onClick={data.handleDecrementClick}>Decrement</button>
        <button onClick={data.handleIncrementClick}>Increment</button>
    </div>
)
const mapStateToProps = (state: any) => {
    return {
        count: state,
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        handleIncrementClick: () => dispatch({ type: 'INCREMENT' }),
        handleDecrementClick: () => dispatch({ type: 'DECREMENT' }),
    }
}

export const Container = connect(mapStateToProps, mapDispatchToProps)(Component)
