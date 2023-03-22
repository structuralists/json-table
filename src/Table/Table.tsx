import _ from 'lodash'
import React, { cloneElement } from 'react'
import isEmpty from 'lodash/isEmpty'
import size from 'lodash/size'
import { brand, isType } from './helpers'
import { textFontStyles, labelFontStyles } from '../styles/styles'
import {
   TableConfigurationProvider,
   useTableConfiguration,
} from './TableConfig'

type WrapperProps = { bare?: boolean } & React.ComponentProps<'div'>

const Wrapper = ({ bare, ...rest }: WrapperProps) => {
   const style = {
      paddingTop: bare ? '0px' : '8px',
      paddingBottom: bare ? '0px' : '8px',
   }
   return <div style={style} {...rest} />
}

type ContentProps = { bare?: boolean } & React.ComponentProps<'div'>

const Content = ({ bare, ...rest }: WrapperProps) => {
   const style = {
      fontSize: '12px',
      border: bare ? 'none' : '1px solid #ccc',
      borderRadius: '2px',
      minHeight: '16px',
      overflow: 'hidden',
   }
   return <div style={style} {...rest} />
}

type TitleProps = { compact?: boolean } & React.ComponentProps<'div'>

const Title = ({ compact, ...rest }: TitleProps) => {
   const style = {
      ...labelFontStyles,
      textAlign: 'left',
      color: '#333',
      padding: compact ? '4px' : '8px',
      backgroundColor: '#eee',
      borderBottom: '1px solid #ccc',
   }
   // @ts-ignore
   return <div style={style} {...rest} />
}

type TableProps = {
   fixed?: boolean
   children: React.ReactNode
} & React.ComponentProps<'table'>

const Table = ({ fixed, children, ...rest }: TableProps) => {
   const style = {
      width: '100%',
      tableLayout: fixed ? 'fixed' : 'auto',
      borderCollapse: 'collapse',
   }

   return (
      // @ts-ignore
      <table style={style} {...rest}>
         {children}
      </table>
   )
}

const wrapItem = (item: any, Class: any, index: number) => {
   const el = isType(item, Class) ? (
      item
   ) : (
      <Class key={`quick-table-${Class?.type}-${item}-${index}`}>{item}</Class>
   )

   return cloneElement(el, { index })
}

type ChildList = React.ReactNode[] | React.ReactNode | undefined

const wrapList = (children: ChildList, Class: any) => {
   return React.Children.map(children, (cell, index) => {
      return wrapItem(cell, Class, index)
   })
}

type TrProps = {
   isOffset?: boolean
   isFirst?: boolean
} & React.ComponentProps<'tr'>

const Tr = ({ isOffset, isFirst, ...rest }: TrProps) => {
   const style = {
      borderTop: isFirst ? 'none' : '1px solid #CCC',
      backgroundColor: isOffset ? '#FAFAFA' : '#FFF',
   }
   return <tr style={style} {...rest} />
}

type TdProps = {
   isFirst?: boolean
   bare?: boolean
   compact?: boolean
   width?: string
} & React.ComponentProps<'td'>

const Td = (props: TdProps) => {
   const { isFirst, bare, compact, width, ...rest } = props

   const style = {
      ...textFontStyles,
      color: '#222',
      padding: bare ? '0' : compact ? '4px 6px' : '8px',
      textAlign: 'left',
      borderLeft: isFirst ? 'none' : '1px solid #ccc',
      width: width || 'auto',
      verticalAlign: 'top',
      lineHeight: '1.25',
   }
   // @ts-ignore
   return <td style={style} {...rest} />
}

type CellProps = {
   index?: number
   width?: string
   bare?: boolean
   children: React.ReactNode
}

const Cell = brand('Cell', (props: CellProps) => {
   const { index, ...rest } = props
   const { compact } = useTableConfiguration()
   return <Td compact={compact} isFirst={index === 0} {...rest} />
})

type RowProps = {
   index?: number
   children: React.ReactNode
}

const Row = ({ index, children }: RowProps) => {
   return (
      <Tr isFirst={index === 0} isOffset={(index || 0) % 2 === 1}>
         {wrapList(children, Cell)}
      </Tr>
   )
}

type ThProps = React.ComponentProps<'th'> & {
   isFirst?: boolean
   bare?: boolean
   compact?: boolean
   width?: string
}

const Th = (props: ThProps) => {
   const { isFirst, bare, compact, width, ...rest } = props

   const style = {
      ...labelFontStyles,
      color: '#222',
      padding: compact ? '6px' : '12px',
      textAlign: 'left',
      borderBottom: '1px solid #CCC',
      borderLeft: isFirst ? 'none' : '1px solid #CCC',
      backgroundColor: '#EEE',
   }

   // @ts-ignore
   return <th style={style} {...rest} />
}

const Message = (props: React.ComponentProps<'div'>) => {
   const style = {
      ...labelFontStyles,
      textAlign: 'center',
      padding: '20px',
      color: '#888',
   }
   // @ts-ignore
   return <div style={style} {...props} />
}

type HeaderCellProps = {
   index?: number
}

const HeaderCell = brand('HeaderCell', (props: HeaderCellProps) => {
   const { index, ...rest } = props
   const { compact } = useTableConfiguration()
   return <Th compact={compact} isFirst={index === 0} {...rest} />
})

const HeaderRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
   <thead>
      <tr>{wrapList(children, HeaderCell)}</tr>
   </thead>
)

type Props = {
   children: React.ReactNode
   columns?: React.ReactNode[]
   headerRow?: React.ReactNode
   title?: React.ReactNode
   compact?: boolean
   bare?: boolean
}

const QuickTable = (props: Props) => {
   const { columns = [], headerRow, children, title, compact, bare } = props

   const header = headerRow || (
      <HeaderRow>{wrapList(columns, HeaderCell)}</HeaderRow>
   )

   const contents = (() => {
      if (isEmpty(children)) {
         return (
            <tr>
               <td colSpan={size(columns) || 100}>
                  <Message>Empty List</Message>
               </td>
            </tr>
         )
      }
      const rows = wrapList(children, Row)
      return rows
   })()

   return (
      <TableConfigurationProvider compact={compact} bare={bare}>
         <Wrapper bare={bare}>
            <Content bare={bare}>
               {title && <Title compact={compact}>{title}</Title>}
               <Table fixed={false}>
                  {header}
                  <tbody>{contents}</tbody>
               </Table>
            </Content>
         </Wrapper>
      </TableConfigurationProvider>
   )
}

QuickTable.HeaderRow = HeaderRow
QuickTable.HeaderCell = HeaderCell
QuickTable.Cell = Cell
QuickTable.Row = Row

export { Row, Cell, HeaderRow, HeaderCell }

export default QuickTable
