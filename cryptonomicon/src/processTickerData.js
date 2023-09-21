export function processTickerData(
  tickers,
  selectedTicker,
  graph,
  newTicker,
  data
) {
  const tickerToUpdate = tickers.find(
    (number) => number.name === newTicker.name
  );
  if (tickerToUpdate) {
    tickerToUpdate.price =
      data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
  }

  if (selectedTicker?.name === newTicker.name) {
    graph.push(data.USD);
  }

  localStorage.setItem("cryptonomicon-list", JSON.stringify(tickers));
}
