import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

export const Human_fetchData = () => {
    return request({
        url: './Human_table.json',
        method: 'get'
    });
};
