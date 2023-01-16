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
import React, { useEffect, useMemo } from 'react'
import useSwr from 'swr'
import { usePagination } from '.'

export interface UsePaginationDocsProps {
  /** The total number of items, if know when initializing, use setTotalItems if not */
  totalItems: number
  /** The page to start on */
  startPage: number
  /** The size of each page */
  pageSize: number
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
Default.args = { totalItems: 100, startPage: 1, pageSize: 20 }

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
          <div>{item}</div>
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
  const { page, pageSize, totalPages, setPage, setTotalItems, setPageSize } =
    usePagination()

  const { data } = useSwr(
    ['https://gorest.co.in/public/v2/users', page, pageSize],
    async ([url, page, pageSize]) => {
      const res = await fetch(`${url}?page=${page - 1}&per_page=${pageSize}`)

      const users = (await res.json()) as User[]
      const totalItems = Number(res.headers.get('x-pagination-total'))

      return {
        users,
        totalItems,
      }
    },
    { refreshInterval: 0, shouldRetryOnError: false }
  )

  const users = useMemo(() => {
    return data?.users ?? []
  }, [data])

  useEffect(() => {
    if (data?.totalItems) {
      setTotalItems(data.totalItems)
    }
  }, [data])

  return (
    <Column css={{ gap: '$3' }}>
      <Pagination page={page} onPageChange={setPage} count={totalPages} />
      <Slider
        labelFunction={(value) => `Page size ${value}`}
        value={[pageSize]}
        onValueChange={(value) => setPageSize(value[0])}
      />
      <div>
        {users.map((item) => (
          <div>{item.name}</div>
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
