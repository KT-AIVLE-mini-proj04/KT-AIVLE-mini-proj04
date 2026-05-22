import { commonPostHook } from './common.hook';


export const hookBookList = async () => {
    const baseUrl = import.meta.env.VITE_API_URL + '/books';
    const res = await commonPostHook('GET', baseUrl, null);
    return res;
  };
