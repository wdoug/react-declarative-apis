import fetchData from './internal/fetchData';
import Profile from '../presentational/Profile';

const getUrl = (props) => `customers/${props.id}?filter=${JSON.stringify({ "include": "followers" })}`;

export default fetchData(getUrl)(Profile);
