
const searchTransactionEvent = `
  query ($query: String! $limit: Int64!, $lowBlockNum: Int64) {
      searchTransactions(
        indexName: LOGS, 
        query: $query, 
        limit: $limit, 
        lowBlockNum: $lowBlockNum,
        sort: DESC
      ) {
        edges {
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
