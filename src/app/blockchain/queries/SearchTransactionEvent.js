
const searchTransactionEvent = `
  query ($query: String! $limit: Int64!, $lowBlockNum: Int64, $cursor: String!) {
      searchTransactions(
        indexName: LOGS, 
        query: $query, 
        limit: $limit, 
        lowBlockNum: $lowBlockNum,
        cursor: $cursor,
        sort: DESC
      ) {
        edges {
          cursor
          node {
            hash
            from
            to
            value(encoding: WEI)
            gasLimit
            gasPrice(encoding: WEI)
            
            matchingLogs {
              data
              topics
              address
            }
          }
        }
      }
    }
`;

export { searchTransactionEvent };
