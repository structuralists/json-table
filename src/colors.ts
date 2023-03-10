const NIL_PINK = '#f8b8b7'

const COLORS = {
   object: '#444',
   emptyObject: '#AAA',

   array: '#444',
   emptyArray: '#AAA',

   key: '#888',
   text: '#888',
   boolean: '#973bA9',
   string: '#d28140',
   emptyString: '#AAA',
   id: '#1eb4c4',
   number: '#6e86c4',
   date: '#1050c0',
   amount: '#3d9970',
   undefined: NIL_PINK,
   null: NIL_PINK,
   index: '#888',
   unknown: '#444',
   function: '#888',
} as const

type JsonDisplayType = keyof typeof COLORS

export type { JsonDisplayType }

export { COLORS }
