/* eslint no-unused-vars: 0 */
export default interface Serializable<T> {
  deserialize(input: Object): T;
  serialize(): String;
}
