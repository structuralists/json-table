const NIL_PINK = '#f8b8b7'
const DARK_GRAY = '#444'
const GRAY = '#888'
const LIGHT_GRAY = '#AAA'
const NUM_BLUE = '#6e86c4'
const ID_BLUE = '#1eb4c4'
const DATE_BLUE = '#1050c0'
const AMOUNT_GREEN = '#3d9970'
const STRING_ORANGE = '#d28140'

const BOOL_PURPLE = '#973bA9'

const COLORS = {
   object: DARK_GRAY,
   emptyObject: LIGHT_GRAY,

   array: DARK_GRAY,
   emptyArray: LIGHT_GRAY,

   key: GRAY,
   text: GRAY,
   boolean: BOOL_PURPLE,
   string: STRING_ORANGE,
   emptyString: LIGHT_GRAY,
   id: ID_BLUE,
   number: NUM_BLUE,
   date: DATE_BLUE,
   amount: AMOUNT_GREEN,
   undefined: NIL_PINK,
   null: NIL_PINK,
   index: GRAY,
   unknown: DARK_GRAY,
   function: GRAY,
   symbol: NUM_BLUE,
} as const

type JsonDisplayType = keyof typeof COLORS

export type { JsonDisplayType }

export { COLORS }
