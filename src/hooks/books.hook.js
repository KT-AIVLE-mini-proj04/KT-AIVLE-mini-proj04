import { commonPostHook } from './common.hook';


export const hookBooks = async (
    method,
    data,
  ) => {
    const baseUrl = import.meta.env.VITE_API_URL + `/books/${data.id}`;
    let url = baseUrl;

    const now = new Date().toISOString()
    if (method === 'POST')  {
      data = { ...data, createdAt: now, updatedAt: now }
      url = import.meta.env.VITE_API_URL + '/books'
    }
    if (method === 'PATCH') {
      data = { ...data, updatedAt: now }
    }
    const res = await commonPostHook(method, url, data);
    return res;
  };
