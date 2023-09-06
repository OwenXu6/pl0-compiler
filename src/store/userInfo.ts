import {defineStore} from "pinia";

export const useUserInfo=defineStore('userInfo',{
    state:()=>{
        return {userToken:undefined}
    },
    actions:{
        updateToken(token){
            this.userToken=token
        }
    }
})