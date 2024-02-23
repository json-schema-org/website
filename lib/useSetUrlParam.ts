import { useRouter } from 'next/router';

const HOST = 'https://json-schema.org';

export default function useSetUrlParam() {
  const router = useRouter();
  const url = new URL(`${HOST}${router.asPath}`);
  return (param: string, value: string | null) => {
    if (value === null) {
      url.searchParams.delete(param);
    } else {
      url.searchParams.set(param, value);
    }
    router.push(url.href.slice(HOST.length));
  };
}
