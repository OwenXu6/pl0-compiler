import request from '../utils/request';


export const fetchHallData = () => {
    return request({
        url: 'https://42.192.39.198：5000/api/ExhibitionHall',
        method: 'get'
    });
};

export const fetchCollectionsData=()=>{
  return request({
      url: './collections.json',
      method: 'get'
  });
};

export const fetchActivityData = () => {
  return request({
      url: './activity.json',
      method: 'get'
  });
};
