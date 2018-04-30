import {GeoPoint} from "@google-cloud/firestore"
import {cond, isEmpty, last, map, match, not, pipe, split, T} from "ramda"

import {admin} from ".."

////////////////////////////////////////////////////////////////////////////////

type Reference = DocumentReference | CollectionReference
type DocumentReference = FirebaseFirestore.DocumentReference
type CollectionReference = FirebaseFirestore.CollectionReference

////////////////////////////////////////////////////////////////////////////////

export const fromJSON = (json: string) => JSON.parse(json, (key, val) => cond([
  [it => pipe(matchTimestamp, isEmpty, not)(it), it => convertTimestamp(it)],
  [it => pipe(matchGeoPoint, isEmpty, not)(it), it => convertGeoPoint(it)],
  [it => pipe(matchDocument, isEmpty, not)(it), it => convertDocument(it)],
  [it => pipe(matchCollection, isEmpty, not)(it), it => convertCollection(it)],
  [T, it => val]
])(`${val}`))

export const getPathSegments = (path: string) => path
  .split("/")
  .filter(it => it != "")
  .reduce((a: string[], v, i) => [...a, (i + 1) % 2 == 0 ? v : `[${v}]`], [])

export const toJSON = (object: any) => JSON.stringify(object, (key, val) => {
  if (isReference(val)) {
    const segm = getPathSegments(val.path)
    return `${segm.length % 2 == 0 ? "Document" : "Collection"}(${val.path})`
  } else if (isTimestamp(val)) {
    return `Timestamp(${val})`
  } else if (isGeoPoint(val)) {
    return `GeoPoint(${val.latitude},${val.longitude})`
  } else {
    return val
  }
})

//region Matchers

const matchTimestamp = match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/)
const matchGeoPoint = match(/GeoPoint\((.*)\)/)
const matchDocument = match(/Document\((.*)\)/)
const matchCollection = match(/Collection\((.*)\)/)

//endregion

//region Converters

const convertTimestamp = pipe(matchTimestamp, last, it => new Date(it))

const convertGeoPoint = pipe(matchGeoPoint, last, split(","),
  map(Number.parseFloat), ([lat, lon]) => new GeoPoint(lat, lon))

const convertDocument = pipe(matchDocument, last,
  it => admin.firestore().doc(it))

const convertCollection = pipe(matchCollection, last,
  it => admin.firestore().collection(it))

//endregion

//region Checkers

function isTimestamp(val: any): val is Date {
  return !!val && pipe(matchTimestamp, isEmpty, not)(`${val}`)
}

function isGeoPoint(val: GeoPoint): val is GeoPoint {
  return !!val && !!val.latitude && !!val.longitude
}

function isReference(val: Reference): val is Reference {
  return !!val && !!val.firestore && !!val.parent && !!val.path
}

//endregion
