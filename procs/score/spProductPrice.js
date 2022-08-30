/*
  spProductPrice
  Testilo score proc productPrice

  Computes scores from Testaro script productPrice and adds them to a report.
  Usage examples:
    node score spProductPrice 35k1r
    node score spProductPrice

  This proc computes a score that is intended to represent how accessibly a website offers
    a user an opportunity to determine the price at which the website owner offers a product.
    Scores can range from perfect 0 to 16.
*/

// CONSTANTS

// ID of this proc.
const scoreProcID = 'productprice';

// FUNCTIONS

// Returns whether a text contains a U.S. price.
const hasPrice = text => /\$ ?\d*(?:,\d{3})?(?:\.\d{2})?(?: *USD)?/.test(text);
// Scores a report.
exports.scorer = async report => {
  const {acts} = report;
  report.scoreProcID = scoreProcID;
  report.score = {
    pageLoad: 0,
    pageFast: 0,
    searchInput: 0,
    searchWork: 0,
    searchFast: 0,
    nameInPage: 0,
    nameInNode: 0,
    nameProp: 0,
    price: 0,
    priceProximity: 0,
    priceProp: 0
  };
  const {score} = report;
  if (Array.isArray(acts)) {
    // Act 1: If the page loaded:
    if (acts[1].result.startsWith('http')) {
      score.pageLoad = 2;
      // Score how fast it loaded.
      const loadTime = acts[1].endTime - acts[1].startTime;
      if (loadTime < 4000) {
        score.pageFast = 2;
      }
      else if (loadTime < 6000) {
        score.pageFast = 1;
      }
      // Act 2: If the page has a search input:
      const {result} = acts[2];
      if (result.found) {
        score.searchInput = 1;
        // If it works:
        if (result.success) {
          score.searchWork = 2;
          // Score how fast it works.
          const loadTime = acts[2].endTime - acts[2].startTime;
          if (loadTime < 3000) {
            score.searchFast = 3;
          }
          else if (loadTime < 5000) {
            score.a11yLinkFast = 2;
          }
          else if (loadTime < 7000) {
            score.a11yLinkFast = 1;
          }
          // Act 3: If the product is named on the result page:
          let {result} = acts[3];
          if (result && result.success) {
            score.nameInPage = 2;
            // Act 4: If the product is named by any text node:
            result = acts[4].result;
            if (result && result.nodeCount) {
              score.nameInNode = 2;
              // If any such text node semantically marks the name:
              if (result.items.some(item => {
                const parent = item.ancestors[0];
                return parent.attributes.some(
                  attribute => attribute.name === 'itemprop' && attribute.value === 'name'
                );
              })) {
                score.nameProp = 3;
              }
              // Act 4: If a price appears in the text content of an ancestor:
              const priceInContext = result.items.some(
                item => item.ancestors.some(ancestor => ancestor.text && hasPrice(ancestor.text))
              );
              if (priceInContext) {
                score.price = 1;
                // Act 4: Proximity and semantic specification of a price.
                let priceDistance = Infinity;
                result.items.forEach(item => {
                  const itemPriceDistance = item.ancestors.findIndex(
                    ancestor => ancestor.text && hasPrice(ancestor.text)
                  );
                  if (itemPriceDistance > -1 && itemPriceDistance < priceDistance) {
                    priceDistance = itemPriceDistance;
                    if (
                      ancestor.attributes
                      && ancestor.attributes.some(
                        attribute => attribute.name === 'itemprop' && attribute.value === 'price'
                      )
                    ) {
                      score.priceProp = 3;
                    }
                  }
                });
                if (priceDistance < Infinity) {
                  score.priceProximity = 6 - priceDistance;
                }
              }
            }
          }
        }
      }
    }
  }
  score.total = Object.values(score).reduce((total, current) => total + current);
};
