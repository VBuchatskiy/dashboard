<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data, pending, error, refresh } = await useMarketBookTicker('ETHUSDT')
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
      Profile
    </h1>

    <section aria-labelledby="book-heading">
      <h2 id="book-heading" class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        Best bid / ask (ETHUSDT)
      </h2>

      <p v-if="pending" class="text-gray-600 dark:text-gray-400">
        Loading book…
      </p>

      <div
        v-else-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        role="alert"
      >
        <span>Could not load book ticker.</span>
        <button
          type="button"
          class="ml-2 underline decoration-red-800 underline-offset-2 hover:no-underline dark:decoration-red-200"
          @click="refresh()"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="data"
        class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
      >
        <p class="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {{ data.symbol }}
        </p>
        <dl class="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-gray-500 dark:text-gray-400">
              Bid
            </dt>
            <dd class="mt-0.5 font-mono tabular-nums text-gray-900 dark:text-white">
              {{ data.bidPrice }}
              <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">× {{ data.bidQty }}</span>
            </dd>
          </div>
          <div>
            <dt class="text-gray-500 dark:text-gray-400">
              Ask
            </dt>
            <dd class="mt-0.5 font-mono tabular-nums text-gray-900 dark:text-white">
              {{ data.askPrice }}
              <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">× {{ data.askQty }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>
