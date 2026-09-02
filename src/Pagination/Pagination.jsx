import { useState, useEffect, useReducer } from "react"


const btnStyle = {
    width: "30px",
    height: "30px",
}

const divStyle = {
    width: "100%",
    height: "fit-content",
    color: "black",
    display: "flex",
    justifyContent: "center",
    rowGap: "10px",
    columnGap: "10px"
}
const BASE_URL = import.meta.env.VITE_BASE_URL
export default function Pagination() {

    const reducer = (state, action) => {
        
        switch (action.type) {
            case "setNextPage":
                return {
                    ...state,
                    next: action.res.next,
                    prev: action.res.previous,
                    data: action.res.results,
                    current: state.current + 1
                }

            case "setPrevPage":
                return {
                    ...state,
                    next: action.res.next,
                    prev: action.res.previous,
                    data: action.res.results,
                    current: state.current - 1
                }

            case "setInitialFetch":
                return {
                    ...state,
                    next: action.res.next,
                    count: action.res.count,
                    data: action.res.results,
                    pageSize: action.res.results.length
                }

            case "inNumberedPagination":
                return {
                    ...state,
                    next: action.res.next,
                    prev: action.res.previous,
                    data: action.res.results,
                    current: action.current
                }
            default:
                return state;
        }
    }

    const result = {
        count: null,
        next: null,
        prev: null,
        data: [],
        pageSize: null,
        current: 1
    }

    const [state, dispatch] = useReducer(reducer, result)

    // FIRST APPROACH 
    useEffect(() => {
        const getData = async () => {
            const req = await fetch(`${BASE_URL}/api/course/`)
            const res = await req.json()
            dispatch({ type: "setInitialFetch", res })
        }
        getData()
    }, [])

    async function backPage() {
        const req = await fetch(state.prev)
        const res = await req.json()
        dispatch({ type: "setPrevPage", res })

    }

    async function forwardPage() {
        const req = await fetch(state.next)
        const res = await req.json()
        dispatch({ type: "setNextPage", res })

    }


    // SECOND APPROACH 
    const totalPages = Math.ceil(state.count / state.pageSize)
    let numberOnButtons = []
    for (var i = 1; i <= totalPages; i++)
        numberOnButtons.push(i)

    async function moveTo(pageNo) {
        const req = await fetch(`${BASE_URL}/api/course/?page=${pageNo}`)
        const res = await req.json()
        console.log(res)
        dispatch({ type: "inNumberedPagination", res, current: pageNo })
    }

    return (
        <>
            <h1>Pagination Page</h1>
            <button onClick={() => console.log(state)}>Print State</button>

            {
                state.data ? (state.data.map(item => {
                    return <h3 key={item.id}>{item.id}: {item.course}</h3>
                })) : (
                    <h2>Loading Data</h2>
                )
            }

            {/* <div style={divStyle}>
                {
                    state.prev ? (<button onClick={backPage} style={btnStyle}>{state.current - 1}</button>) : ("")
                }

                <button style={btnStyle}>{state.current}</button>

                {
                    state.next && <button onClick={forwardPage} style={btnStyle}>{state.current + 1}</button>
                }
            </div> */}

            <div style={divStyle}>
                {
                    numberOnButtons ? (
                        numberOnButtons.map(num => {
                            return (
                                <button key={num} onClick={() => moveTo(num)}>{num}</button>
                            )
                        })
                    ) : (
                        <h3>Failed to load buttons</h3>
                    )
                }
            </div>
        </>
    )
}