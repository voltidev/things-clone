import Service from '@ember/service';
import { getContext } from '@ember/test-helpers';

export default function stubService(serviceName, serviceProps = {}) {
  let { owner } = getContext();
  owner.register(`service:${serviceName}`, Service.extend(serviceProps));
}
