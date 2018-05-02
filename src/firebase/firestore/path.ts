import {compose, isEmpty, isNil, match, not, path, replace} from "ramda"

const matchCollectionKey = match(/\__.*\__/)

export class Path {

  private _path: string[]

  constructor(path: string) {
    this._path = path ? path.split("/")
      .filter(compose(not, isEmpty)).map(replace("__", "")) : []
  }

  public static isCollectionKey(key: string): boolean {
    return compose(not, isEmpty, matchCollectionKey)(key)
  }

  public static isCollectionPath(path: string): boolean {
    return path.split("/").filter(compose(not, isEmpty)).length % 2 > 0
  }

  public get isCollection() {
    return Path.isCollectionPath(this.reference)
  }

  public get isEmpty() {
    return isEmpty(this._path)
  }

  public get object(): string {
    return this.objectArray.join("/")
  }

  public get objectArray(): string[] {
    return this._path.map((val, idx) => (idx + 1) % 2 == 0 ? val : `__${val}__`)
  }

  public get reference(): string {
    return this.referenceArray.join("/")
  }

  public get referenceArray(): string[] {
    return this._path
  }

  public isExistsIn(data: {[key: string]: any}): boolean {
    return compose(not, isNil, path(this.objectArray))(data)
  }

  public toString(...segments: string[]): string {
    return [...this._path, ...segments].join("/")
  }
}
