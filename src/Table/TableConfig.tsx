import React, { createContext, useContext, useMemo } from 'react'

type Configuration = {
   compact: boolean
   bare: boolean
}

const DEFAULT_VALUE = {
   compact: false,
   bare: false,
} as const

const TableConfigurationContext = createContext<Configuration>(DEFAULT_VALUE)

type Props = {
   compact?: boolean
   bare?: boolean
   children: React.ReactNode
}

const TableConfigurationProvider: React.FC<Props> = (props) => {
   const { compact, bare, children } = props

   const value = useMemo(() => {
      return { compact: !!compact, bare: !!bare }
   }, [compact, bare])

   return (
      <TableConfigurationContext.Provider value={value}>
         {children}
      </TableConfigurationContext.Provider>
   )
}

const useTableConfiguration = () => useContext(TableConfigurationContext)

export { TableConfigurationProvider, useTableConfiguration }
