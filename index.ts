import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const loadingInitialState = {
    INCREMENT_COUNTER: false,
    DECREMENT_COUNTER: false
};

interface ErrorState {

}

const errorInitialState: ErrorState = {
    INCREMENT_COUNTER: null,
    DECREMENT_COUNTER: null
}

const initialCounterState = {
    value: 0
};

function loadingReducer2(state = loadingInitialState, action: Actions) {
    const splited = action.type.split('_')
    const type = splited[splited.length - 1];
    const name = action.type.replace(`_${type}`, '');

    switch (type) {
      case 'START':
        return {
            ...state,
            [name]: true
        }
      case 'SUCCESS':
      case 'ERROR': 
        return {
            ...state,
            [name]: false
        }
    }

    return state;
}

function loadingReducer(state = loadingInitialState, action: Actions) {
    const { type } = action;
    const matches = /(.*)_(START|SUCCESS|ERROR)/.exec(type);

    if(!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;

    return {
        ...state,
        [requestName]: requestState === 'START'
    }
}

function errorReducer(state = errorInitialState, action: any) {
    const { type, payload } = action;
    const matches = /(.*)_(START|SUCCESS|ERROR)/.exec(type);

    if(!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;

    return {
        ...state,
        [requestName]: requestState === 'ERROR' ? payload : null
    }
}

function counterReducer(state = initialCounterState, action: Actions) {

    switch(action.type) {
        case INCREMENT_COUNTER_SUCCESS:
            return { ...state, value: state.value + 1 };
        case DECREMENT_COUNTER_SUCCESS:
            return { ...state, value: state.value - 1 };
    }

    return state;
}

const rootReducer = combineReducers({
    loading: loadingReducer,
    error: errorReducer,
    counter: counterReducer,
    // any other reducer ...
});

const store = createStore(
    rootReducer,
    composeWithDevTools()
);

store.subscribe(() => console.log(store.getState()));

const INCREMENT_COUNTER_START = 'INCREMENT_COUNTER_START';
const DECREMENT_COUNTER_START = 'DECREMENT_COUNTER_START';
const INCREMENT_COUNTER_ERROR = 'INCREMENT_COUNTER_ERROR';
const INCREMENT_COUNTER_SUCCESS = 'INCREMENT_COUNTER_SUCCESS';
const DECREMENT_COUNTER_SUCCESS = 'DECREMENT_COUNTER_SUCCESS';

const incrementStart = () : IncrementStart => ({
    type: 'INCREMENT_COUNTER_START'
});

interface IncrementStart {
    type: typeof INCREMENT_COUNTER_START
}

const decrementStart = () : DecrementStart => ({
    type: 'DECREMENT_COUNTER_START'
});

interface DecrementStart {
    type: typeof DECREMENT_COUNTER_START
}

const incrementError = (code: number, message: string) : IncrementError => ({
    type: 'INCREMENT_COUNTER_ERROR', 
    payload: {
        code,
        message
    }
});

interface IncrementError {
    type: typeof INCREMENT_COUNTER_ERROR,
    payload: { code: number, message: string }
}

const incrementSuccess = () : IncrementSuccess => ({
    type: 'INCREMENT_COUNTER_SUCCESS'
})

interface IncrementSuccess {
    type: typeof INCREMENT_COUNTER_SUCCESS
}

const decrementSuccess = () : DecrementSuccess => ({
    type: DECREMENT_COUNTER_SUCCESS 
})

interface DecrementSuccess {
    type: typeof DECREMENT_COUNTER_SUCCESS
}

type Actions = IncrementStart | DecrementStart | IncrementError | IncrementSuccess | DecrementSuccess;

store.dispatch(incrementStart());
store.dispatch(decrementStart());
store.dispatch(incrementError(500, 'Something went wrong'));
store.dispatch(incrementSuccess());