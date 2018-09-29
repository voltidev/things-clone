import { helper } from '@ember/component/helper';
import moment from 'moment';

function isThisYear(date) {
  return date.getFullYear() === (new Date()).getFullYear();
}

export function formatDate([date]) {
  return moment(date).format(isThisYear(date) ? 'MMM DD' : 'MMM DD, YYYY');
}

export default helper(formatDate);
