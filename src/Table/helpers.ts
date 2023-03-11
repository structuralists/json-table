let symbol = Symbol('JsonTableType')

const matches = (first: unknown, second: unknown) => {
   return first && second && first === second
}

const isType = (item: any, kind: any) => {
   return (
      matches(item?.type?.[symbol], kind?.[symbol]) || matches(item?.type, kind)
   )
}

const brand = <T extends any>(key: string, item: T): T => {
   if (item) {
      // @ts-ignore
      item[symbol] = key
   }
   return item
}

export { brand, isType }
