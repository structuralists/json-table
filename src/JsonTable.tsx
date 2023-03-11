import { memo } from 'react'
import map from 'lodash/map'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import getKeys from 'lodash/keys'
import max from 'lodash/max'
import isPlainObject from 'lodash/isPlainObject'
import first from 'lodash/first'
import isObject from 'lodash/isObject'
import toPairs from 'lodash/toPairs'
import humanizeKey from 'humanize-key'
import QuickTable from './Table/Table'
import Primitive from './Primitive'

import { sortObject } from './helpers'

type Json = unknown

const getWidth = (json: Json, humanizeKeys?: boolean) => {
   const keys = getKeys(json)
   const maxKeyLength = max(map(keys, (key) => key.length)) || 0
   const humanizeAdjustment = humanizeKeys ? 3 : 0
   const len = maxKeyLength + humanizeAdjustment
   return max([len * 8 + 20, 100])
}

type Props = {
   json: Json
   title?: React.ReactNode
   compact?: boolean
   bare?: boolean
   humanizeKeys?: boolean
}

const JsonTable = memo((props: Props) => {
   const { json, title, compact, bare, humanizeKeys, ...rest } = props

   if (isEmpty(json)) {
      return (
         <QuickTable title={title} compact={compact} bare={bare} {...rest}>
            <Primitive value={json} />
         </QuickTable>
      )
   }

   if (isArray(json) && isPlainObject(first(json))) {
      return (
         <QuickTable title={title} compact={compact} bare={bare} {...rest}>
            {map(json, (item, index) => (
               <JsonTable
                  {...rest}
                  key={`${item?.id}-${index}`}
                  title={`[${index}]`}
                  json={item}
                  compact
               />
            ))}
         </QuickTable>
      )
   }

   if (isArray(json) || (isObject(json) && isPlainObject(json))) {
      const width = getWidth(json, humanizeKeys)
      const sorted = sortObject(json)

      const pairs = toPairs(sorted)
      // converting to pairs because map breaks on objects with a length property

      const rows = map(pairs, ([key, val]) => {
         const isObject = (isArray(val) || isPlainObject(val)) && !isEmpty(val)
         return (
            <QuickTable.Row key={key}>
               <QuickTable.Cell width={`${width}px`}>
                  <Primitive
                     type="key"
                     value={humanizeKeys ? humanizeKey(key) : key}
                     {...rest}
                  />
               </QuickTable.Cell>
               {isObject ? (
                  <JsonTable
                     {...rest}
                     title={humanizeKey(key)}
                     json={val}
                     compact
                  />
               ) : (
                  <Primitive value={val} jsonKey={key} {...rest} />
               )}
            </QuickTable.Row>
         )
      })

      return (
         <QuickTable title={title} compact={compact} bare={bare}>
            {rows}
         </QuickTable>
      )
   }

   return (
      <QuickTable title={title} compact={compact} bare={bare}>
         <Primitive value={json} />
      </QuickTable>
   )
})

export default JsonTable
