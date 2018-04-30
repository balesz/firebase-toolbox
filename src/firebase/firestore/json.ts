import {GeoPoint} from "@google-cloud/firestore"
import {cond, isEmpty, last, map, match, not, pipe, split, T} from "ramda"

import {admin} from ".."
import {isCollectionPath} from "./path"

////////////////////////////////////////////////////////////////////////////////

type Reference = DocumentReference | CollectionReference
type DocumentReference = FirebaseFirestore.DocumentReference
type CollectionReference = FirebaseFirestore.CollectionReference

////////////////////////////////////////////////////////////////////////////////

export const fromJSON = (json: string) => JSON.parse(json, (key, val) => cond([
  [pipe(matchTimestamp, isNotEmpty), convertTimestamp],
  [pipe(matchGeoPoint, isNotEmpty), convertGeoPoint],
  [pipe(matchDocument, isNotEmpty), convertDocument],
  [pipe(matchCollection, isNotEmpty), convertCollection],
  [T, it => val]
])(`${val}`))

export const toJSON = (object: any) => JSON.stringify(object, (key, val) => {
  if (isReference(val) && isCollectionPath(val.path)) {
    return `collection://${val.path}`
  } else if (isReference(val) && !isCollectionPath(val.path)) {
    return `document://${val.path}`
  } else if (isTimestamp(val)) {
    return `${val}`
  } else if (isGeoPoint(val)) {
    return `geo(${val.latitude},${val.longitude})`
  } else {
    return val
  }
})

//region Matchers

const matchTimestamp = match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/)
const matchGeoPoint = match(/geo\((.*)\)/)
const matchDocument = match(/document:\/\/(.*)/)
const matchCollection = match(/collection:\/\/(.*)/)

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

const isNotEmpty = pipe(isEmpty, not)

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
