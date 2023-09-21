export function fetchTickerData(newTicker) {
  if (newTicker.intervalID) {
    console.log(
      `Fetching... ${newTicker.name} - ${newTicker.price} - ${newTicker.intervalID}`
    );
    return fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${newTicker.name}&tsyms=USD&api_key=89070d6ae5c802d1bbf5007c8e6b1644f9d151ff34df51d382c9d017f30b3a2e`
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  } else {
    return Promise.reject("Invalid interval ID");
  }
}
