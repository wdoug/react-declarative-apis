import gimmeData from './internals/gimmeData';
import Profile from '../presentational/Profile';

export default gimmeData((state, props) => ({
  customer: `customers/${props.id}?filter=${JSON.stringify({ "include": "followers" })}`
}))(Profile);
