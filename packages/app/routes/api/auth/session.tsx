import { LoaderFunction, json } from 'remix';
import { getSession } from '../../../session.server';
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let session = await getSession(request.headers.get('Cookie'));
  let keyPair = session.get('sea');
  if (keyPair) {
    let keys = keyPair;
    return json(keys);
  }
  return null;
};
