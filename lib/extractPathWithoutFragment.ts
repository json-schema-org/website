export default function extractPathWithoutFragment(pathWithFragment: string) {
  const fragmentIndex = pathWithFragment.indexOf('#');
  if (fragmentIndex !== -1) {
    return pathWithFragment.substring(0, fragmentIndex);
  } else {
    return pathWithFragment;
  }
}
