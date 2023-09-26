<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- <div
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div> -->
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тікер {{ ticker }}</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                v-on:keydown.enter="add()"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Наприклад DOGE"
              />
            </div>
            <div
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                @:click="this.ticker = 'BTC'"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                BTC
              </span>
              <span
                @:click="this.ticker = 'DOGE'"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                DOGE
              </span>
              <span
                @:click="this.ticker = 'BCH'"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                BCH
              </span>
              <span
                @:click="this.ticker = 'CHD'"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                CHD
              </span>
            </div>
            <div
              v-if="this.listOfNames.indexOf(ticker) !== -1"
              class="text-sm text-red-600"
            >
              Цей тікер уже існує
            </div>
          </div>
        </div>
        <button
          v-on:click="add()"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <plus-sign-icon />
          Додати
        </button>
      </section>
      <template v-if="tickers.length > 0">
        <div>
          <div class="flex inline-flex items-center">
            Фільтр:
            <div class="mt-1 rounded-md shadow-md">
              <input v-model="filter" />
            </div>
            <button
              v-on:click="clearFilter()"
              type="button"
              class="my-4 ml-2 py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Очистити
            </button>
          </div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="number in filteredTickers()"
            v-bind:key="number"
            @click="select(number)"
            :class="{
              'border-4': selectedTicker == number,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ number.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ number.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(number)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <delete-icon />Видалити
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
        <section v-if="selectedTicker" class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ selectedTicker.name }} - USD
          </h3>
          <div class="flex items-end border-gray-600 border-b border-l h-64">
            <div
              v-for="(bar, idx) in normalizeGraph()"
              :key="idx"
              :style="{ height: `${bar}%` }"
              class="bg-purple-800 border w-10"
            ></div>
          </div>
          <button
            @click="selectedTicker = null"
            type="button"
            class="absolute top-0 right-0"
          >
            <close-icon></close-icon>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import { fetchTickerData } from "./fetchTickerData.js";
import { processTickerData } from "./processTickerData.js";
import PlusSignIcon from "./components/PlusSignIcon.vue";
import CloseIcon from "./components/CloseIcon.vue";
import DeleteIcon from "./components/DeleteIcon.vue";

export default {
  name: "App",

  components: {
    PlusSignIcon,
    CloseIcon,
    DeleteIcon,
  },

  data() {
    return {
      ticker: "",
      tickers: [],
      selectedTicker: null,
      graph: [],
      listOfNames: [],
      intervalID: null,
      tickersData: [],
      tickersNamesData: [],
      filter: "",
      intervalIDs: {},
    };
  },

  created() {
    this.tickersData = localStorage.getItem("cryptonomicon-list");
    this.tickersNamesData = localStorage.getItem("cryptonomicon-names");
    if (this.tickersNamesData) {
      this.listOfNames = JSON.parse(this.tickersNamesData);
    }
    console.log(this.listOfNames);
    if (this.tickersData) {
      this.tickers = JSON.parse(this.tickersData);
      this.tickers.forEach((ticker) => {
        const intervalID = setInterval(() => {
          this.fetchDataAndProcess(ticker);
        }, 6000);
        ticker.intervalID = intervalID;
        this.intervalIDs[ticker.name] = intervalID; // Зберігаємо intervalID в об'єкті intervalIDs
        console.log(`add fetch from localStorage - ${ticker.name}`);
        console.log(intervalID);
      });
    }
  },

  methods: {
    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    clearFilter() {
      this.filter = "";
    },

    fetchDataAndProcess(newTicker) {
      fetchTickerData(newTicker)
        .then((data) => {
          processTickerData(
            this.tickers,
            this.selectedTicker,
            this.graph,
            newTicker,
            data
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    add() {
      const newTicker = { name: this.ticker, price: "-" };
      console.log(typeof this.listOfNames);
      console.log(this.listOfNames);
      if (this.listOfNames.indexOf(newTicker.name) === -1) {
        this.listOfNames.push(newTicker.name);
        this.tickers.push(newTicker);
        console.log(this.tickers);

        console.log(localStorage);

        const intervalID = setInterval(() => {
          this.fetchDataAndProcess(newTicker);
        }, 6000);
        newTicker.intervalID = intervalID;
        this.intervalIDs[newTicker.name] = intervalID; // Зберігаємо intervalID в об'єкті intervalIDs
        console.log(`add fetch add - ${newTicker.name}`);
        console.log(intervalID);
        console.log(this.tickers);
        console.log(this.listOfNames);
        localStorage.setItem(
          "cryptonomicon-list",
          JSON.stringify(this.tickers)
        );
        localStorage.setItem(
          "cryptonomicon-names",
          JSON.stringify(this.listOfNames)
        );
      }
      this.ticker = "";
    },

    select(ticker) {
      this.selectedTicker = ticker;
      this.graph = [];
    },

    handleDelete(tickerToRemove) {
      console.log(
        `removing ${tickerToRemove.name} - ${tickerToRemove.intervalID}`
      );
      clearInterval(tickerToRemove.intervalID);
      this.tickers = this.tickers.filter(
        (ticker) => ticker.name !== tickerToRemove.name
      );
      this.listOfNames = this.listOfNames.filter(
        (name) => name !== tickerToRemove.name
      );
      localStorage.setItem(
        "cryptonomicon-names",
        JSON.stringify(this.listOfNames)
      );

      if (this.tickersData) {
        const cryptoList = JSON.parse(this.tickersData);
        const updatedCryptoList = cryptoList.filter(
          (item) => item.name !== tickerToRemove.name
        );

        localStorage.setItem(
          "cryptonomicon-list",
          JSON.stringify(updatedCryptoList)
        );

        if (this.tickers.length === 0) {
          localStorage.removeItem("cryptonomicon-list");
        }
      }

      console.log(localStorage);
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
  },
};
</script>
<style src="./app.css"></style>
