import _ from 'lodash'
import React from 'react'

import {
   TableConfigurationProvider,
   useTableConfiguration,
} from './TableConfig'

const textFontStyles = {
   WhiteSpace: 'pre-wrap',
   fontWeight: 300,
}

const labelStyles = {
   fontSize: '12px',
   fontWeight: 600,
   lineHeight: 1,
}

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
      ...labelStyles,
      color: '#333',
      padding: compact ? '4px' : '8px',
      backgroundColor: '#eee',
      borderBottom: '1px solid #ccc',
   }
   return <div style={style} {...rest} />
}

type TableProps = {
   fixed?: boolean
   children: React.ReactNode
} & React.ComponentProps<'table'>

const Table = ({ fixed, children, ...rest }: TableProps) => {
   const style = {
      width: '100%',
      TableLayout: fixed ? 'fixed' : 'auto',
      BorderCollapse: 'collapse',
   }
   return (
      <table style={style} {...rest}>
         {children}
      </table>
   )
}

const wrapItem = (item: any, Class: any, index: number) => {
   return item?.type === Class ? (
      item
   ) : (
      <Class key={`quick-table-${Class?.type}-${item}-${index}`}>{item}</Class>
   )
}

type ChildList = React.ReactNode[] | React.ReactNode | undefined

const wrapList = (children: ChildList, Class: any) => {
   return React.Children.map(children, (cell, index) => {
      return wrapItem(cell, Class, index)
   })
}

type TrProps = {
   isOffset?: boolean
   isBottom?: boolean
} & React.ComponentProps<'tr'>

const Tr = ({ isOffset, isBottom, ...rest }: TrProps) => {
   const style = {
      borderBottom: !isBottom ? '1px solid #CCC' : 'none',
      backgroundColor: isOffset ? '#EEE' : '#FFF',
   }
   return <tr style={style} {...rest} />
}

type TdProps = {
   isFirst?: boolean
   bare?: boolean
   compact?: boolean
   width?: string
} & React.ComponentProps<'td'>

const Td = ({ isFirst, bare, compact, width, ...rest }: TdProps) => {
   const style = {
      ...textFontStyles,
      color: '#222',
      padding: bare ? '0' : compact ? '4px 6px' : '8px',
      TextAlign: 'left',
      borderLeft: '1px solid #ccc',
      width: width || 'auto',
      verticalAlign: 'top',
      lineHeight: '1.25',
   }
   return <td style={style} {...rest} />
}

type CellProps = {
   width?: string
   bare?: boolean
   children: React.ReactNode
}

const Cell: React.FC<CellProps> = (props) => {
   const { compact } = useTableConfiguration()
   return <Td compact={compact} {...props} />
}

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return <Tr>{wrapList(children, Cell)}</Tr>
}

type ThProps = {
   isFirst?: boolean
   bare?: boolean
   compact?: boolean
   width?: string
} & React.ComponentProps<'th'>

const Th = ({ isFirst, bare, compact, width, ...rest }: ThProps) => {
   const style = {
      ...labelStyles,
      color: '#222',
      padding: compact ? '6px' : '12px',
      TextAlign: 'left',
      borderBottom: '1px solid #CCC',
      borderLeft: isFirst ? 'none' : '1px solid #CCC',
      backgroundColor: '#EEE',
   }
   return <th style={style} {...rest} />
}

const Message = (props: React.ComponentProps<'div'>) => {
   const style = {
      ...labelStyles,
      textAlign: 'center',
      padding: '20px',
      color: '#888',
   }
   return <div {...props} />
}

const HeaderCell: React.FC = (props) => {
   const { compact } = useTableConfiguration()
   return <Th compact={compact} {...props} />
}

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

   const contents = !_.isEmpty(children) ? (
      wrapList(children, Row)
   ) : (
      <tr>
         <td colSpan={_.size(columns) || 100}>
            <Message>Empty List</Message>
         </td>
      </tr>
   )

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
