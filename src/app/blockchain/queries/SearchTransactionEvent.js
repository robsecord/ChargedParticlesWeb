
const FlatCallFragment = `
  fragment FlatCallFragment on Call {
    index
    depth
    parentIndex
    callType
    from
    to
    value(encoding:WEI)
    gasConsumed
    inputData
    returnData
    logs {
      address
      topics
      data
    }
    balanceChanges{
      reason
      address
      oldValue(encoding:WEI)
      newValue(encoding:WEI)
    }
    storageChanges{
      key
      address
      oldValue
      newValue
    }
  }
`;

const searchTransactionEvent = `
  query ($query: String!, $indexName:TRANSACTIONS_INDEX_NAME!, $lowBlockNum: Int64, $highBlockNum: Int64, $sort: SORT!, $cursor: String!, $limit: Int64!){
    searchTransactions(query: $query, indexName: $indexName, lowBlockNum: $lowBlockNum, highBlockNum: $highBlockNum, sort: $sort,  cursor: $cursor, limit: $limit) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        undo
        cursor
        node {
          value(encoding:WEI)
          hash
          nonce
          gasLimit
          gasUsed
          gasPrice(encoding:WEI)
          to
          block {
            number
            hash
            header {
              timestamp
            }
          }
          flatCalls {
            ...FlatCallFragment
          }
        }
      }
    }
  }
  
  ${FlatCallFragment}
`;

export { searchTransactionEvent };
