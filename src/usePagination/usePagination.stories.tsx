import {
  Button,
  Card,
  CardBody,
  Chip,
  Column,
  Monospace,
  Pagination,
  Row,
  Slider,
} from '@committed/components'
import { Meta, Story } from '@storybook/react'
import React, { useMemo, useState } from 'react'
import useSwr from 'swr'
import { PaginationData, usePagination } from '.'

export interface UsePaginationDocsProps<T = void> {
  /** The total number of items, if know when initializing, use setTotalItems if not */
  totalItems?: number
  /** The page to start on */
  startPage?: number
  /** The size of each page */
  pageSize?: number
  /** A function called with the pagination data on data change to prepare the returned `query` object, this is memoed for you */
  queryCallback?: (data: PaginationData) => T
}

/**
 * Utility hook for Pagination state
 *
 * returns an object containing the current page, additional useful state and functions for manipulation.
 *
 */
export const UsePaginationDocs: React.FC<UsePaginationDocsProps> = (
  _props: UsePaginationDocsProps
) => null
UsePaginationDocs.defaultProps = {
  totalItems: 0,
  startPage: 1,
  pageSize: 20,
}

export default {
  title: 'Hooks/usePagination',
  component: UsePaginationDocs,
  excludeStories: ['UsePaginationDocs'],
} as Meta

const Template: Story<UsePaginationDocsProps> = (args) => {
  const {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isNextDisabled,
    isPreviousDisabled,
    setPage,
  } = usePagination(args)
  return (
    <Column css={{ gap: '$2' }}>
      <Card>
        <CardBody>
          <Monospace>
            {JSON.stringify(
              {
                page,
                pageSize,
                totalPages,
                startIndex,
                endIndex,
                isNextDisabled,
                isPreviousDisabled,
              },
              null,
              2
            )}
          </Monospace>
        </CardBody>
      </Card>
      <Pagination page={page} onPageChange={setPage} count={totalPages} />
    </Column>
  )
}

export const Default = Template.bind({})
Default.args = { totalItems: 100, pageSize: 20 }

export const ClientSide: Story = () => {
  const items = Array.from({ length: 100 }, (v, i) => i)
  const { page, totalPages, startIndex, endIndex, setPage } = usePagination({
    totalItems: 100,
    pageSize: 20,
  })

  return (
    <>
      <Row css={{ gap: '$2', mb: '$3' }}>
        {items.slice(startIndex, endIndex).map((item) => (
          <div key={`${item}`}>{item}</div>
        ))}
      </Row>
      <Pagination page={page} onPageChange={setPage} count={totalPages} />
    </>
  )
}
ClientSide.parameters = {
  docs: {
    description: {
      story:
        'The hook can use used to manage pagination for a known long list on the client side by providing the relevant start data. Then use the `startIndex` and `endIndex` to slice the data.',
    },
  },
}

type User = {
  id: number
  name: string
  email: string
  gender: string
  status: string
}

export const ServerSide: Story = () => {
  const {
    page,
    pageSize,
    totalPages,
    query,
    setPage,
    setTotalItems,
    setPageSize,
  } = usePagination({
    queryCallback: ({ page, pageSize }) => `page=${page}&per_page=${pageSize}`,
  })

  const { data } = useSwr(
    ['https://gorest.co.in/public/v2/users', query],
    async ([url, query]) => {
      const res = await fetch(`${url}?${query}`)

      const users = (await res.json()) as User[]
      const totalItems = Number(res.headers.get('x-pagination-total'))
      setTotalItems(totalItems)
      return {
        users,
        totalItems,
      }
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  return (
    <Column css={{ gap: '$3' }}>
      <Pagination page={page} onPageChange={setPage} count={totalPages} />
      <Slider
        labelFunction={(value) => `Page size ${value}`}
        value={[pageSize]}
        onValueChange={(value) => setPageSize(value[0])}
      />
      <div>
        {(data?.users ?? []).map((item) => (
          <div key={`${item.name}`}>{item.name}</div>
        ))}
      </div>
    </Column>
  )
}
ServerSide.parameters = {
  docs: {
    description: {
      story:
        'The hook can use used to manage pagination for remote data by setting the total items after the first call. The `startIndex` or `page` can be used in the API query.',
    },
  },
}

export const MakeYourOwn: Story = () => {
  const items = Array.from({ length: 100 }, (v, i) => i)
  const {
    page,
    startIndex,
    endIndex,
    setNextPage,
    setPreviousPage,
    isNextDisabled,
    isPreviousDisabled,
  } = usePagination({
    totalItems: 100,
    pageSize: 20,
  })

  return (
    <>
      <Row css={{ gap: '$2', mb: '$3' }}>
        {items.slice(startIndex, endIndex).map((item) => (
          <div>{item}</div>
        ))}
      </Row>
      <Row css={{ gap: '$2' }}>
        <Button disabled={isPreviousDisabled} onClick={setPreviousPage}>
          Previous
        </Button>
        <Chip>{`Page ${page}`}</Chip>
        <Button disabled={isNextDisabled} onClick={setNextPage}>
          Next
        </Button>
      </Row>
    </>
  )
}
MakeYourOwn.parameters = {
  docs: {
    description: {
      story:
        'The data can be used to manage a `Pagination` component or you can create your own.',
    },
  },
}

const ChildWithPagination = ({ items, pageSize }) => {
  const { page, totalPages, startIndex, endIndex, setPage } = usePagination({
    totalItems: items.length,
    pageSize,
  })

  return (
    <>
      <Row css={{ gap: '$2', mb: '$3' }}>
        {items.slice(startIndex, endIndex).map((item) => (
          <div key={`${item}`}>{item}</div>
        ))}
      </Row>
      <Pagination page={page} onPageChange={setPage} count={totalPages} />
    </>
  )
}

export const PropChangeTest: Story = () => {
  const [totalItems, setTotalItems] = useState(100)
  const [pageSize, setPageSize] = useState(10)

  const items = useMemo(
    () => Array.from({ length: totalItems }, (v, i) => i),
    [totalItems]
  )

  return (
    <>
      <Slider
        labelFunction={(value) => `Items ${value}`}
        value={[totalItems]}
        onValueChange={(value) => setTotalItems(value[0])}
      />
      <Slider
        labelFunction={(value) => `Page size ${value}`}
        value={[pageSize]}
        onValueChange={(value) => setPageSize(value[0])}
      />
      <ChildWithPagination items={items} pageSize={pageSize} />
    </>
  )
}
PropChangeTest.parameters = {
  docs: {
    description: {
      story:
        'A test story to check the values correctly update when the component props change.',
    },
  },
}
