export default function getRandId () {
  return Math.random().toString(36).slice(2, 9); // AlphaNumeric number system (base36)
}