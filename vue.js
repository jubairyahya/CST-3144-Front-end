const{craeteApp,ref,computed,onMounted}=Vue;

createApp({
    setup(){
        const currentPage=ref('home');
        const cart=ref([]);
        const searchQuery=ref('')
    
        onMounted();
        return{
            currentPage,
            cart,
            searchQuery
        };
    },
}).mount('#app');