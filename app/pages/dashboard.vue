<script setup lang="ts">
import { DEFAULT_WATCHLIST_SYMBOLS } from '@/features/market/constants/defaultWatchlist'

definePageMeta({ layout: 'default' })

const { data, pending, error, refresh } = await useMarketPrices([
  ...DEFAULT_WATCHLIST_SYMBOLS
])
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
      Dashboard
    </h1>

    <section aria-labelledby="prices-heading">
      <h2 id="prices-heading" class="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        Current prices (batch)
      </h2>

      <p v-if="pending" class="text-gray-600 dark:text-gray-400">
        Loading prices…
      </p>

      <div
        v-else-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        role="alert"
      >
        <span>Could not load prices.</span>
        <button
          type="button"
          class="ml-2 underline decoration-red-800 underline-offset-2 hover:no-underline dark:decoration-red-200"
          @click="refresh()"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="data?.length"
        class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
      >
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/40">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300" scope="col">
                Symbol
              </th>
              <th class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300" scope="col">
                Price
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="row in data" :key="row.symbol">
              <td class="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">
                {{ row.symbol }}
              </td>
              <td class="px-4 py-3 font-mono tabular-nums text-gray-900 dark:text-white">
                {{ row.price }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
