import isArray from 'lodash/isArray'
import isNull from 'lodash/isNull'
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import isBoolean from 'lodash/isBoolean'
import sortBy from 'lodash/sortBy'
import isObject from 'lodash/isObject'
import every from 'lodash/every'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'

import type { JsonDisplayType } from './colors'

type Json = unknown

const isSimple = (obj: Json) => {
   return isObject(obj) && every(obj, (item) => !isObject(item))
}

const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

const isDateValue = (value: Json) => {
   if (isString(value)) {
      if (value.slice(0, 10).match(dateRegex)) return true
   }
   return false
}

const getDispalyTypeFromValue = (value: Json): JsonDisplayType => {
   if (isNull(value)) return 'null'

   if (isUndefined(value)) return 'undefined'

   if (isArray(value)) {
      return isEmpty(value) ? 'emptyArray' : 'array'
   }

   if (isString(value)) {
      return value.trim() === '' ? 'emptyString' : 'string'
   }

   if (isPlainObject(value)) {
      return isEmpty(value) ? 'emptyObject' : 'object'
   }

   return 'unknown'
}

const sortEntries = <T extends any[]>(list: T): T => {
   const sortedList = sortBy(list, (item) => {
      // @ts-ignore
      if (!item || !item?.[0]) return 200

      // @ts-ignore
      const [key, value] = item

      if (isPlainObject(value)) {
         if (isSimple(value)) {
            return isArray(value) ? 100 : 110
         }
         return isArray(value) ? 130 : 120
      }

      if (key === 'id') return 1

      if (isBoolean(value)) return 25

      return 50
   })

   return sortedList as T
}

const sortObject = <T extends {}>(obj: T): T => {
   const pairs = toPairs(obj)
   const sortedPairs = sortEntries(pairs)
   const sortedObj = fromPairs(sortedPairs)
   return sortedObj as T
}

export { getDispalyTypeFromValue, isDateValue, sortEntries, sortObject }
