import {defineStore} from "pinia";

export const useBaseUrl = defineStore("baseUrl",{
    state:()=>{
        return {baseUrl:"http://localhost:5000"}
    }
})