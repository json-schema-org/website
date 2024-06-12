export default function toTitleCase(
  text: string,
  delimiter: string = ' ',
  separator: string = ' ',
) {
  return text
    .split(delimiter)
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(separator);
}
