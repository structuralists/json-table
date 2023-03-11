import { useMemo, useState, memo } from 'react'
import _ from 'lodash'
import { COLORS } from './colors'
import type { JsonDisplayType } from './colors'
import { textFontStyles } from './styles/styles'

type ValueProps = { type: JsonDisplayType } & React.ComponentProps<'span'>

const Value = ({ type, ...rest }: ValueProps) => {
   const style = {
      ...textFontStyles,
      color: type ? COLORS[type] : COLORS['unknown'],
   }
   // @ts-ignore
   return <span style={style} {...rest} />
}

const JsonFunc = ({ func }: { func?: any }) => {
   const value = useMemo(() => `${func}`, [func])

   const style = {
      ...textFontStyles,
      color: COLORS['function'],
      fontSize: '0.8em',
   }

   // @ts-ignore
   return <span style={style}>{value}</span>
}

type Args = {
   type?: JsonDisplayType
   jsonKey?: string
   value: any
}

const isIdKey = (key: string | undefined) => {
   if (!key) return false
   if (key === 'id') return true
   if (key === 'ID') return true

   if (_.endsWith(key, '_id')) return true
   if (_.endsWith(key, 'Id')) return true
   return false
}

const DATE_KEYS = ['date'] as const

const DATE_SUFFIXES = ['_at', 'At', '_created', '_updated']

const isDateKey = (key: string | undefined) => {
   if (!key) return false
   if (_.includes(DATE_KEYS, key)) return true
   if (_.some(DATE_SUFFIXES, (suffix) => _.endsWith(key, suffix))) {
      return true
   }
   return false
}

const isDateValue = (val: unknown): val is string | number => {
   if (!val) return false
   if (_.isFinite(val)) return true
   if (_.isString(val)) return true
   // toodo:  get better string and number constraints
   return false
}

const getType = (args: Args): JsonDisplayType => {
   const { type, jsonKey, value } = args
   if (type && type !== 'unknown' && type in COLORS) return type

   if (isIdKey(jsonKey)) return 'id'

   if (isDateKey(jsonKey)) return 'date'

   if (_.isBoolean(value)) return 'boolean'

   if (_.isNull(value)) return 'null'

   if (_.isUndefined(value)) return 'undefined'

   if (_.isNumber(value) || _.isNaN(value)) return 'number'

   if (_.isString(value)) {
      if (value === '') return 'emptyString'
      return 'string'
   }

   if (_.isFunction(value)) return 'function'

   if (_.isArray(value) && _.isEmpty(value)) {
      return 'emptyArray'
   }

   if (_.isPlainObject(value) && _.isEmpty(value)) {
      return 'emptyObject'
   }

   if (typeof value === 'symbol') {
      return 'symbol'
   }

   return 'unknown'
}

type TimestampProps = {
   value: unknown
}

const isValidDate = (value: any) => {
   const formattedDate = new Date(value).toLocaleString()
   return formattedDate !== 'Invalid Date'
}

const TimestampValue: React.FC<TimestampProps> = ({ value }) => {
   const [formatted, setFormatted] = useState<boolean>(() => isValidDate(value))

   const isDate = isDateValue(value)

   const displayValue = useMemo<string>(() => {
      if (isDate && formatted) {
         return new Date(value).toLocaleString()
      }
      return `${value}`
   }, [formatted, isDate, value])

   const type = formatted ? 'date' : getType({ value })

   return (
      <Value type={type} onDoubleClick={() => setFormatted((val) => !val)}>
         {displayValue}
      </Value>
   )
}

type Props = {
   type?: JsonDisplayType
   value: unknown
   jsonKey?: string
}

const Primitive = memo(({ type, jsonKey, value }: Props) => {
   const resolvedType = getType({ type, jsonKey, value })

   if (resolvedType === 'date') {
      return <TimestampValue value={value} />
   }

   if (resolvedType === 'function') {
      return <JsonFunc func={value} />
   }

   if (resolvedType === 'emptyString') {
      return <Value type="emptyString">{`''`}</Value>
   }

   if (resolvedType === 'emptyArray') {
      return <Value type="emptyArray">{`[]`}</Value>
   }

   if (resolvedType === 'emptyObject') {
      return <Value type="emptyObject">{`{}`}</Value>
   }

   // @ts-ignore
   return <Value type={resolvedType}>{`${value?.toString() || value}`}</Value>
})

export default Primitive
