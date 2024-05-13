export const requestHandler = async (
    api,
    setLoading,
    onSuccess,
    onError
 ) => {
    setLoading && setLoading(true);
    try {
        const response = await api();
        const { data } = response;
        if(data?.success) {
            onSuccess(data);
        }
    } catch(err) {
        console.log(err)
        if([401, 403].includes(err?.response?.data?.statusCode)){
            localStorage.clear();
            if(isBrowser) window.location.href = '/login';
        }
        onError(err?.response?.data?.message || "Something went wrong");
    } finally {
        setLoading && setLoading(false);
    }
 }

 export const isBrowser = typeof window !== "undefined";

 export const getChatObjectMetadata = (
    chat,
    loggedInUser
 ) => {
    // group chat part comes here

    const participant = chat.participants.find( 
        (p) => p.id !== loggedInUser?.id
    );

    return {
        title : participant?.username,
        description: participant?.email
    }

};

export const classNames = (...className) => {
    return className.filter(Boolean).join(" ");
  };
  

export class LocalStorage {
    static get(key){
        if(!isBrowser) return ;
        const value = localStorage.getItem(key);
        if(value) {
            try {
                return JSON.parse(value);
            } catch(err) {
                return null;
            }
        }

        return null;
    }

    static set(key, value) {
        if(!isBrowser) return ;
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key){
        if(!isBrowser) return ;
        localStorage.removeItem(key);
    }

    static clear() {
        if(!isBrowser) return ;
        localStorage.clear();
    }
}