import { createStore } from 'vuex'

export const store = createStore({
    actions: {},
    mutations: { 
    },
    state: {
        UserType:[],
        userid:'',
        user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
        token: '',
        username:''
    },

})

